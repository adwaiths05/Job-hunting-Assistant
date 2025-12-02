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
    name: "gmail-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper to encode email for sending
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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_messages",
        description: "Search for emails in your Gmail inbox.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query (e.g. 'from:recruiter@google.com', 'subject:interview')" },
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
            message_id: { type: "string", description: "The ID of the email to read" },
          },
          required: ["message_id"],
        },
      },
      {
        name: "send_message",
        description: "Send a new email (for follow-ups or thank you notes).",
        inputSchema: {
          type: "object",
          properties: {
            to: { type: "string", description: "Recipient email address" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body content" },
          },
          required: ["to", "subject", "body"],
        },
      },
      {
        name: "find_interview_invites",
        description: "Smart search to find recent interview requests or scheduling emails.",
        inputSchema: {
          type: "object",
          properties: {}, 
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });

  try {
    // 📩 TOOL: LIST MESSAGES
    if (name === "list_messages") {
      const res = await gmail.users.messages.list({
        userId: "me",
        q: args.query,
        maxResults: args.max_results || 10,
      });

      const messages = res.data.messages || [];
      if (messages.length === 0) {
        return { content: [{ type: "text", text: "No emails found for that query." }] };
      }

      // Fetch snippets for context
      const summaries = [];
      for (const msg of messages) {
        const details = await gmail.users.messages.get({ userId: "me", id: msg.id });
        const subject = details.data.payload.headers.find(h => h.name === "Subject")?.value || "(No Subject)";
        const from = details.data.payload.headers.find(h => h.name === "From")?.value || "Unknown";
        summaries.push(`- [ID: ${msg.id}] FROM: ${from} | SUBJECT: ${subject} | SNIPPET: ${details.data.snippet}`);
      }

      return { content: [{ type: "text", text: `Found ${messages.length} emails:\n${summaries.join("\n")}` }] };
    }

    // 📖 TOOL: READ MESSAGE
    if (name === "read_message") {
      const res = await gmail.users.messages.get({
        userId: "me",
        id: args.message_id,
        format: "full",
      });

      const headers = res.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value;
      const from = headers.find((h) => h.name === "From")?.value;
      const date = headers.find((h) => h.name === "Date")?.value;
      
      // Basic body decoding (text/plain)
      let body = "Unable to decode body.";
      const parts = res.data.payload.parts || [res.data.payload];
      for (const part of parts) {
        if (part.mimeType === "text/plain" && part.body.data) {
          body = Buffer.from(part.body.data, "base64").toString("utf-8");
          break;
        }
      }

      return {
        content: [
          {
            type: "text",
            text: `Date: ${date}\nFrom: ${from}\nSubject: ${subject}\n\nBody:\n${body}`,
          },
        ],
      };
    }

    // 📤 TOOL: SEND MESSAGE
    if (name === "send_message") {
      const rawMessage = createEmail(args.to, args.subject, args.body);
      const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: rawMessage },
      });
      return { content: [{ type: "text", text: `Email sent successfully! ID: ${res.data.id}` }] };
    }

    // 🕵️‍♂️ TOOL: FIND INTERVIEW INVITES
    if (name === "find_interview_invites") {
      // Search for keywords often used in invites
      const query = "subject:(interview OR invitation OR scheduling OR availability) newer_than:14d";
      
      const res = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: 5,
      });

      const messages = res.data.messages || [];
      if (messages.length === 0) {
        return { content: [{ type: "text", text: "No recent interview invitations found in the last 14 days." }] };
      }

      // Automatically fetch full content for the Agent to analyze
      const fullContent = [];
      for (const msg of messages) {
        const details = await gmail.users.messages.get({ userId: "me", id: msg.id });
        const subject = details.data.payload.headers.find(h => h.name === "Subject")?.value;
        const from = details.data.payload.headers.find(h => h.name === "From")?.value;
        const snippet = details.data.snippet;
        fullContent.push(`EMAIL ID: ${msg.id}\nFROM: ${from}\nSUBJECT: ${subject}\nCONTENT: ${snippet}\n-------------------`);
      }

      return { 
        content: [{ 
          type: "text", 
          text: `Found ${messages.length} potential interview emails. Please analyze these to extract dates:\n\n${fullContent.join("\n")}` 
        }] 
      };
    }

    return { content: [{ type: "text", text: `Tool ${name} not found.` }], isError: true };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Gmail API Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Gmail MCP Server running...");