import { connectionArgs, withFilter } from '@entria/graphql-mongo-helpers';
import { GraphQLObjectType } from 'graphql';
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import { EventConnection, EventLoader, MerchantLoader, nodeInterface, registerTypeLoader } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const MerchantType = new GraphQLObjectType({
  name: 'Merchant',
  description: 'Event list Merchant',
  fields: () => ({
    id: globalIdField('Merchant'),
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (merchant) => merchant.email,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (merchant) => merchant.name,
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (merchant) => merchant.description,
    },
    logo: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (merchant) => merchant.logo,
    },
    biography: {
      type: GraphQLString,
      resolve: (merchant) => merchant.biography,
    },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (merchant) => merchant.phoneNumber,
    },
    instagramAccount: {
      type: GraphQLString,
      resolve: (merchant) => merchant.instagramAccount,
    },
    facebookAccount: {
      type: GraphQLString,
      resolve: (merchant) => merchant.facebookAccount,
    },
    twitterAccount: {
      type: GraphQLString,
      resolve: (merchant) => merchant.twitterAccount,
    },
    website: {
      type: GraphQLString,
      resolve: (merchant) => merchant.website,
    },
    features: {
      type: new GraphQLList(GraphQLString),
      resolve: (merchant) => merchant.features,
    },
    events: {
      type: EventConnection,
      args: { ...connectionArgs },
      resolve: async (merchant, args, ctx: GraphQLContext) =>
        await EventLoader.loadAll(
          ctx,
          withFilter(args, {
            merchant: merchant._id,
            status: true,
            published: true,
          }),
        ),
    },
    // taxID: {
    //   type: new GraphQLNonNull(TaxIDType),
    //   resolver: (merchant) => merchant.taxID,
    // },
  }),
  interfaces: () => [nodeInterface],
});

registerTypeLoader(MerchantType, MerchantLoader.load);

const { connectionType: MerchantConnection, edgeType: MerchantEdge } = connectionDefinitions({
  name: 'Merchant',
  nodeType: MerchantType,
});

export { MerchantConnection, MerchantEdge, MerchantType };
