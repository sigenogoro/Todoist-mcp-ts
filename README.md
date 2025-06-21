# プロジェクト概要

Todoist API との統合を提供する Model Context Protocol (MCP) サーバーです。AI アシスタントが Todoist のタスクやプロジェクトと連携できるようになります。

## 機能

- MCP を通じて AI アシスタントを Todoist に接続
- タスク、プロジェクト、ラベルの管理
- 型安全性のための TypeScript で構築
- 公式 Todoist API TypeScript SDK を使用

## 前提条件

- Node.js (バージョン 18 以上)
- Todoist アカウントと API トークン

## インストール

```bash
npm install
```

## 開発

```bash
# 開発モードで実行
npm run dev

# プロジェクトをビルド
npm run build

# ビルドしたサーバーを実行
npm start
```

## 設定

Todoist API トークンを環境変数として設定してください：

```bash
export TODOIST_API_TOKEN=your_api_token_here
```

## 使用方法

この MCP サーバーは、Model Context Protocol をサポートする AI アシスタントと連携して使用するように設計されています。実行すると、サーバーは stdio で MCP リクエストを待機します。

## プロジェクト構造

- `src/main.ts` - メインサーバー実装
- `package.json` - 依存関係とスクリプト
- `dist/` - ビルドされた JavaScript ファイル（生成される）

## 依存関係

- `@modelcontextprotocol/sdk` - サーバー実装用 MCP SDK
- `@doist/todoist-api-typescript` - 公式 Todoist API クライアント