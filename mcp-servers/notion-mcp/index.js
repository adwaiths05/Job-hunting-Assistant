#!/usr/bin/env node
import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// --- 1. Setup Express ---
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// --- 2. Auth ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY });

// --- 3. Setup MCP Server ---
const server = new Server(
  { name: "notion-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add_job",
        description: "Adds a new job application.",
        inputSchema: {
          type: "object",
          properties: {
            company: { type: "string" },
            role: { type: "string" },
            link: { type: "string" },
            status: { type: "string", default: "Applied" }
          },
          required: ["company", "role", "link"],
        },
      },
      {
        name: "list_jobs",
        description: "Lists all jobs.",
        inputSchema: { type: "object", properties: {} },
      },
      // ... (You can keep the other tools like add_note/add_checklist/add_training_material here)
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "add_job") {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          "Job Title": { title: [{ text: { content: args.role } }] },
          "Company": { rich_text: [{ text: { content: args.company } }] },
          "Link": { url: args.link },
          "Status": { select: { name: args.status || "Applied" } },
        },
      });
      return { content: [{ type: "text", text: `Job added: ${args.role} at ${args.company} (ID: ${response.id})` }] };
    }

    if (name === "list_jobs") {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
      });
      const jobs = response.results.map((page) => {
        const title = page.properties["Job Title"]?.title?.[0]?.plain_text || "Unknown";
        const company = page.properties["Company"]?.rich_text?.[0]?.plain_text || "Unknown";
        return `- ${title} at ${company} (${page.properties["Status"]?.select?.name})`;
      });
      return { content: [{ type: "text", text: `Jobs:\n${jobs.join("\n")}` }] };
    }
    
    return { content: [{ type: "text", text: `Tool ${name} not found.` }], isError: true };
  } catch (error) {
    return { content: [{ type: "text", text: `Notion Error: ${error.message}` }], isError: true };
  }
});

// --- 4. SSE Transport Setup ---
let transport;
app.get("/sse", async (req, res) => {
  console.log("Notion MCP: Client connected via SSE");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});
app.post("/messages", async (req, res) => {
  if (transport) await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Notion MCP running on http://localhost:${PORT}/sse`);
});