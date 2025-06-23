import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TodoistApi } from "@doist/todoist-api-typescript";
import dotenv from "dotenv";

// 環境変数を読み込み
dotenv.config();

// Todoist APIクライアントを初期化
const todoistApiToken = process.env.TODOIST_API_TOKEN;
if (!todoistApiToken) {
  console.error("TODOIST_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}
const todoistApi = new TodoistApi(todoistApiToken);

// Todoist へ登録するタスクの一時保管変数
let todoistTasks: { name: string; description: string }[] = [];

// MCPサーバーを作成
const server = new McpServer({
  name: "todoist-mcp-server",
  version: "1.0.0"
});


// AIモデルが呼び出すことができるツールの登録
server.registerTool(
  "create_task",
  {
    description: "タスク生成",
    inputSchema: {
      tasks: z.array(
        z.object({
          name: z.string().describe("タスク名"),
          description: z.string().describe("タスクの詳細"),
        })
      )
    }
  },
  async (args) => {
    const tasks = args.tasks;
    todoistTasks.push(...tasks);
    return {
      content: [
        {
          type: "text",
          text: `タスクを${tasks.length}件作成されました`
        },
        {
          type: "text",
          text: tasks.map((task) => 
            `- ${task.name}: ${task.description}}`
          ).join("\n")
        }
      ]
    };
  }
);

server.registerTool(
  "todoist_register_tasks",
  {
    description: "Todoistへタスク集を登録",
  },
  async () => {
    if (todoistTasks.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "コミットするタスクがありません"
          }
        ]
      };
    }

    try {
      // プロジェクト一覧を取得
      const projects = (await todoistApi.getProjects()).results;
      
      // プロジェクトIDを取得
      const defaultProject = projects.find(project => project.name === process.env.PROJECT_NAME);
      const projectId = defaultProject ? defaultProject.id : projects[0]?.id;
      
      if (!projectId) {
        throw new Error("利用可能なプロジェクトが見つかりません");
      }
      
      // Todoist APIを使ってタスクを登録
      await Promise.all(
        todoistTasks.map(task => 
          todoistApi.addTask({
            content: task.name,
            description: task.description,
            projectId: projectId
          })
        )
      );

      // 登録成功後、一時保管配列をクリア
      const taskLength = todoistTasks.length;
      todoistTasks = [];

      return {
        content: [
          {
            type: "text",
            text: `Todoistに${taskLength}件のタスクを登録しました`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Todoistへの登録でエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
)
 

server.registerTool(
  "delete_all_tasks",
  {
    description: "Todoistの全タスクを削除"
  },
  async() => {
    try {
      // Projectsを取得
      const projects = (await todoistApi.getProjects()).results;
      // プロジェクトIDを取得
      const defaultProject = projects.find(project => project.name === process.env.PROJECT_NAME);
      const projectId = defaultProject ? defaultProject.id : projects[0]?.id;

      if (!projectId) {
        throw new Error("利用可能なプロジェクトが見つかりません");
      }

      // プロジェクト内の全タスク取得
      const tasks = (await todoistApi.getTasks({ projectId })).results;
      if (tasks.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "削除するタスクがありません"
            }
          ]
        };
      }
      // タスクを削除
      await Promise.all(tasks.map(task => todoistApi.deleteTask(task.id)));

      return {
        content: [
          {
            type: "text",
            text: `Todoistのプロジェクト「${process.env.PROJECT_NAME}」内の全タスクを削除しました`
          }
        ]
      }
    } catch(error) {
      return {
        content: [
          {
            type: "text",
            text: `Todoistの全タスク削除でエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
)

const transport = new StdioServerTransport();
await server.connect(transport);
