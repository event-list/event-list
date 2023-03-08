import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString } from 'graphql/type';

import { handleUpdateEvent } from '@event-list/modules';
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
    eventOpenAt: {
      type: GraphQLString,
    },
    eventEndAt: {
      type: GraphQLString,
    },
    listAvailableAt: {
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

    const { success, error } = await handleUpdateEvent({
      payload: { ...args, merchantId: merchant._id },
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
