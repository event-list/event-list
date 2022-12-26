import { connectMongo } from './connectMongo';

const mongooseOptions = {
  // autoIndex: true,
};

export const connectDatabase = () => connectMongo(mongooseOptions);
