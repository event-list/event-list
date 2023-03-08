import { GraphQLObjectType } from 'graphql';

import { eventField, meField, nodeField, nodesField, merchantField } from '@event-list/modules';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'All queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    ...meField(),
    ...eventField(),
    ...merchantField(),
  }),
});

export { QueryType };
