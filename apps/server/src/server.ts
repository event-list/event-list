import { createServer } from 'http';

import app from './app';
import { connectDatabase } from './mongo';
(async () => {
  try {
    console.log('connecting to database...');
    await connectDatabase();
  } catch (err) {
    console.log('Could not connect to database', { err });
    throw err;
  }

  const server = createServer(app.callback());

  server.listen(process.env.API_PORT, () => console.log('server is running'));
})();
