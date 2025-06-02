#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';


// MCPサーバーの初期化
const server = new Server(
  {
    name: 'todoist-mcp-server',
    version: '1.0.0',
  },
  {
    // Claude Desktop に表示される機能名
    capabilities: {
      tools: {},
    },
  }
);

// 利用できるツール一覧を返す
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        // ツールの名前
        name: 'add_task',
        // ツールの説明
        description: 'Add a new task to Todoist',
        // 入力スキーマ（AIに対して出力して欲しいフォーマット）
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'Task content/title',
            },
          },
          // 必ず入れて欲しいフィールド
          required: ['content'],
        },
      },
    ],
  };
});

// ツール実行を処理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // 実行したいツール名
  const { name, arguments: args } = request.params;
  // ツール名が `add_task` の場合の処理
  if (name === 'add_task') {
    const { content } = args as { content: string };
    
    // MCPサーバーからClaude Desktopへの実行結果報告である
    return {
      content: [
        {
          type: 'text',
          text: `Task "${content}" would be added to Todoist`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// サーバー起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Todoist MCP server running on stdio');
}

main().catch(console.error);