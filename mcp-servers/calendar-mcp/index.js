#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { addDays, subDays, format, parseISO, startOfDay } from "date-fns";

// File paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

// Load Auth Helper
async function authorize() {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("token.json not found. Run 'node get-token.js' first.");
  }
  const content = fs.readFileSync(TOKEN_PATH);
  const credentials = JSON.parse(content);
  return google.auth.fromJSON(credentials);
}

const server = new Server(
  {
    name: "calendar-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_upcoming_events",
        description: "List calendar events for the next X days.",
        inputSchema: {
          type: "object",
          properties: {
            days: { type: "number", description: "Number of days to look ahead", default: 7 },
          },
        },
      },
      {
        name: "create_event",
        description: "Create a single calendar event.",
        inputSchema: {
          type: "object",
          properties: {
            summary: { type: "string", description: "Event title" },
            description: { type: "string", description: "Event details" },
            start_time: { type: "string", description: "ISO date string (e.g. 2023-10-27T10:00:00)" },
            end_time: { type: "string", description: "ISO date string" },
          },
          required: ["summary", "start_time", "end_time"],
        },
      },
      {
        name: "create_training_schedule",
        description: "Auto-generates a multi-day preparation plan leading up to an interview.",
        inputSchema: {
          type: "object",
          properties: {
            job_title: { type: "string" },
            company: { type: "string" },
            interview_date: { type: "string", description: "ISO date of the interview (e.g. 2023-11-01T14:00:00)" },
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
    // 📅 TOOL: LIST EVENTS
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
      if (events.length === 0) {
        return { content: [{ type: "text", text: "No upcoming events found." }] };
      }

      const summary = events.map((event) => {
        const start = event.start.dateTime || event.start.date;
        return `- ${start}: ${event.summary}`;
      });

      return { content: [{ type: "text", text: `Upcoming Events:\n${summary.join("\n")}` }] };
    }

    // ➕ TOOL: CREATE EVENT
    if (name === "create_event") {
      const event = {
        summary: args.summary,
        description: args.description,
        start: { dateTime: args.start_time, timeZone: "UTC" }, // Adjust timeZone as needed
        end: { dateTime: args.end_time, timeZone: "UTC" },
      };

      const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      return { content: [{ type: "text", text: `Event created: ${res.data.htmlLink}` }] };
    }

    // 🚀 TOOL: CREATE TRAINING SCHEDULE (The Agentic Logic)
    if (name === "create_training_schedule") {
      const interviewDate = parseISO(args.interview_date);
      const schedule = [];

      // Define the plan (working backwards from interview)
      const plan = [
        { daysBefore: 1, title: "Revision & Mock Interview", focus: "Review notes, practice pitch, sleep early." },
        { daysBefore: 2, title: "Technical Deep Dive", focus: "Coding challenges, system design, technical concepts." },
        { daysBefore: 3, title: "Project Storytelling", focus: "Refine STAR method stories for resume projects." },
        { daysBefore: 4, title: "Company Culture Research", focus: "Values, mission, leadership principles." },
      ];

      for (const item of plan) {
        const date = subDays(interviewDate, item.daysBefore);
        // Defaulting training sessions to 6 PM - 8 PM
        const start = new Date(date);
        start.setHours(18, 0, 0); 
        const end = new Date(date);
        end.setHours(20, 0, 0);

        // Don't schedule in the past
        if (start < new Date()) continue;

        const event = {
          summary: `Prep: ${item.title} (${args.company})`,
          description: `Focus Area: ${item.focus}\nRole: ${args.job_title}`,
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
        };

        const res = await calendar.events.insert({
          calendarId: "primary",
          requestBody: event,
        });
        schedule.push(`- Scheduled: ${item.title} on ${format(start, 'yyyy-MM-dd HH:mm')}`);
      }

      return { 
        content: [{ 
          type: "text", 
          text: `Training Plan Generated for ${args.company} Interview:\n\n${schedule.join("\n")}\n\nGood luck!` 
        }] 
      };
    }

    return { content: [{ type: "text", text: `Tool ${name} not found.` }], isError: true };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Calendar API Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Calendar MCP Server running...");