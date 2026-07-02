import 'dotenv/config';
console.log("DB URL from env:", process.env.DATABASE_URL);
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
});
