import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed!` });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient,
      dryRun: req.method === "GET",
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const migrations = await migrationRunner(defaultMigrationOptions);

    const statusCode =
      req.method === "POST" && migrations.length > 0 ? 201 : 200;
    return res.status(statusCode).json(migrations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  } finally {
    dbClient.end();
  }
}
