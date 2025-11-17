import { faker } from "@faker-js/faker/.";
import retry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator";
import session from "models/session";
import user from "models/user";

async function waitForAllServices() {
  await waitForWebServer();
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(inputObject) {
  return await user.create({
    username: inputObject?.username || faker.internet.username(),
    email: inputObject?.email || faker.internet.email(),
    password: inputObject?.password || "acb132",
  });
}

async function createSession(userId) {
  return await session.create(userId);
}

async function getUserByUsername(username) {
  return await user.findOneByUsername(username);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
  getUserByUsername,
};

export default orchestrator;
