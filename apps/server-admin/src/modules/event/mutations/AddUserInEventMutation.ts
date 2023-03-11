import { errorField, getObjectId, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLList, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { EventModel } from '@event-list/modules';
import { handleAddUserInEvent } from '@event-list/modules/src/event/addUser/handleAddUserInEvent';
import type { GraphQLContext } from '@event-list/types';

const AddUserInEventMutation = mutationWithClientMutationId({
  name: 'AddUserInEventMutation',
  inputFields: {
    eventId: {
      type: GraphQLString,
    },
    names: {
      type: new GraphQLList(GraphQLString),
    },
    role: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { merchant, t } = context;

    if (!merchant) return { id: null, success: null, error: t('Unauthorized') };

    const { eventId, names, role } = args;

    if (!names) return { id: null, success: null, error: t('Send at least one name') };

    if (!Array.isArray(names))
      return {
        id: null,
        success: null,
        error: t('Names must be array, send separated by lines'),
      };

    if (!role) return { id: null, success: null, error: t('Send the role') };

    const event = await EventModel.findOne({ _id: getObjectId(eventId) });

    if (!event) return { id: null, success: null, error: t('Event not found') };

    const responses = await Promise.all(
      names.map(async (name) => {
        const { success, error } = await handleAddUserInEvent({
          payload: { event, name, role, overwrite: true },
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

export { AddUserInEventMutation };
