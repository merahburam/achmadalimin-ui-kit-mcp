#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Catalog is bundled with the package — no network, no API, no license key.
const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = JSON.parse(
  readFileSync(resolve(__dirname, "data", "components.json"), "utf8"),
);

const TOOLS = [
  {
    name: "list_components",
    description:
      "List every component available in the @achmadalimin/ui-kit design system, with a one-line description of each. Call this first to see what you can use.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_component",
    description:
      "Get the canonical HTML markup, class list, and any required script for a single ui-kit component. Use the exact markup returned instead of inventing your own — it matches Achmad Alimin's design system.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Component name, e.g. button, card, modal, tabs, accordion, badge, banner, input, tooltip",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_tokens",
    description:
      "Get the design tokens (CSS custom properties — colors, etc.) for the ui-kit design system, plus theming notes.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_setup",
    description:
      "Get install and setup instructions for @achmadalimin/ui-kit: the npm command, the stylesheet import/link, theming, and naming conventions. Call this before generating ui-kit markup so the stylesheet is actually loaded.",
    inputSchema: { type: "object", properties: {} },
  },
];

function listComponents() {
  const lines = CATALOG.components.map(
    (c) => `- ${c.name} (${c.title}): ${c.description}`,
  );
  return (
    `@achmadalimin/ui-kit components (${CATALOG.components.length}):\n\n` +
    lines.join("\n") +
    `\n\nCall get_component with a name to get its markup. Call get_setup for install instructions.`
  );
}

function getComponent(name) {
  const key = String(name || "").trim().toLowerCase();
  const c = CATALOG.components.find((x) => x.name === key);
  if (!c) {
    const names = CATALOG.components.map((x) => x.name).join(", ");
    return `Unknown component "${name}". Available: ${names}.`;
  }
  let out = `${c.title} (.${c.classes[0]})\n${c.description}\n\nClasses: ${c.classes.join(", ")}\n\nHTML:\n${c.html}`;
  if (c.script) {
    out += `\n\nRequired script:\n${c.script}`;
  }
  out += `\n\nRemember: include the stylesheet (see get_setup) or these classes won't be styled.`;
  return out;
}

function getTokens() {
  const t = CATALOG.tokens;
  const colorLines = Object.entries(t.color).map(
    ([k, v]) => `  ${k}: ${v};`,
  );
  return (
    `Design tokens — colors (dark mode default):\n\n:root {\n${colorLines.join("\n")}\n}\n\n${t.note}`
  );
}

function getSetup() {
  const m = CATALOG.meta;
  return (
    `Setup — ${m.name}\n\n` +
    `Option A — npm:\n  ${m.npm}\n  ${m.import}\n\n` +
    `Option B — plain HTML (no build step):\n  curl -O ${m.stylesUrl}\n  <link rel="stylesheet" href="ui-kit.css">\n\n` +
    `Theming: ${m.theming}\n\n` +
    `Conventions: ${m.conventions}\n\n` +
    `Docs: ${m.docs}`
  );
}

const server = new Server(
  { name: "ui-kit-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let text;
    switch (name) {
      case "list_components":
        text = listComponents();
        break;
      case "get_component":
        text = getComponent(args && args.name);
        break;
      case "get_tokens":
        text = getTokens();
        break;
      case "get_setup":
        text = getSetup();
        break;
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
    return { content: [{ type: "text", text }] };
  } catch (err) {
    return {
      content: [
        { type: "text", text: `Error running ${name}: ${err.message}` },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
