#!/usr/bin/env node
import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium } from "playwright";
import * as cheerio from "cheerio";

// --- 1. Setup Express App for HTTP ---
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// --- 2. Setup MCP Server ---
const server = new Server(
  { name: "browser-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ... [INSERT YOUR EXISTING TOOLS AND LOGIC HERE] ...
// (Paste the 'ListToolsRequestSchema' and 'CallToolRequestSchema' handlers 
//  from your original file here)

// --- 3. Connect via SSE (Server-Sent Events) ---
let transport;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Browser MCP running on http://localhost:${PORT}/sse`);
});