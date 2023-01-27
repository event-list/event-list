import type DataLoader from 'dataloader';
import type { ParameterizedContext } from 'koa';

import type { UserDocument } from '@event-list/modules';

type GraphQLContext = {
  ctx: ParameterizedContext;
  dataloaders: DataLoader;
  user?: UserDocument;
  // merchant: MerchantDocument;
};

export type { GraphQLContext };
