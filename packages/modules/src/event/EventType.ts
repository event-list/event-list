import { GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { GraphQLBoolean } from 'graphql/type';

import { EventLoader, MerchantLoader, nodeInterface, registerTypeLoader } from '@event-list/modules';
import { MerchantType } from '@event-list/server-admin/src/modules/merchant/MerchantType';

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
    slug: {
      type: GraphQLString,
      resolve: (event) => event.slug,
    },
    flyer: {
      type: GraphQLString,
      resolve: (event) => event.flyer,
    },
    label: {
      type: MerchantType,
      resolve: (event, _, context) => MerchantLoader.load(context, event.label),
    },
    place: {
      type: GraphQLString,
      resolve: (event) => event.place,
    },
    published: {
      type: GraphQLBoolean,
      resolve: (event) => event.published,
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
  }),
  interfaces: () => [nodeInterface],
});

registerTypeLoader(EventType, EventLoader.load);

const { connectionType: EventConnection, edgeType: EventEdge } = connectionDefinitions({
  name: 'Event',
  nodeType: EventType,
});

export { EventConnection, EventEdge, EventType };
