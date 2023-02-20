import { connectionArgs, withFilter } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull } from 'graphql';

import { EventLoader } from '@event-list/modules';

import { EventConnection } from './EventType';

const eventField = () => ({
  events: {
    type: new GraphQLNonNull(EventConnection),
    args: { ...connectionArgs },
    resolve: async (_, args, ctx) =>
      await EventLoader.loadAll(ctx, withFilter(args, { status: true, published: true })),
  },
});

const myEvents = () => ({
  myEvents: {
    type: new GraphQLNonNull(EventConnection),
    args: { ...connectionArgs },
    resolve: async (_, args, ctx) => await EventLoader.loadAll(ctx, withFilter(args, { label: ctx.merchant._id })),
  },
});

export { eventField, myEvents };
