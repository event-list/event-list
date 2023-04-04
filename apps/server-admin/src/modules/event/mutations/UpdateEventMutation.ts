import { errorField, getObjectId, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { GraphQLString } from 'graphql/type';
import { mutationWithClientMutationId } from 'graphql-relay';

import { EventModel, handleUpdateEvent } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

export const UpdateEventMutation = mutationWithClientMutationId({
  name: 'UpdateEventMutation',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    flyer: {
      type: GraphQLString,
    },
    place: {
      type: GraphQLString,
    },
    classification: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { t, merchant } = context;

    if (!merchant) return { success: null, error: t('Unauthorized') };

    const { eventId, ...rest } = args;

    const event = await EventModel.findOne({ _id: getObjectId(eventId) });

    if (!event) return { success: null, error: t('Event not found') };

    const { success, error } = await handleUpdateEvent({
      payload: { ...rest, event, merchantId: merchant._id },
      context,
    });

    return {
      success,
      error,
    };
  },
  outputFields: {
    ...successField,
    ...errorField,
  },
});
