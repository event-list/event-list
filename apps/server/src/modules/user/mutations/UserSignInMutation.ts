import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import type { UserDocument } from '@event-list/modules';
import {
  generateToken,
  meField,
  setSessionTokenCookie,
  USER_SESSION_COOKIE,
  USER_TOKEN_SCOPES,
  UserModel,
} from '@event-list/modules';

type UserSignInMutationArgs = {
  email: string;
  password: string;
};

const UserSignInMutation = mutationWithClientMutationId({
  name: 'UserSignInMutation',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: UserSignInMutationArgs, context) => {
    const { t } = context;

    const { email, password } = {
      password: args.password.trim(),
      email: args.email.trim().toLowerCase(),
    };

    if (!email || !password) {
      return {
        user: null,
        success: null,
        error: t('Fill all the fields'),
      };
    }

    const user = await UserModel.findOne({
      email,
      removedAt: null,
    });

    if (!user) {
      return {
        user: null,
        success: null,
        error: t('User not found'),
      };
    }

    const passwordMatch = user.authenticate(password);

    if (!passwordMatch) {
      return {
        user: null,
        success: null,
        error: t('Email or password wrong'),
      };
    }

    const userToken = generateToken<UserDocument>(user, USER_TOKEN_SCOPES.SESSION);

    await setSessionTokenCookie(context, USER_SESSION_COOKIE, `JWT ${userToken}`);

    return {
      user: user._id,
      success: t('Logged in successfully'),
      error: null,
    };
  },
  outputFields: {
    ...meField(),
    ...successField,
    ...errorField,
  },
});

export { UserSignInMutation };
