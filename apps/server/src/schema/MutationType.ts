import { GraphQLObjectType } from 'graphql';

import { EventMutations } from '../modules/event/EventMutations';
import { UserMutations } from '../modules/user/UserMutations';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'All mutations',
  fields: () => ({
    ...EventMutations,
    ...UserMutations,
  }),
});

export { MutationType };
