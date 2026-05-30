# @achmadalimin/ui-kit-mcp

Make the [@achmadalimin/ui-kit](https://achmadalimin.com/design-system) design
system AI-native. This MCP server gives Claude, Codex, Cursor, and Windsurf the
**real** component markup and design tokens — so when you ask your AI to build UI
"using Achmad's design system," it uses the actual `ui-kit` components instead of
inventing generic markup.

Free and open. No license key, no account, no network calls — the component
catalog ships inside the package.

## Tools

| Tool | What it does |
|---|---|
| `list_components` | Lists every component with a one-line description |
| `get_component` | Returns the canonical HTML, classes, and any required script for one component |
| `get_tokens` | Returns the design tokens (CSS custom properties) + theming notes |
| `get_setup` | Returns install/import instructions so the stylesheet is actually loaded |

## Requirements

- Node.js 18+
- Claude Desktop, Codex, Cursor, or Windsurf

## Setup

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or
`%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "achmad-ui-kit": {
      "command": "npx",
      "args": ["@achmadalimin/ui-kit-mcp"]
    }
  }
}
```

Restart Claude Desktop.

### Codex

Codex uses TOML (not JSON). Edit `~/.codex/config.toml` (shared by the Codex app,
CLI, and IDE extension):

```toml
[mcp_servers.achmad-ui-kit]
command = "npx"
args = ["@achmadalimin/ui-kit-mcp"]
```

Or run `codex mcp add achmad-ui-kit -- npx @achmadalimin/ui-kit-mcp`, then restart Codex.

### Cursor

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "achmad-ui-kit": {
      "command": "npx",
      "args": ["@achmadalimin/ui-kit-mcp"]
    }
  }
}
```

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json` with the same `mcpServers` block.

## Usage

Once connected, prompt your AI naturally:

> "Build a settings page using Achmad's ui-kit — a card with a couple of inputs and a save button."

The AI calls `get_setup`, `list_components`, and `get_component` to pull the real
markup, classes, and the stylesheet link.

## The design system

`@achmadalimin/ui-kit` is plain HTML + CSS — no framework, no runtime. Install it
with `npm install @achmadalimin/ui-kit` or grab the standalone stylesheet:

```bash
curl -O https://achmadalimin.com/assets/css/ui-kit.css
```

Full docs and live previews: **[achmadalimin.com/design-system](https://achmadalimin.com/design-system)**

## License

MIT © Achmad Alimin
