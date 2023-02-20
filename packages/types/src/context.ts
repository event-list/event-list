import type DataLoader from 'dataloader';
import type { ParameterizedContext } from 'koa';

import type { MerchantDocument, UserDocument } from '@event-list/modules';

type GraphQLContext = {
  ctx: ParameterizedContext;
  dataloaders: DataLoader;
  user?: UserDocument;
  merchant?: MerchantDocument;
  t: ([key]: string) => string;
};

export type { GraphQLContext };
