import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const server = new McpServer({
  name: "todoist-mcp-server",
  version: "1.0.0"
})


const transport = new StdioServerTransport();
await server.connect(transport);
