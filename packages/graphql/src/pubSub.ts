import { PubSub } from 'graphql-subscriptions';

const EVENTS = {
  EVENT: {
    NEW: 'EVENT_NEW',
  },
};

const pubSub = new PubSub();

export { EVENTS, pubSub };
