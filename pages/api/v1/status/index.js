import database from "infra/database.js";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const versionResp = await database.query("SHOW server_version;");
  const version = versionResp.rows[0].server_version;

  const maxConnectionsResp = await database.query("SHOW max_connections");
  const maxConnections = parseInt(maxConnectionsResp.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsResp = await database.query({
    text: "SELECT count(*) AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections = parseInt(
    openedConnectionsResp.rows[0].opened_connections,
  );
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  });
}
