import webserver from "infra/webserver";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("Running pending migrations", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/migrations`);
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verifique se o seu usuário possui a feature!",
        message: "Voce não possui permição para executar esta ação.",
        name: "ForbiddenError",
        status_code: 403,
      });
    });
  });
  describe("Privileged User", () => {
    test("Running pending migrations", async () => {
      const privilegedKey = process.env.PRIVILEGED_KEY;
      const response = await fetch(`${webserver.origin}/api/v1/migrations`, {
        headers: {
          Cookie: `session_id=${privilegedKey}`,
        },
      });
      expect(response.status).toBe(200);
    });
  });
});
