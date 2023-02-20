import { GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { GraphQLBoolean, GraphQLList } from 'graphql/type';

import type { EventDocument } from '@event-list/modules';
import { EventLoader, MerchantLoader, MerchantType, nodeInterface, registerTypeLoader } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const EventType = new GraphQLObjectType({
  name: 'Event',
  description: 'Event Type',
  fields: () => ({
    id: globalIdField('Event'),
    title: {
      type: GraphQLString,
      resolve: (event) => event.title,
    },
    description: {
      type: GraphQLString,
      resolve: (event) => event.description,
    },
    flyer: {
      type: GraphQLString,
      resolve: (event) => event.flyer,
    },
    label: {
      type: MerchantType,
      resolve: (event, _, context: GraphQLContext) => MerchantLoader.load(context, event.label),
    },
    place: {
      type: GraphQLString,
      resolve: (event) => event.place,
    },
    published: {
      type: GraphQLBoolean,
      //@ts-expect-error todo
      resolve: (event) => event.date > new Date(),
    },
    date: {
      type: GraphQLString,
      resolve: (event) => event.date,
    },
    eventOpenAt: {
      type: GraphQLString,
      resolve: (event) => event.eventOpenAt,
    },
    eventEndAt: {
      type: GraphQLString,
      resolve: (event) => event.eventEndAt,
    },
    listAvailableAt: {
      type: GraphQLString,
      resolve: (event) => event.listAvailableAt,
    },
    classification: {
      type: GraphQLString,
      resolve: (event) => event.classification,
    },
    price: {
      type: GraphQLString,
      resolve: (event) => event.price,
    },
    status: {
      type: GraphQLBoolean,
      resolve: (event) => event.status,
    },
    users: {
      type: new GraphQLObjectType({
        name: 'users',
        fields: {
          mas: {
            type: new GraphQLList(GraphQLString),
            resolve: (users: EventDocument['users']) => users.mas,
          },
          fem: {
            type: new GraphQLList(GraphQLString),
            resolve: (users: EventDocument['users']) => users.fem,
          },
          free: {
            type: new GraphQLList(GraphQLString),
            resolve: (users: EventDocument['users']) => users.free,
          },
        },
      }),
    },
    usersQtd: {
      type: GraphQLString,
      resolve: (event: EventDocument) => event.users.mas.length + event.users.fem.length + event.users.free.length,
    },
  }),
  interfaces: () => [nodeInterface],
});

registerTypeLoader(EventType, EventLoader.load);

const { connectionType: EventConnection, edgeType: EventEdge } = connectionDefinitions({
  name: 'Event',
  nodeType: EventType,
});

export { EventConnection, EventEdge, EventType };
