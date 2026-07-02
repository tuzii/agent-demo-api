# Agent Demo API

Small Express API for Agent Canvas and Feishu integration demos.

## Features

- `GET /health` returns service status.
- `GET /api/tasks` returns demo tasks.
- `POST /api/tasks` creates an in-memory task.
- CORS is enabled for the frontend demo.

## Quick Start

```bash
npm install
npm run dev
```

The API defaults to:

```text
http://localhost:4310
```

## Endpoints

```http
GET /health
```

```json
{
  "status": "ok",
  "service": "agent-demo-api"
}
```

```http
GET /api/tasks
```

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Verify Feishu callback",
  "owner": "demo"
}
```

## Feishu Demo Commands

Use this repository as the backend target:

```text
/codex repo=tuzii/agent-demo-api branch=main task=检查后端项目结构、启动方式、接口列表和前端联调注意事项
```

Cross-project demo prompt:

```text
/codex repo=tuzii/agent-demo-api branch=main task=以前端项目 tuzii/agent-demo-web 为调用方，检查后端接口是否适合前端联调，并输出接口地址、请求参数、响应字段和测试步骤
```
