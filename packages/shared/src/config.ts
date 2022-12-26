import path from 'path';

import dotenvSafe from 'dotenv-safe';

import { version } from '../package.json';

export const PACKAGE_VERSION = version;

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
  path: root('.env'),
  sample: root('.env.example'),
});

export const {
  MONGO_URI,
  JWT_SECRET
} = process.env;

export const EVENTLIST_ENV = process.env.EVENTLIST_ENV || 'development';
export const API_PORT = process.env.API_PORT || 9003;
