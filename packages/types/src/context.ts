import { ParameterizedContext } from 'koa';
import { UserDocument } from '@event-list/modules';
import type DataLoader from 'dataloader';

type GraphQLContext = {
  ctx: ParameterizedContext;
  // @ts-expect-error
  dataloaders: DataLoader;
  user?: UserDocument;
};

export type { GraphQLContext };
