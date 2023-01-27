import { createServer } from 'http';

import { config } from '@event-list/shared';

import app from './app';
import { connectDatabase } from './mongo/mongo';
(async () => {
  try {
    console.log('connecting to database...');
    await connectDatabase();
  } catch (err) {
    console.log('Could not connect to database', { err });
    throw err;
  }

  const server = createServer(app.callback());

  server.listen(config.API_PORT, () => console.log('server is running'));
})();
