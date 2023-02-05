import { MerchantLoader } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { MerchantType } from './MerchantType';

const meAdminField = () => ({
  meAdmin: {
    type: MerchantType,
    resolve: async (_, args, ctx: GraphQLContext) => await MerchantLoader.load(ctx, ctx.merchant?._id),
  },
});

export { meAdminField };
