import session from "models/session";
import orchestrator from "tests/orchestrator.js";
import setCookieParser from "set-cookie-parser";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Default User", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: { Cookie: `session_id=${sessionObject.token}` },
      });
      expect(response.status).toBe(200);
      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toEqual(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "UserWithValidSession",
        email: createdUser.email,
        password: createdUser.password,
        features: ["read:activation_token"],
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Sessions Renewal Assertions
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(
        renewedSessionObject.expires_at > sessionObject.expires_at,
      ).toEqual(true);
      expect(
        renewedSessionObject.updated_at > sessionObject.updated_at,
      ).toEqual(true);

      // Set-Cookie Assertion
      const parsedSetCookie = setCookieParser(response, { map: true });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: renewedSessionObject.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("With half life session", async () => {
      jest.useFakeTimers({
        now: new Date() - session.EXPIRATION_IN_MILLISECONDS / 2,
      });
      const createdUser = await orchestrator.createUser({
        username: "halfLifeSession",
      });
      const sessionObject = await orchestrator.createSession(createdUser.id);
      jest.useRealTimers();

      expect(sessionObject.created_at < new Date()).toEqual(true);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: { Cookie: `session_id=${sessionObject.token}` },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "halfLifeSession",
        email: createdUser.email,
        password: createdUser.password,
        features: ["read:activation_token"],
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session Renewal assertions
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      const renewedSessionExpiresAt = new Date(renewedSessionObject.expires_at);
      const sessionExpiresAt = new Date(sessionObject.expires_at);

      renewedSessionExpiresAt.setMilliseconds(0);
      renewedSessionExpiresAt.setSeconds(0);
      sessionExpiresAt.setMilliseconds(0);
      sessionExpiresAt.setSeconds(0);

      expect(renewedSessionExpiresAt > sessionExpiresAt).toEqual(true);
      expect(renewedSessionExpiresAt - sessionExpiresAt).toEqual(
        session.EXPIRATION_IN_MILLISECONDS / 2,
      );
      expect(
        renewedSessionObject.updated_at > sessionObject.updated_at,
      ).toEqual(true);

      // Set-Cookie Assertion
      const parsedSetCookie = setCookieParser(response, { map: true });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: renewedSessionObject.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("With unexistent session", async () => {
      const token =
        "4a8adaa0ef0edd6a6e65fd9b2c689723b48397934b88bc7550a0f414c0fdf871865a9e6af5f8159a9d272ad8fab1df88";
      const response = await fetch("http://localhost:3000/api/v1/user", {
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

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
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

      const response = await fetch("http://localhost:3000/api/v1/user", {
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

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

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
