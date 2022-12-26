import { prompt } from '../prompt';
import { connectMongo } from './connectMongo';

const mongooseOptions = {
  directConnection: true,
};

export const connectDatabaseK8s = async () => {
  await prompt();

  return connectMongo(mongooseOptions);
};
