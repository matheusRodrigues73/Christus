import database from "infra/database.js";

async function status(request, response) {
  const resp = await database.query("SHOW server_version;");
  const version = resp.rows[0].server_version;
  response.status(200).json({ services: { database: { version: version } } });
}

export default status;
