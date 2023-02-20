import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString } from 'graphql/type';

import { handleChangeEventStatus } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

export const ChangeEventStatusMutation = mutationWithClientMutationId({
  name: 'ChangeEventStatusMutation',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { t, merchant } = context;

    const { eventId } = args;

    console.log(merchant);

    if (!merchant) return { success: null, error: t('Unauthorized') };

    const { success, error } = await handleChangeEventStatus({
      payload: { eventId, merchantId: merchant._id },
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
