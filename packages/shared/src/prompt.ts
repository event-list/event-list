import { stdin as input, stdout as output } from 'process';
import readline from 'readline';

import * as config from './config';

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

export const prompt = async () => {
  // eslint-disable-next-line
  console.log({
    MONGO_URL: config.MONGO_URL,
    JWT_SECRET: config.JWT_SECRET,
    NODE_ENV: config.NODE_ENV,
  });

  if (process.env.PROMPT !== 'true') {
    return;
  }

  const rl = readline.createInterface({ input, output });

  const answer = await ask(rl, 'Run ? (y/n)');

  if (answer?.toLowerCase() !== 'y') {
    throw new Error('Aborted');
  }
};
