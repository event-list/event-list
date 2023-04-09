import { connectionArgs, withFilter } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLBoolean, GraphQLList } from 'graphql/type';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import type { EventDocument } from '@event-list/modules';
import {
  EventLoader,
  MerchantLoader,
  MerchantType,
  nodeInterface,
  registerTypeLoader,
  ParticipantLoader,
} from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { ParticipantConnection } from '../participant/ParticipantType';

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
      resolve: (event) => event.dateEnd > new Date(),
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
    batches: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(
            new GraphQLObjectType({
              name: 'batches',
              fields: {
                title: {
                  type: new GraphQLNonNull(GraphQLString),
                  resolve: (batches) => batches.title,
                },
                value: {
                  type: new GraphQLNonNull(GraphQLString),
                  resolve: (batches) => batches.value,
                },
                date: {
                  type: new GraphQLNonNull(GraphQLString),
                  resolve: (batches) => batches.date,
                },
                visible: {
                  type: new GraphQLNonNull(GraphQLString),
                  resolve: (batches) => batches.visible,
                },
              },
            }),
          ),
        ),
      ),
    },
    currentBatch: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (event) => event.batches.find((batch) => batch.visible && new Date() < batch.date)?.value,
    },
    status: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (event) => event.status,
    },
    participants: {
      type: new GraphQLNonNull(ParticipantConnection),
      args: { ...connectionArgs },
      resolve: async (event, args, context: GraphQLContext) =>
        await ParticipantLoader.loadAll(
          context,
          withFilter(args, {
            event: event._id,
          }),
        ),
    },
    participantsQtd: {
      type: GraphQLString,
      resolve: (event: EventDocument) => event.participants.length,
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
