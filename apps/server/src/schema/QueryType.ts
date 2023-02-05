import { GraphQLObjectType } from 'graphql';

import { eventField, nodeField, nodesField } from '@event-list/modules';

import { meField } from '../modules/user/UserFields';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'All queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    ...meField(),
    ...eventField(),
  }),
});

export { QueryType };
