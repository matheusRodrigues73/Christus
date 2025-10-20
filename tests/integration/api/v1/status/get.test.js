import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Retriving current system status", async () => {
      const response = await fetch("http:localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedDate = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedDate);

      expect(responseBody.dependencies.database.version).toBe("16.10");
      expect(responseBody.dependencies.database.max_connections).toBe(100);
      expect(responseBody.dependencies.database.opened_connections).toBe(1);
    });
  });
});
