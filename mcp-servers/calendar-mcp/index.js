#!/usr/bin/env node
import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { addDays, subDays, format, parseISO } from "date-fns";

// --- 1. Setup Express ---
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3004;

// --- 2. Auth & Paths ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

async function authorize() {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("token.json not found.");
  }
  const content = fs.readFileSync(TOKEN_PATH);
  const credentials = JSON.parse(content);
  return google.auth.fromJSON(credentials);
}

// --- 3. Setup MCP Server ---
const server = new Server(
  { name: "calendar-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_upcoming_events",
        description: "List calendar events for the next X days.",
        inputSchema: {
          type: "object",
          properties: { days: { type: "number", default: 7 } },
        },
      },
      {
        name: "create_event",
        description: "Create a single calendar event.",
        inputSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            description: { type: "string" },
            start_time: { type: "string" },
            end_time: { type: "string" },
          },
          required: ["summary", "start_time", "end_time"],
        },
      },
      {
        name: "create_training_schedule",
        description: "Auto-generates a preparation plan.",
        inputSchema: {
          type: "object",
          properties: {
            job_title: { type: "string" },
            company: { type: "string" },
            interview_date: { type: "string" },
          },
          required: ["job_title", "company", "interview_date"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth });

  try {
    if (name === "list_upcoming_events") {
      const days = args.days || 7;
      const now = new Date();
      const end = addDays(now, days);

      const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = res.data.items || [];
      if (events.length === 0) return { content: [{ type: "text", text: "No upcoming events." }] };

      const summary = events.map((event) => {
        const start = event.start.dateTime || event.start.date;
        return `- ${start}: ${event.summary}`;
      });
      return { content: [{ type: "text", text: `Upcoming:\n${summary.join("\n")}` }] };
    }

    if (name === "create_event") {
      const event = {
        summary: args.summary,
        description: args.description,
        start: { dateTime: args.start_time, timeZone: "UTC" },
        end: { dateTime: args.end_time, timeZone: "UTC" },
      };
      const res = await calendar.events.insert({ calendarId: "primary", requestBody: event });
      return { content: [{ type: "text", text: `Event created: ${res.data.htmlLink}` }] };
    }

    if (name === "create_training_schedule") {
      const interviewDate = parseISO(args.interview_date);
      const schedule = [];
      const plan = [
        { daysBefore: 1, title: "Revision", focus: "Review notes." },
        { daysBefore: 2, title: "Mock Interview", focus: "Practice pitch." },
        { daysBefore: 3, title: "Culture Research", focus: "Values & Mission." },
      ];

      for (const item of plan) {
        const date = subDays(interviewDate, item.daysBefore);
        const start = new Date(date); start.setHours(18, 0, 0); 
        const end = new Date(date); end.setHours(19, 0, 0);
        if (start < new Date()) continue;

        const event = {
          summary: `Prep: ${item.title} (${args.company})`,
          description: `Focus: ${item.focus}`,
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
        };
        await calendar.events.insert({ calendarId: "primary", requestBody: event });
        schedule.push(`- Scheduled: ${item.title} on ${format(start, 'yyyy-MM-dd')}`);
      }
      return { content: [{ type: "text", text: `Plan Generated:\n${schedule.join("\n")}` }] };
    }

    return { content: [{ type: "text", text: `Tool ${name} not found.` }], isError: true };
  } catch (error) {
    return { content: [{ type: "text", text: `Calendar API Error: ${error.message}` }], isError: true };
  }
});

// --- 4. SSE Transport Setup ---
let transport;
app.get("/sse", async (req, res) => {
  console.log("Calendar MCP: Client connected via SSE");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});
app.post("/messages", async (req, res) => {
  if (transport) await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Calendar MCP running on http://localhost:${PORT}/sse`);
});