import database from "infra/database.js";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();

router.use(migrationsConfigHandler).get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

async function migrationsConfigHandler(request, response, next) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsConfig = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    request.defaultMigrationsConfig = defaultMigrationsConfig;
    await next();
  } finally {
    dbClient?.end();
  }
}

async function getHandler(request, response) {
  const migrationsConfig = request.defaultMigrationsConfig;

  const pendingMigrations = await migrationsRunner({
    ...migrationsConfig,
  });

  return response.status(200).json(pendingMigrations);
}
async function postHandler(request, response) {
  const migrationsConfig = request.defaultMigrationsConfig;

  const migratedMigrations = await migrationsRunner({
    ...migrationsConfig,
    dryRun: false,
  });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  response.status(200).json(migratedMigrations);
}
