import orchestrator from "tests/orchestrator.js";
import session from "models/session.js";
import setCookieParser from "set-cookie-parser";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/sessions", () => {
  describe("Default User", () => {
    test("With unexistent session", async () => {
      const token =
        "4a8adaa0ef0edd6a6e65fd9b2c689723b48397934b88bc7550a0f414c0fdf871865a9e6af5f8159a9d272ad8fab1df88";
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: { Cookie: `session_id=${token}` },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Sessão de usuário invalida.",
        action: "Verifique se o usuário está conectado e com uma sessão ativa.",
        status_code: 401,
      });
    });

    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date() - session.EXPIRATION_IN_MILLISECONDS,
      });

      const createdUser = await orchestrator.createUser({
        username: "UserWithExpiredSession",
      });
      const sessionObject = await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: { Cookie: `session_id=${sessionObject.token}` },
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Sessão de usuário invalida.",
        action: "Verifique se o usuário está conectado e com uma sessão ativa.",
        status_code: 401,
      });
    });

    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: { Cookie: `session_id=${sessionObject.token}` },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: createdUser.id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Deleted Sessions Assertions
      expect(
        responseBody.expires_at < sessionObject.expires_at.toISOString(),
      ).toEqual(true);
      expect(
        responseBody.updated_at > sessionObject.updated_at.toISOString(),
      ).toEqual(true);

      // Set-Cookie Assertion
      const parsedSetCookie = setCookieParser(response, { map: true });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });
  });
});
