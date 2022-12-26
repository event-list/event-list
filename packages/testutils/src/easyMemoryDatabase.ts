import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-global';

export const databaseTestModule = () => {
  const mongod = new MongoMemoryServer({
    binary: {
      version: '4.2.7',
      skipMD5: true,
    },
    autoStart: false,
  });

  /**
   * Connect to the in-memory database.
   */
  const connect = async () => {
    if (!mongod.isRunning) {
      await mongod.start();
    }
    const uri = await mongod.getUri();

    const mongooseOptions = {
      autoIndex: true,
      connectTimeoutMS: 10000,
    };

    await mongoose.connect(uri, mongooseOptions);
  };

  /**
   * Drop database, close the connection and stop mongod.
   */
  const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (!mongod.isRunning) {
      return;
    }
    await mongod.stop();
  };

  /**
   * Remove all the data for all db collections.
   */
  const clearDatabase = async () => {
    if (!mongod.isRunning) {
      return;
    }
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      if (key) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  };

  return {
    connect,
    closeDatabase,
    clearDatabase,
  };
};
