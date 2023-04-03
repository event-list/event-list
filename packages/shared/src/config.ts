import dotenvSafe from 'dotenv-safe';
import path from 'path';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
  path: root('.env'),
  sample: root('.env.example'),
});

export const {
  MONGO_URL,
  JWT_SECRET,
  GRAPHQL_ENDPOINT,
  EVENT_LIST_DOMAIN,
  DISCORD_GENERAL_WEBHOOK,
  DISCORD_ENTRIES_WEBHOOK,
  DISCORD_COOKIES_WEBHOOK,
} = process.env;

export const EVENT_LIST_ENV = process.env.EVENT_LIST_ENV || 'development';

export const API_PORT = process.env.API_PORT || 4000;
