import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Retriving current infra status", async () => {
      const response = await fetch("http:localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        updated_at: responseBody.updated_at,
        dependencies: {
          database: {
            max_connections: 100,
            opened_connections: 1,
          },
        },
      });

      const parsedDate = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedDate);

      expect(responseBody.dependencies.database.version).toBe(undefined);
    });
  });
  describe("Privileged User", () => {
    test("Retriving current infra status", async () => {
      const privilegedUser = await orchestrator.createUser();
      await orchestrator.activateUser(privilegedUser);
      const privilegedUserSessionObject =
        await orchestrator.createSession(privilegedUser);

      await orchestrator.addFeatures(privilegedUser, ["read:status:all"]);

      const response = await fetch("http://localhost:3000/api/v1/status", {
        headers: {
          Cookie: `session_id=${privilegedUserSessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        updated_at: responseBody.updated_at,
        dependencies: {
          database: {
            version: "16.10",
            max_connections: 100,
            opened_connections: 1,
          },
        },
      });
      const parsedDate = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedDate);
    });
  });
});
