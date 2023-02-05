import { GraphQLObjectType } from 'graphql';

import { EventMutations } from '../modules/event/EventMutations';
import { MerchantMutations } from '../modules/merchant/MerchantMutations';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'All mutations',
  fields: () => ({
    ...EventMutations,
    ...MerchantMutations,
  }),
});

export { MutationType };
