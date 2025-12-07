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

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

const server = new Server(
  { name: "browser-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "find_job_openings",
        description: "Searches for job openings on major platforms (LinkedIn, Glassdoor, Wellfound, Naukri, Indeed).",
        inputSchema: {
          type: "object",
          properties: {
            keyword: { type: "string", description: "Job title and location (e.g. 'Frontend Developer in Berlin')" },
          },
          required: ["keyword"],
        },
      },
      {
        name: "open_url",
        description: "Opens a URL and extracts text content.",
        inputSchema: {
          type: "object",
          properties: { url: { type: "string" } },
          required: ["url"],
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "find_job_openings") {
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      // ✅ UPDATED: Targeted search across all 5 requested platforms
      // Using 'OR' operator with specific site restrictions for better precision
      const sites = [
        "site:linkedin.com/jobs",
        "site:glassdoor.com",
        "site:wellfound.com",
        "site:naukri.com",
        "site:indeed.com"
      ];
      const siteQuery = sites.join(" OR ");
      const query = encodeURIComponent(`${args.keyword} (${siteQuery})`);
      
      await page.goto(`https://www.google.com/search?q=${query}`);
      
      const content = await page.content();
      const $ = cheerio.load(content);
      const results = [];

      // Generic selector for Google search results
      $('div.g').each((i, el) => {
        const title = $(el).find('h3').text();
        const link = $(el).find('a').attr('href');
        if (title && link) {
          results.push(`JOB: ${title}\nURL: ${link}\n---`);
        }
      });

      return { content: [{ type: "text", text: results.join("\n") || "No jobs found." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    } finally {
      if (browser) await browser.close();
    }
  }

  if (name === "open_url") {
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(args.url);
      const text = await page.evaluate(() => document.body.innerText);
      return { content: [{ type: "text", text: text.substring(0, 5000) }] }; 
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    } finally {
      if (browser) await browser.close();
    }
  }
});

let transport;
app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (transport) await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Browser MCP running on http://localhost:${PORT}/sse`);
});