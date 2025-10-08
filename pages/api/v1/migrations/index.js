import database from "infra/database.js";
import migrationsRunner from "node-pg-migrate";
export default async function migrations(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationsConfig = {
      dbClient: dbClient,
      dryRun: true,
      dir: "infra/migrations",
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    if (request.method === "GET") {
      const pendingMigrations = await migrationsRunner({
        ...defaultMigrationsConfig,
      });

      response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationsRunner({
        ...defaultMigrationsConfig,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
