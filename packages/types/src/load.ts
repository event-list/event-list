import { GraphQLContext } from './context';

export type Load = (context: GraphQLContext, id: string) => unknown;
