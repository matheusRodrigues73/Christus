import database from "infra/database";

async function getInfrastructureStatus() {
  const updatedAt = new Date().toISOString();
  const databaseStatus = await getDatabaseStatus();
  return {
    updated_at: updatedAt,
    database: {
      version: databaseStatus.version,
      max_connections: databaseStatus.max_connections,
      opened_connections: databaseStatus.opened_connections,
    },
  };
}

async function getDatabaseStatus() {
  const versionResp = await database.query("SHOW server_version;");
  const version = versionResp.rows[0].server_version;

  const maxConnectionsResp = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(maxConnectionsResp.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsResp = await database.query({
    text: "SELECT count(*) AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections = parseInt(
    openedConnectionsResp.rows[0].opened_connections,
  );

  return {
    version: version,
    max_connections: maxConnections,
    opened_connections: openedConnections,
  };
}

export default getInfrastructureStatus;
