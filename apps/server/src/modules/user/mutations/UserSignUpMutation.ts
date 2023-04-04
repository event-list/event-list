import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import type { UserDocument } from '@event-list/modules';
import {
  generateToken,
  handleCreateUser,
  meField,
  setSessionTokenCookie,
  USER_SESSION_COOKIE,
  USER_TOKEN_SCOPES,
} from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const UserSignUpMutation = mutationWithClientMutationId({
  name: 'UserSignUpMutation',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { t } = context;
    const payload = { ...args };

    const { user, error } = await handleCreateUser({
      payload,
      context,
    });

    if (error) return { id: null, success: null, error };

    if (!user) {
      return {
        user: null,
        success: null,
        error: t('Something wrong'),
      };
    }

    const userToken = generateToken<UserDocument>(user, USER_TOKEN_SCOPES.SESSION);

    await setSessionTokenCookie(context, USER_SESSION_COOKIE, `JWT ${userToken}`);

    return {
      id: user._id,
      success: t('User successfully signed up'),
      error: null,
    };
  },
  outputFields: {
    ...meField(),
    ...successField,
    ...errorField,
  },
});

export { UserSignUpMutation };
