import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { mutationWithClientMutationId } from 'graphql-relay';

import { MERCHANT_SESSION_COOKIE, setSessionTokenCookie } from '@event-list/modules';

const MerchantSignOutMutation = mutationWithClientMutationId({
  name: 'MerchantSignOutMutation',
  inputFields: {},
  mutateAndGetPayload: async (_, ctx) => {
    const { t } = ctx;

    await setSessionTokenCookie(ctx, MERCHANT_SESSION_COOKIE, null);

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

export { MerchantSignOutMutation };
