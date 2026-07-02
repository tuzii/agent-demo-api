import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const port = Number.parseInt(process.env.PORT || "4310", 10);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

const tasks = [
  {
    id: "task-1001",
    title: "Verify Feishu callback",
    status: "done",
    owner: "frontend",
  },
  {
    id: "task-1002",
    title: "Connect web app to API",
    status: "in_progress",
    owner: "backend",
  },
  {
    id: "task-1003",
    title: "Prepare full-stack demo",
    status: "todo",
    owner: "demo",
  },
];

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy(new Error("request body too large"));
      }
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function handleRequest(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, {
      status: "ok",
      service: "agent-demo-api",
      time: new Date().toISOString(),
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/tasks") {
    sendJson(res, 200, { tasks });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/tasks") {
    let body;
    try {
      body = await readJson(req);
    } catch {
      sendJson(res, 400, { error: "invalid JSON body" });
      return;
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const owner = typeof body.owner === "string" ? body.owner.trim() : "demo";

    if (!title) {
      sendJson(res, 400, { error: "title is required" });
      return;
    }

    const task = {
      id: `task-${Date.now()}`,
      title,
      owner,
      status: "todo",
    };
    tasks.unshift(task);
    sendJson(res, 201, { task });
    return;
  }

  sendJson(res, 404, { error: "Not Found" });
}

function createDemoApiServer() {
  return createServer((req, res) => {
    handleRequest(req, res).catch(() => {
      sendJson(res, 500, { error: "Internal Server Error" });
    });
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  createDemoApiServer().listen(port, () => {
    console.log(`agent-demo-api listening on http://localhost:${port}`);
  });
}

export { createDemoApiServer, tasks };
