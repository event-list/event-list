import { UserLoader } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { UserType } from './UserType';

const meField = () => ({
  me: {
    type: UserType,
    resolve: async (_, __, ctx: GraphQLContext) => await UserLoader.load(ctx, ctx.user?._id),
  },
});

export { meField };
