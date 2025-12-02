#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error("Error: NOTION_API_KEY and NOTION_DATABASE_ID must be set in .env file");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

const server = new Server(
  {
    name: "notion-mcp",
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
        name: "add_job",
        description: "Adds a new job application to the tracker.",
        inputSchema: {
          type: "object",
          properties: {
            company: { type: "string" },
            role: { type: "string" },
            link: { type: "string", description: "URL to the job posting" },
            status: { type: "string", description: "Status: Applied, Interview, Offer, Rejected", default: "Applied" }
          },
          required: ["company", "role", "link"],
        },
      },
      {
        name: "list_jobs",
        description: "Lists all jobs currently being tracked, including their IDs and status.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "update_status",
        description: "Updates the status of a specific job application.",
        inputSchema: {
          type: "object",
          properties: {
            job_id: { type: "string", description: "The Notion Page ID of the job" },
            status: { type: "string", description: "New status: Applied, Interview, Offer, Rejected" },
          },
          required: ["job_id", "status"],
        },
      },
      {
        name: "add_note",
        description: "Adds a text note (culture insight, general thoughts) to a job page.",
        inputSchema: {
          type: "object",
          properties: {
            job_id: { type: "string", description: "The Notion Page ID" },
            content: { type: "string", description: "The content of the note" },
          },
          required: ["job_id", "content"],
        },
      },
      {
        name: "add_checklist",
        description: "Adds a checklist of tasks to a job page.",
        inputSchema: {
          type: "object",
          properties: {
            job_id: { type: "string", description: "The Notion Page ID" },
            tasks: { 
              type: "array", 
              items: { type: "string" },
              description: "List of tasks to add" 
            },
          },
          required: ["job_id", "tasks"],
        },
      },
      // ✅ NEW: Added to fully meet your spec
      {
        name: "add_training_material",
        description: "Saves personalized training content (interview answers, project scripts, behavioral stories) to the job page.",
        inputSchema: {
          type: "object",
          properties: {
            job_id: { type: "string", description: "The Notion Page ID" },
            content: { type: "string", description: "The training material content" },
            type: { type: "string", description: "Type of material (e.g. 'Behavioral', 'Technical', 'Project')", default: "General" }
          },
          required: ["job_id", "content"],
        },
      }
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
      return { content: [{ type: "text", text: `Successfully added job: ${args.role} at ${args.company} (ID: ${response.id})` }] };
    }

    if (name === "list_jobs") {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        sorts: [{ property: "Last Updated", direction: "descending" }], 
      });

      const jobs = response.results.map((page) => {
        const title = page.properties["Job Title"]?.title?.[0]?.plain_text || "Unknown Role";
        const company = page.properties["Company"]?.rich_text?.[0]?.plain_text || "Unknown Company";
        const status = page.properties["Status"]?.select?.name || "No Status";
        return `- ID: ${page.id}\n  Role: ${title}\n  Company: ${company}\n  Status: ${status}`;
      });

      return { content: [{ type: "text", text: `Tracked Jobs:\n${jobs.join("\n")}` }] };
    }

    if (name === "update_status") {
      await notion.pages.update({
        page_id: args.job_id,
        properties: {
          "Status": { select: { name: args.status } },
        },
      });
      return { content: [{ type: "text", text: `Updated status to "${args.status}" for job ID: ${args.job_id}` }] };
    }

    if (name === "add_note") {
      await notion.blocks.children.append({
        block_id: args.job_id,
        children: [
          {
            object: "block",
            type: "heading_3",
            heading_3: { rich_text: [{ text: { content: "📝 Note" } }] }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: [{ type: "text", text: { content: args.content } }] },
          },
        ],
      });
      return { content: [{ type: "text", text: "Note added successfully." }] };
    }

    if (name === "add_checklist") {
      const children = args.tasks.map(task => ({
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [{ type: "text", text: { content: task } }],
          checked: false,
        },
      }));
      // Add a header for the checklist
      children.unshift({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: [{ text: { content: "✅ Preparation Tasks" } }] }
      });

      await notion.blocks.children.append({
        block_id: args.job_id,
        children: children,
      });
      return { content: [{ type: "text", text: `Added ${args.tasks.length} checklist items.` }] };
    }

    // ✅ NEW: Implementation of add_training_material
    if (name === "add_training_material") {
      const materialType = args.type || "Training";
      await notion.blocks.children.append({
        block_id: args.job_id,
        children: [
          {
            object: "block",
            type: "heading_2",
            heading_2: { rich_text: [{ text: { content: `📚 ${materialType} Material` } }] }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: [{ type: "text", text: { content: args.content } }] },
          },
          {
            object: "block",
            type: "divider",
            divider: {}
          }
        ],
      });
      return { content: [{ type: "text", text: `Saved ${materialType} training material to job page.` }] };
    }

    return { content: [{ type: "text", text: `Tool ${name} not found.` }], isError: true };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Notion API Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Notion MCP Server running...");