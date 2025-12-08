import { faker } from "@faker-js/faker/.";
import retry from "async-retry";
import activation from "infra/activation";
import database from "infra/database.js";
import migrator from "models/migrator";
import session from "models/session";
import user from "models/user";

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForWebServer();
  await waitForEmailServer();
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

  async function waitForEmailServer() {
    return retry(fetchEmailPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchEmailPage() {
      const response = await fetch(emailHttpUrl);
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

async function activateUser(user) {
  return await activation.activateUserByUserId(user.id);
}

async function createSession(userId) {
  return await session.create(userId);
}

async function getUserByUsername(username) {
  return await user.findOneByUsername(username);
}

async function deleteAllEmails() {
  await fetch(`${emailHttpUrl}/messages`, { method: "DELETE" });
}

async function getLastEmail() {
  const emailListResponse = await fetch(`${emailHttpUrl}/messages`);
  const emailListBody = await emailListResponse.json();
  const lastEmail = emailListBody.pop();

  if (!lastEmail) {
    return null;
  }

  const emailTextResponse = await fetch(
    `${emailHttpUrl}/messages/${lastEmail.id}.plain`,
  );
  const emailTextBody = await emailTextResponse.text();
  lastEmail.text = emailTextBody;
  return lastEmail;
}

function extractUUID(mailText) {
  const regex = /[0-9a-fA-F-]{36}/;
  const match = mailText.match(regex);
  return match ? match[0] : null;
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  activateUser,
  createSession,
  getUserByUsername,
  deleteAllEmails,
  getLastEmail,
  extractUUID,
};

export default orchestrator;
