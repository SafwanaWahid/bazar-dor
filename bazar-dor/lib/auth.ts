import { config } from "dotenv";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

config({ path: ".env.local" });

const globalForDatabase = globalThis as unknown as {
  authPool?: Pool;
};

const pool =
  globalForDatabase.authPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.authPool = pool;
}

export const auth = betterAuth({
  appName: "BazarDor",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: pool,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
    autoSignIn: false,
  },
});