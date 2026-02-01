import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/common/db/prisma/schema.prisma",
  migrations: {
    path: "infra/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "postgresql://user:pass@localhost:5432/aegis",
  },
});
