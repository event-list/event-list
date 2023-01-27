import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { mutationWithClientMutationId } from 'graphql-relay';

import { setSessionTokenCookie, USER_SESSION_COOKIE } from '@event-list/modules';

const UserSignOutMutation = mutationWithClientMutationId({
  name: 'UserSignOutMutation',
  inputFields: {},
  mutateAndGetPayload: async (_, ctx) => {
    const { t } = ctx;

    await setSessionTokenCookie(ctx, USER_SESSION_COOKIE, null);

    return {
      error: null,
      success: t('Sign Out successful'),
    };
  },
  outputFields: {
    ...successField,
    ...errorField,
  },
});

export { UserSignOutMutation };
