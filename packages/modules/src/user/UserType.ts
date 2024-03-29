import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import { UserLoader, registerTypeLoader } from '@event-list/modules';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Event list User',
  fields: () => ({
    id: globalIdField('User'),
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.email,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.name,
    },
  }),
});

const { connectionType: UserConnection, edgeType: UserEdge } = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

registerTypeLoader(UserType, UserLoader.load);

export { UserConnection, UserEdge, UserType };
