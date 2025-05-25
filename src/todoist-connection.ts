import { TodoistApi, Project } from "@doist/todoist-api-typescript";
import dotenv from "dotenv";

// 環境変数の読み込み
dotenv.config();

const todoistApiKey = process.env.TODOIST_API_KEY;
if(todoistApiKey === undefined) {
    console.error("Todoist APIの初期化に失敗しました。APIキーを確認してください。");
    throw new Error("Tpdoist API の初期値設定に失敗")
}
console.log(todoistApiKey);
const api = new TodoistApi(todoistApiKey)

/**
 * プロジェクト一覧を取得する関数
 * @returns Promise<Project[]>
 */

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projects = (await api.getProjects()).results;
    return projects;
  } catch (error) {
    console.error('プロジェクトの取得中にエラーが発生しました:', error);
    throw error;
  }
};

const main = async () => {
  try {
    const projects = await getProjects();
    console.log('📁 プロジェクト一覧:');
    projects.forEach((project) => {
      console.log(`- ${project.name}`);
    });
  } catch (error) {
    console.error('メイン処理中にエラーが発生しました:', error);
  }
};

main();