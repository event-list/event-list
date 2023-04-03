import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';

import { sendToDiscord } from '@event-list/modules';
import { config } from '@event-list/shared';

export const connectMongo = (options: ConnectOptions) =>
  new Promise<void>((resolve, reject) => {
    mongoose.connection
      // Reject if an error ocurred when trying to connect to MongoDB
      .on('error', async (error) => {
        // eslint-disable-next-line
        if (config.EVENT_LIST_ENV === 'production') {
          await sendToDiscord({
            url: config.DISCORD_GENERAL_WEBHOOK,
            content: `**mongodb connection error** - ${error}`,
          });
        }
        console.log('ERROR: Connection to MongoDB failed');
        reject(error);
      })
      // Exit Process if there is no longer a Database Connection
      .on('close', () => {
        // eslint-disable-next-line
        console.log('ERROR: Connection to MongoDB lost');
        process.exit(1);
      })
      // Connected to DB
      .once('open', () => {
        // Display connection information
        const infos = mongoose.connections;
        // eslint-disable-next-line
        infos.map((info) =>
          // eslint-disable-next-line
          console.log(`Connected to ${info.host}:${info.port}/${info.name}`),
        );
        // Return sucessfull promisse
        resolve();
      });

    mongoose.connect(config.MONGO_URL, options);
  });
