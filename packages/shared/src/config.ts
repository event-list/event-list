import dotenvSafe from 'dotenv-safe';
import path from 'path';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
  path: root('.env'),
  sample: root('.env.example'),
});

export const { MONGO_URL, NODE_ENV, JWT_SECRET, GRAPHQL_ENDPOINT } = process.env;

export const EVENT_LIST_ENV = process.env.EVENT_LIST_ENV || 'development';

export const API_PORT = process.env.API_PORT || 4000;
