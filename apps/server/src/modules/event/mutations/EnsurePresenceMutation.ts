import { errorField, getObjectId, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { EventModel, UserModel } from '@event-list/modules';
import { handleAddUserInEvent } from '@event-list/modules/src/event/addUser/handleAddUserInEvent';
import type { GraphQLContext } from '@event-list/types';

const EnsurePresenceMutation = mutationWithClientMutationId({
  name: 'EnsurePresenceMutation',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { user: userCtx, t } = context;

    const { eventId } = args;

    if (!userCtx) return { id: null, success: null, error: t('Unauthorized') };

    const event = await EventModel.findOne({ _id: getObjectId(eventId) });

    if (!event) return { id: null, success: null, error: t('Event not found') };

    const user = await UserModel.findOne({
      _id: userCtx._id,
      removedAt: null,
    });

    if (!user) return { id: null, success: null, error: t('User not found') };

    const { success, error } = await handleAddUserInEvent({
      payload: {
        event,
        name: user.name,
        role: event.getCurrentPrice().title,
      },
      context,
    });

    await event.save();

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

export { EnsurePresenceMutation };
