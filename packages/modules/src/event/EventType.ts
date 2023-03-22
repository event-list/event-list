import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLBoolean, GraphQLList } from 'graphql/type';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import type { EventDocument } from '@event-list/modules';
import { EventLoader, MerchantLoader, MerchantType, nodeInterface, registerTypeLoader } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const EventType = new GraphQLObjectType({
  name: 'Event',
  description: 'Event Type',
  fields: () => ({
    id: globalIdField('Event'),
    title: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.title,
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.description,
    },
    flyer: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.flyer,
    },
    merchant: {
      type: new GraphQLNonNull(MerchantType),
      resolve: (event, _, context: GraphQLContext) => MerchantLoader.load(context, event.merchant),
    },
    place: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.place,
    },
    published: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (event) => event.eventIsPublished(event.dateEnd),
    },
    dateStart: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.dateStart,
    },
    dateEnd: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.dateEnd,
    },
    listAvailableAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.listAvailableAt,
    },
    classification: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.classification,
    },
    prices: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'prices',
          fields: {
            title: {
              type: new GraphQLNonNull(GraphQLString),
              resolve: (prices) => prices.title,
            },
            value: {
              type: new GraphQLNonNull(GraphQLString),
              resolve: (prices) => prices.value,
            },
            date: {
              type: new GraphQLNonNull(GraphQLString),
              resolve: (prices) => prices.date,
            },
          },
        }),
      ),
    },
    currentPrice: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.getCurrentPrice(event.prices).value,
    },
    status: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (event) => event.status,
    },
    users: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'users',
          fields: {
            name: {
              type: new GraphQLNonNull(GraphQLString),
              resolve: (users) => users.name,
            },
            role: {
              type: new GraphQLNonNull(GraphQLString),
              resolve: (users) => users.role,
            },
          },
        }),
      ),
    },
    usersQtd: {
      type: GraphQLString,
      resolve: (event: EventDocument) => event.users.length,
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
