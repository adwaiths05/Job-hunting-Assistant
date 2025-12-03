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

// --- 1. Setup Express ---
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3003;

// --- 2. Auth & File Paths ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

async function authorize() {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("token.json not found. Run 'node get-token.js' first.");
  }
  const content = fs.readFileSync(TOKEN_PATH);
  const credentials = JSON.parse(content);
  return google.auth.fromJSON(credentials);
}

function createEmail(to, subject, message) {
  const str = [
    'Content-Type: text/plain; charset="UTF-8"',
    "MIME-Version: 1.0",
    "Content-Transfer-Encoding: 7bit",
    `to: ${to}`,
    `subject: ${subject}`,
    "",
    message,
  ].join("\n");

  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// --- 3. Setup MCP Server ---
const server = new Server(
  { name: "gmail-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_messages",
        description: "Search for emails in your Gmail inbox.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            max_results: { type: "number", default: 10 },
          },
          required: ["query"],
        },
      },
      {
        name: "read_message",
        description: "Read the full content of an email by its ID.",
        inputSchema: {
          type: "object",
          properties: {
            message_id: { type: "string" },
          },
          required: ["message_id"],
        },
      },
      {
        name: "send_message",
        description: "Send a new email.",
        inputSchema: {
          type: "object",
          properties: {
            to: { type: "string" },
            subject: { type: "string" },
            body: { type: "string" },
          },
          required: ["to", "subject", "body"],
        },
      },
      {
        name: "find_interview_invites",
        description: "Search to find recent interview requests.",
        inputSchema: { type: "object", properties: {} },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });

  try {
    if (name === "list_messages") {
      const res = await gmail.users.messages.list({
        userId: "me",
        q: args.query,
        maxResults: args.max_results || 10,
      });
      const messages = res.data.messages || [];
      if (messages.length === 0) return { content: [{ type: "text", text: "No emails found." }] };

      const summaries = [];
      for (const msg of messages) {
        const details = await gmail.users.messages.get({ userId: "me", id: msg.id });
        const subject = details.data.payload.headers.find(h => h.name === "Subject")?.value || "(No Subject)";
        const from = details.data.payload.headers.find(h => h.name === "From")?.value || "Unknown";
        summaries.push(`- [ID: ${msg.id}] FROM: ${from} | SUBJECT: ${subject}`);
      }
      return { content: [{ type: "text", text: `Found emails:\n${summaries.join("\n")}` }] };
    }

    if (name === "read_message") {
      const res = await gmail.users.messages.get({ userId: "me", id: args.message_id, format: "full" });
      const headers = res.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value;
      const from = headers.find((h) => h.name === "From")?.value;
      const date = headers.find((h) => h.name === "Date")?.value;
      let body = "Unable to decode body.";
      // Simplified body decoding
      const parts = res.data.payload.parts || [res.data.payload];
      for (const part of parts) {
        if (part.mimeType === "text/plain" && part.body.data) {
          body = Buffer.from(part.body.data, "base64").toString("utf-8");
          break;
        }
      }
      return { content: [{ type: "text", text: `Date: ${date}\nFrom: ${from}\nSubject: ${subject}\n\n${body}` }] };
    }

    if (name === "send_message") {
      const rawMessage = createEmail(args.to, args.subject, args.body);
      const res = await gmail.users.messages.send({ userId: "me", requestBody: { raw: rawMessage } });
      return { content: [{ type: "text", text: `Email sent! ID: ${res.data.id}` }] };
    }

    if (name === "find_interview_invites") {
      const query = "subject:(interview OR invitation OR scheduling) newer_than:14d";
      const res = await gmail.users.messages.list({ userId: "me", q: query, maxResults: 5 });
      const messages = res.data.messages || [];
      if (messages.length === 0) return { content: [{ type: "text", text: "No recent interview invites found." }] };
      
      const fullContent = [];
      for (const msg of messages) {
        const details = await gmail.users.messages.get({ userId: "me", id: msg.id });
        const subject = details.data.payload.headers.find(h => h.name === "Subject")?.value;
        const snippet = details.data.snippet;
        fullContent.push(`ID: ${msg.id} | SUBJECT: ${subject} | SNIPPET: ${snippet}`);
      }
      return { content: [{ type: "text", text: `Potential Invites:\n${fullContent.join("\n")}` }] };
    }

    return { content: [{ type: "text", text: `Tool ${name} not found.` }], isError: true };
  } catch (error) {
    return { content: [{ type: "text", text: `Gmail API Error: ${error.message}` }], isError: true };
  }
});

// --- 4. SSE Transport Setup ---
let transport;
app.get("/sse", async (req, res) => {
  console.log("Gmail MCP: Client connected via SSE");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});
app.post("/messages", async (req, res) => {
  if (transport) await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Gmail MCP running on http://localhost:${PORT}/sse`);
});