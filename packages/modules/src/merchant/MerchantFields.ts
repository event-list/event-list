import { connectionArgs, withFilter } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull } from 'graphql';

import { MerchantConnection, MerchantLoader, MerchantType } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

const merchantField = () => ({
  merchants: {
    type: new GraphQLNonNull(MerchantConnection),
    args: { ...connectionArgs },
    resolve: async (_, args, ctx) => await MerchantLoader.loadAll(ctx, withFilter(args, { hasEventPublished: true })),
  },
});

const meAdminField = () => ({
  meAdmin: {
    type: MerchantType,
    resolve: async (_, __, ctx: GraphQLContext) => await MerchantLoader.load(ctx, ctx.merchant?._id),
  },
});

export { merchantField, meAdminField };
