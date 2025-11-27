import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("With Unique and Valid Values", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "matheusRodriguesM",
          email: "test@testando.com",
          password: "acb132",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "matheusRodriguesM",
        email: "test@testando.com",
        password: responseBody.password,
        features: [],
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("matheusRodriguesM");

      const correctPassword = await password.compare(
        "acb132",
        userInDatabase.password,
      );
      expect(correctPassword).toBe(true);

      const incorrectPassword = await password.compare(
        "incorrectPassword",
        userInDatabase.password,
      );
      expect(incorrectPassword).toBe(false);
    });

    test("With Duplicated Email", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "matheusMarino",
          email: "duplicated@email.com",
          password: "acb132",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "matheusRodriMarin",
          email: "Duplicated@email.com",
          password: "acb132",
        }),
      });
      expect(response2.status).toBe(400);
      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O Email enviado já está registrado",
        action: "Utilize outro Email para realizar esta operação",
        status_code: 400,
      });
    });

    test("With Duplicated Username", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "MatRodrigues",
          email: "matodrigues@gmail.com",
          password: "acb132",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "matRodrigues",
          email: "mtrodrigues@gamil.com",
          password: "acb132",
        }),
      });
      expect(response2.status).toBe(400);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O Username enviado já está registrado",
        action: "Utilize outro Username para realizar esta operação",
        status_code: 400,
      });
    });

    test("With Undefined Password", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "undefinedPassword",
          email: "undefinedpassword@gmail.com",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "A senha não pode estar indefinida!",
        action: "Digite alguma senha para realizar a operação",
        status_code: 400,
      });
    });
  });
});
