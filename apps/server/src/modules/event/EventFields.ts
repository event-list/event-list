import { connectionArgs } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull } from 'graphql';

import { EventLoader } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { EventConnection } from './EventType';

const eventField = () => ({
  events: {
    type: new GraphQLNonNull(EventConnection),
    args: { ...connectionArgs },
    resolve: async (_, args, ctx: GraphQLContext) => await EventLoader.loadAll(ctx, args),
  },
});

export { eventField };
