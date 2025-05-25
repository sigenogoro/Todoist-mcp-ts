import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { z } from "zod";


// MCPサーバーの作成
const server = new McpServer({
  name: "todoist-mcp-server",
  version: "1.0.0"
});

// 簡単なテスト用ツールを追加
server.tool(
  "say_hello",
  "指定された人に挨拶メッセージを生成します。名前を受け取って挨拶文を返します。",
  {
    name: z.string().describe("挨拶する相手の名前（例：田中、佐藤、山田など）")
  },
  async ({ name }) => {
    console.error(`say_hello called with name: ${name}`); // デバッグ用
    return {
      content: [
        {
          type: "text",
          text: `こんにちは、${name}さん! Todoist MCPサーバーから挨拶します。`
        }
      ]
    };
  }
);

// Todoistタスク一覧取得ツール（モック版）
server.tool(
  "get_tasks",
  "Todoistのタスク一覧を取得",
  {},
  async () => {
    // 実際のTodoist APIを使う前のテスト用モックデータ
    return {
      content: [
        {
          type: "text",
          text: "タスク一覧:\n1. MCPサーバーの実装\n2. Claude Desktopとの連携テスト\n3. Todoist API の実装"
        }
      ]
    };
  }
);

// サーバーの起動
async function main() {
  console.error('Todoist MCPサーバーを起動中...');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Todoist MCPサーバーが起動しました');
}

main().catch((error) => {
  console.error('サーバー起動エラー:', error);
  process.exit(1);
});