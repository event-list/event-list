export const GRAPHQL_TYPE = {
  ADMIN: 'ADMIN',
  WEB: 'WEB',
  SERVER: 'SERVER',
  SERVER_ADMIN: 'SERVER_ADMIN',
};

export type GraphQLTypes = keyof typeof GRAPHQL_TYPE;
