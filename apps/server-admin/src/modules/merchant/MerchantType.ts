import { GraphQLObjectType } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql/type';

import { MerchantLoader, registerTypeLoader, TaxIDType } from '@event-list/modules';

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
    phoneNumber: {
      type: GraphQLString,
      resolve: (merchant) => merchant.phoneNumber,
    },
    taxID: {
      type: new GraphQLNonNull(TaxIDType),
      resolver: (merchant) => merchant.taxID,
    },
  }),
});

const { connectionType: MerchantConnection, edgeType: MerchantEdge } = connectionDefinitions({
  name: 'Merchant',
  nodeType: MerchantType,
});

registerTypeLoader(MerchantType, MerchantLoader.load);

export { MerchantConnection, MerchantEdge, MerchantType };
