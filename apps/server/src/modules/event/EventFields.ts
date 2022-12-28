import { GraphQLNonNull } from 'graphql';
import { EventConnection } from './EventType';
import { connectionArgs } from '@entria/graphql-mongo-helpers';
import { GraphQLContext } from '@event-list/types';
import { EventLoader } from '@event-list/modules';

const eventField = () => ({
  events: {
    type: new GraphQLNonNull(EventConnection),
    args: { ...connectionArgs },
    resolve: async (_, args, ctx: GraphQLContext) =>
      await EventLoader.loadAll(ctx, args),
  },
});

export { eventField };
