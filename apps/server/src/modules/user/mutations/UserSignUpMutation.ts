import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { UserType } from '../UserType';
import {
  HandleCreateUserPayload,
  UserLoader,
  handleUserCreate,
} from '@event-list/modules';
import { setAuthCookie } from '../../../auth';
import { meField } from '../UserFields';

type UserSignUpMutationArgs = {} & HandleCreateUserPayload;

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
  mutateAndGetPayload: async (args: UserSignUpMutationArgs, context) => {
    const payload = { ...args };

    const { user, error } = await handleUserCreate({
      payload,
      context,
    });

    if (error) return { id: null, success: null, error };

    setAuthCookie(context.ctx, user!);

    return {
      id: user!._id,
      success: 'User successfully signed up',
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
