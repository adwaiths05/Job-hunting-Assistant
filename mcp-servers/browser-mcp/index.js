#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium } from "playwright";
import * as cheerio from "cheerio";

// Initialize Server
const server = new Server(
  {
    name: "browser-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 🛠️ HELPER: Random Sleep (Human Behavior)
// Waits for a random time between min and max milliseconds
const randomSleep = (min, max) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search",
        description: "General web search. Use this for company research, culture, or interview questions.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "The search topic" },
          },
          required: ["query"],
        },
      },
      {
        name: "find_job_openings",
        description: "Specialized search for JOB LINKS on LinkedIn, Indeed, Glassdoor, Naukri, and Wellfound.",
        inputSchema: {
          type: "object",
          properties: {
            keyword: { type: "string", description: "Job title and location (e.g. 'React Developer remote')" },
          },
          required: ["keyword"],
        },
      },
      {
        name: "open_url",
        description: "Opens a webpage and returns the title and a preview of the text content.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The URL to open" },
          },
          required: ["url"],
        },
      },
      {
        name: "extract_all_text",
        description: "Extracts ALL text content from a webpage for deep analysis.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The URL to scrape" },
          },
          required: ["url"],
        },
      },
      {
        name: "extract_text",
        description: "Extracts text from a specific part of the page using a CSS selector.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The URL to scrape" },
            selector: { type: "string", description: "The CSS selector (e.g. '#responsibilities' or '.salary-info')" },
          },
          required: ["url", "selector"],
        },
      },
      {
        name: "extract_links",
        description: "Extracts all hyperlinks from a page. Useful for finding 'Apply' or 'Careers' links.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The URL to scrape" },
          },
          required: ["url"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const browser = await chromium.launch({ headless: true });
  
  // 🕵️‍♂️ ANTI-BOT: Set a real User Agent and Viewport
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  
  const page = await context.newPage();

  try {
    // 🔍 TOOL: SEARCH (General)
    if (name === "search") {
      const query = args.query;
      await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle' });
      
      // 💤 Wait 2-5 seconds (Human pause)
      await randomSleep(2000, 5000); 

      const content = await page.content();
      const $ = cheerio.load(content);
      
      const results = [];
      $('.result').each((i, el) => {
        if (i < 8) { 
          const title = $(el).find('.result__a').text().trim();
          const link = $(el).find('.result__a').attr('href');
          const snippet = $(el).find('.result__snippet').text().trim();
          if (title && link) {
            results.push(`Title: ${title}\nLink: ${link}\nSummary: ${snippet}\n---`);
          }
        }
      });
      await browser.close();
      return { content: [{ type: "text", text: `Search Results for "${query}":\n\n${results.join('\n')}` }] };
    }

    // 💼 TOOL: FIND JOB OPENINGS (Targeted)
    if (name === "find_job_openings") {
      const keyword = args.keyword;
      const siteQuery = `(site:linkedin.com/jobs OR site:indeed.com/viewjob OR site:naukri.com/job-listings OR site:glassdoor.com/job-listing OR site:wellfound.com/jobs) ${keyword}`;
      
      await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(siteQuery)}`, { waitUntil: 'networkidle' });
      
      // 💤 Wait 3-6 seconds (Human pause)
      await randomSleep(3000, 6000);

      const content = await page.content();
      const $ = cheerio.load(content);
      
      const jobs = [];
      $('.result').each((i, el) => {
        if (i < 10) { 
          const title = $(el).find('.result__a').text().trim();
          const link = $(el).find('.result__a').attr('href');
          if (title && link) {
            jobs.push(`JOB: ${title}\nURL: ${link}\n---`);
          }
        }
      });
      await browser.close();
      return { content: [{ type: "text", text: `Found Job Openings for "${keyword}":\n\n${jobs.join('\n')}` }] };
    }

    // 🌐 SHARED LOGIC FOR PAGE VISITS
    if (['open_url', 'extract_all_text', 'extract_text', 'extract_links'].includes(name)) {
      await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // 💤 Wait 1-3 seconds for dynamic content to settle
      await randomSleep(1000, 3000);

      const content = await page.content();
      const $ = cheerio.load(content);

      // Clean up common junk
      $('script').remove();
      $('style').remove();
      $('nav').remove();
      $('footer').remove();
      $('.cookie-consent').remove(); // Try to remove cookie banners

      // 📖 TOOL: OPEN URL (Preview)
      if (name === "open_url") {
        const title = $('title').text().trim();
        const text = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000);
        await browser.close();
        return { content: [{ type: "text", text: `Page: ${title}\n\nPreview:\n${text}...` }] };
      }

      // 📑 TOOL: EXTRACT ALL TEXT (Full)
      if (name === "extract_all_text") {
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        await browser.close();
        return { content: [{ type: "text", text: text }] };
      }

      // 🎯 TOOL: EXTRACT TEXT (Selector)
      if (name === "extract_text") {
        const text = $(args.selector).text().replace(/\s+/g, ' ').trim();
        await browser.close();
        return { content: [{ type: "text", text: text || "No content found for selector." }] };
      }

      // 🔗 TOOL: EXTRACT LINKS
      if (name === "extract_links") {
        const links = [];
        $('a').each((i, el) => {
          const text = $(el).text().trim();
          const href = $(el).attr('href');
          if (text && href && href.startsWith('http')) {
            links.push(`[${text}](${href})`);
          }
        });
        await browser.close();
        return { content: [{ type: "text", text: `Links found:\n${links.slice(0, 50).join('\n')}` }] };
      }
    }

  } catch (error) {
    if (browser) await browser.close();
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Browser MCP Server running...");