import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const TaxIDInputType = new GraphQLInputObjectType({
  name: 'TaxIDInputType',
  description: 'TaxID',
  fields: () => ({
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'TaxID type',
    },
    taxID: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'TaxID string/number',
    },
  }),
});

export const TaxIDType = new GraphQLObjectType({
  name: 'TaxID',
  description: 'Represent a TaxID',
  fields: () => ({
    taxID: {
      type: GraphQLString,
      description: 'taxID number/string',
      resolve: (taxID) => taxID.taxID,
    },
    type: {
      type: GraphQLString,
      description: 'type of this taxID',
      resolve: (taxID) => taxID.type,
    },
  }),
});

export default TaxIDType;
