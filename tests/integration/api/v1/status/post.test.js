import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST api/v1/status", () => {
  describe("Anonymous User", () => {
    test("Retriving current system status", async () => {
      const response = await fetch("http:localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotAllowedMethodError",
        message: "O método é invalido nesse endpoint",
        action: "Verifique os métodos que o endpoint suporta",
        status_code: 405,
      });
    });
  });
});
