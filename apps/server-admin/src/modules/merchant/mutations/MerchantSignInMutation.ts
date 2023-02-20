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
  TAXID_TYPE,
  meAdminField,
} from '@event-list/modules';

type MerchantSignInMutationArgs = {
  cnpj: string;
  password: string;
};

const MerchantSignInMutation = mutationWithClientMutationId({
  name: 'MerchantSignInMutation',
  inputFields: {
    cnpj: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: MerchantSignInMutationArgs, context) => {
    const { t } = context;

    const { cnpj, password } = {
      password: args.password.trim(),
      cnpj: args.cnpj.trim(),
    };

    if (!cnpj || !password) {
      return {
        merchant: null,
        success: null,
        error: t('Fill all the fields'),
      };
    }

    const merchant = await MerchantModel.findOne({
      taxID: { taxID: cnpj, type: TAXID_TYPE.BR_CNPJ },
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
