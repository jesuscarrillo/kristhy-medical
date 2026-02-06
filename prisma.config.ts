import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
