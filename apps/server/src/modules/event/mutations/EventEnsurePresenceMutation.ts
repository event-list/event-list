import { errorField, getObjectId, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { EventModel, UserModel, handleAddParticipant, handleAddParticipantInEvent } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const EventEnsurePresenceMutation = mutationWithClientMutationId({
  name: 'EventEnsurePresenceMutation',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { user: userCtx, t } = context;

    if (!userCtx) return { id: null, success: null, error: t('Unauthorized') };

    const { eventId } = args;

    const event = await EventModel.findOne({ _id: getObjectId(eventId) });

    if (!event) return { id: null, success: null, error: t('Event not found') };

    const user = await UserModel.findOne({
      _id: userCtx._id,
      removedAt: null,
    });

    if (!user) return { id: null, success: null, error: t('User not found') };

    const {
      participant,
      isNewParticipant,
      error: errorP,
    } = await handleAddParticipant({
      payload: {
        name: user.name,
        event,
        batch: event.getCurrentBatch(event.batches).title,
      },
      context,
    });

    if (!participant || !isNewParticipant) {
      return {
        success: null,
        error: errorP ?? 'Error on update existent participant',
      };
    }

    const { error } = await handleAddParticipantInEvent({
      payload: { event, participant },
      context,
    });

    if (error) {
      return {
        success: null,
        error,
      };
    }

    return { success: 'Presence successfully ensured for this event', error: null };
  },
  outputFields: {
    ...successField,
    ...errorField,
  },
});

export { EventEnsurePresenceMutation };
