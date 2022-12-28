import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { setAuthCookie } from '../../../auth';
import { UserType } from '../UserType';

import { UserLoader, UserModel } from '@event-list/modules';
import { meField } from '../UserFields';

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

    setAuthCookie(context.ctx, user!);

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
