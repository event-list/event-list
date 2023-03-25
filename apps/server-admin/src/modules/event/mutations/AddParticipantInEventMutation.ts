import { errorField, getObjectId, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { EventModel, handleAddParticipant, handleAddParticipantInEvent } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const AddParticipantInEventMutation = mutationWithClientMutationId({
  name: 'AddParticipantInEventMutation',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    names: {
      type: new GraphQLList(GraphQLString),
    },
    batch: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { merchant, t } = context;

    if (!merchant) return { id: null, success: null, error: t('Unauthorized') };

    const { eventId, names, batch } = args;

    if (!Array.isArray(names))
      return {
        id: null,
        success: null,
        error: t('Names must be array, send separated by lines'),
      };

    const event = await EventModel.findOne({ _id: getObjectId(eventId) });

    if (!event) return { id: null, success: null, error: t('Event not found') };

    if (event.merchant._id.toString() !== merchant._id.toString()) {
      return { id: null, success: null, error: t('Unauthorized') };
    }

    // i don't like it
    // https://dev.to/woovi/processing-promises-in-batch-2le6
    const responses = await Promise.all(
      names.map(async (name) => {
        const {
          participant,
          isNewParticipant,
          success: successP,
          error: errorP,
        } = await handleAddParticipant({
          payload: { name, event, batch, overwrite: true },
          context,
        });

        if (!participant || !isNewParticipant) {
          return { success: successP, error: errorP };
        }

        const { success, error } = await handleAddParticipantInEvent({
          payload: { event, participant },
          context,
        });

        return { success, error };
      }),
    );

    const responseWithError = responses.filter((response) => response.error !== null || undefined);

    if (responseWithError.length > 0) {
      return {
        success: null,
        error: responseWithError[0].error,
      };
    }

    return {
      success: t('Presence successfully for these names'),
      error: null,
    };
  },
  outputFields: {
    ...successField,
    ...errorField,
  },
});

export { AddParticipantInEventMutation };
