import { GraphQLObjectType, GraphQLString } from 'graphql';
import { nodeField, nodesField } from '@event-list/modules';
import { meField } from '../modules/user/UserFields';
import { eventField } from '../modules/event/EventFields';

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
