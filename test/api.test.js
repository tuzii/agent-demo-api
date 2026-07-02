import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createDemoApiServer } from "../src/server.js";

async function requestJson(path, options) {
  const server = createDemoApiServer().listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, options);
    return {
      status: response.status,
      body: await response.json(),
    };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

describe("agent-demo-api", () => {
  it("returns health status", async () => {
    const response = await requestJson("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
    assert.equal(response.body.service, "agent-demo-api");
  });

  it("creates a task", async () => {
    const response = await requestJson("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Write integration notes", owner: "demo" }),
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.task.title, "Write integration notes");
    assert.equal(response.body.task.status, "todo");
  });
});
