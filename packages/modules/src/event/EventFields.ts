import { connectionArgs, withFilter } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull } from 'graphql';

import { EventLoader } from '@event-list/modules';

import { EventConnection } from './EventType';

const eventField = () => ({
  events: {
    type: new GraphQLNonNull(EventConnection),
    args: { ...connectionArgs },
    resolve: async (_, args, ctx) =>
      await EventLoader.loadAll(ctx, withFilter(args, { status: true, dateEnd: { $gte: new Date() } })),
  },
});

const myEvents = () => ({
  myEvents: {
    type: EventConnection,
    args: { ...connectionArgs },
    resolve: async (_, args, ctx) => await EventLoader.loadAll(ctx, withFilter(args, { merchant: ctx.merchant._id })),
  },
});

export { eventField, myEvents };
