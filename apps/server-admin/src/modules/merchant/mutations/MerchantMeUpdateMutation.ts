import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString } from 'graphql/type';

import { meAdminField, MerchantModel } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const MerchantMeUpdateMutation = mutationWithClientMutationId({
  name: 'MerchantMeUpdateMutation',
  inputFields: {
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    logo: {
      type: GraphQLString,
    },
    biography: {
      type: GraphQLString,
    },
    phoneNumber: {
      type: GraphQLString,
    },
    instagramAccount: {
      type: GraphQLString,
    },
    facebookAccount: {
      type: GraphQLString,
    },
    twitterAccount: {
      type: GraphQLString,
    },
    website: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args, context: GraphQLContext) => {
    const { merchant, t } = context;

    if (!merchant) return { id: null, success: null, error: t('Unauthorized') };

    const payload = { ...args };

    await MerchantModel.findOneAndUpdate({ _id: merchant._id }, payload);

    return {
      id: merchant._id,
      success: t('Merchant successfully updated'),
      error: null,
    };
  },
  outputFields: {
    ...meAdminField(),
    ...successField,
    ...errorField,
  },
});

export { MerchantMeUpdateMutation };
