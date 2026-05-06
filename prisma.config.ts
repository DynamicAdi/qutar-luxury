import { defineConfig, env } from "prisma/config";
import { config } from "dotenv";

config();
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  datasource: {
    url: process.env.DB_URI || env("DB_URI"),
  },
});
