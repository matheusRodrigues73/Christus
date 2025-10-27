import database from "infra/database.js";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";

const defaultMigrationsConfig = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrationsConfig = { ...defaultMigrationsConfig, dbClient };

    const pendingMigrations = await migrationsRunner({
      ...migrationsConfig,
    });
    return pendingMigrations;
  } finally {
    console.log("testando Get");
    dbClient?.end();
  }
}
async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrationsConfig = {
      ...defaultMigrationsConfig,
      dbClient,
      dryRun: false,
    };

    const migratedMigrations = await migrationsRunner({
      ...migrationsConfig,
      dryRun: false,
    });
    return migratedMigrations;
  } finally {
    console.log("testando POST");
    dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
