import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import type { MerchantDocument } from '@event-list/modules';
import {
  generateToken,
  MerchantModel,
  setSessionTokenCookie,
  MERCHANT_TOKEN_SCOPES,
  MERCHANT_SESSION_COOKIE,
  meAdminField,
} from '@event-list/modules';

type MerchantSignInMutationArgs = {
  email: string;
  password: string;
};

const MerchantSignInMutation = mutationWithClientMutationId({
  name: 'MerchantSignInMutation',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: MerchantSignInMutationArgs, context) => {
    const { t } = context;

    const { email, password } = {
      password: args.password.trim(),
      email: args.email.trim().toLowerCase(),
    };

    if (!email || !password) {
      return {
        merchant: null,
        success: null,
        error: t('Fill all the fields'),
      };
    }

    const merchant = await MerchantModel.findOne({
      email,
      removedAt: null,
    });

    if (!merchant) {
      return {
        merchant: null,
        success: null,
        error: t('Merchant not found'),
      };
    }

    // const passwordMatch = merchant.authenticate(password);
    //
    // if (!passwordMatch) {
    //   return {
    //     merchant: null,
    //     success: null,
    //     error: t('CNPJ or password wrong'),
    //   };
    // }

    const merchantToken = generateToken<MerchantDocument>(merchant, MERCHANT_TOKEN_SCOPES.SESSION);

    await setSessionTokenCookie(context, MERCHANT_SESSION_COOKIE, `JWT ${merchantToken}`);

    return {
      merchant: merchant._id,
      success: t('Logged in successfully'),
      error: null,
    };
  },
  outputFields: {
    ...meAdminField(),
    ...successField,
    ...errorField,
  },
});

export { MerchantSignInMutation };
