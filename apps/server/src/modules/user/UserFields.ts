import { GraphQLContext } from '@event-list/types';
import { UserType } from './UserType';
import { UserLoader } from '@event-list/modules';

const meField = () => ({
  me: {
    type: UserType,
    resolve: async (_, args, ctx: GraphQLContext) =>
      await UserLoader.load(ctx, ctx.user?.id),
  },
});

export { meField };
