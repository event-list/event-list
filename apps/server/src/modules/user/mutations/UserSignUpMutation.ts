import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import type { UserDocument } from '@event-list/modules';
import {
  generateToken,
  handleCreateUser,
  setSessionTokenCookie,
  USER_SESSION_COOKIE,
  USER_TOKEN_SCOPES,
} from '@event-list/modules';

import { meField } from '../UserFields';

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
    gender: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context) => {
    const { t } = context;
    const payload = { ...args };

    const { user, error } = await handleCreateUser({
      payload,
      context,
    });

    if (!user) {
      return {
        user: null,
        success: null,
        error: t('Something wrong'),
      };
    }

    if (error) return { id: null, success: null, error };

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
