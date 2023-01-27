export const GRAPHQL_TYPE = {
  ADMIN: 'ADMIN',
  WEB: 'WEB',
  SERVER: 'SERVER',
};

export type GraphQLTypes = keyof typeof GRAPHQL_TYPE;
