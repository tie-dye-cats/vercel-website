import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "db.lakgovlqrvxsrdsnkykl.supabase.co",
    port: 5432,
    user: "postgres",
    password: "S1yIa4wx6sr0okRC",
    database: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  },
});
