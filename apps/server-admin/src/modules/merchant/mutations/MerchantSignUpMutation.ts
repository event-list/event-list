import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import type { MerchantDocument } from '@event-list/modules';
import {
  generateToken,
  handleCreateMerchant,
  meAdminField,
  MERCHANT_SESSION_COOKIE,
  MERCHANT_TOKEN_SCOPES,
  setSessionTokenCookie,
} from '@event-list/modules';

const MerchantSignUpMutation = mutationWithClientMutationId({
  name: 'MerchantSignUpMutation',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    logo: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    // cnpj: {
    //   type: new GraphQLNonNull(TaxIDInputType),
    // },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context) => {
    const { t } = context;
    const payload = { ...args };

    const { merchant, error } = await handleCreateMerchant({
      payload,
      context,
    });

    if (error) return { id: null, success: null, error };

    if (!merchant) {
      return {
        merchant: null,
        success: null,
        error: t('Something wrong'),
      };
    }

    const merchantToken = generateToken<MerchantDocument>(merchant, MERCHANT_TOKEN_SCOPES.SESSION);

    await setSessionTokenCookie(context, MERCHANT_SESSION_COOKIE, `JWT ${merchantToken}`);

    return {
      id: merchant._id,
      success: 'Merchant successfully signed up',
      error: null,
    };
  },
  outputFields: {
    ...meAdminField(),
    ...successField,
    ...errorField,
  },
});

export { MerchantSignUpMutation };
