import { GraphQLObjectType } from 'graphql';

import { myEvents, nodeField, nodesField } from '@event-list/modules';

import { meAdminField } from '../modules/merchant/MerchantFields';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'All queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    ...meAdminField(),
    ...myEvents(),
  }),
});

export { QueryType };
