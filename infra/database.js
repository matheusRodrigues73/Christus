import { Client } from "pg";

async function query(objectQuery) {
  let client;
  try {
    client = await getNewClient();
    const res = await client.query(objectQuery);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: getSslKey(),
  });
  await client.connect();
  return client;
}

let testeDeSegurança = "ghp_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

const database = {
  query,
  getNewClient,
};

function getSslKey() {
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}

export default database;
