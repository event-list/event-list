import { GraphQLObjectType } from 'graphql';

import { meAdminField, myEvents, nodeField, nodesField } from '@event-list/modules';

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
