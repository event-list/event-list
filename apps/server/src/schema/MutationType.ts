import { GraphQLObjectType } from 'graphql';

import { UserMutations } from '../modules/user/UserMutations';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'All mutations',
  fields: () => ({
    ...UserMutations,
  }),
});

export { MutationType };
