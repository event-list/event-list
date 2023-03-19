import { prompt } from '../prompt';
import { connectMongo } from './connectMongo';

const mongooseOptions = {
  directConnection: false,
};

export const connectDatabaseK8s = async () => {
  await prompt();

  return connectMongo(mongooseOptions);
};
