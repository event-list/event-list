import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLString } from 'graphql/type';
import { mutationWithClientMutationId } from 'graphql-relay';

import { meField, UserModel } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const UserMeUpdateMutation = mutationWithClientMutationId({
  name: 'UserMeUpdateMutation',
  inputFields: {
    name: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { user, t } = context;

    if (!user) return { id: null, success: null, error: t('Unauthorized') };

    const payload = { ...args };

    await UserModel.findOneAndUpdate({ _id: user._id }, payload);

    return {
      id: user._id,
      success: t('User successfully updated'),
      error: null,
    };
  },
  outputFields: {
    ...meField(),
    ...successField,
    ...errorField,
  },
});

export { UserMeUpdateMutation };
