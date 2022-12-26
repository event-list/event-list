import { connectionArgs } from '@entria/graphql-mongo-helpers'
import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLContext } from '../graphql/context'

import * as EventLoader from '../modules/event/EventLoader'
import { EventConnection } from '../modules/event/EventType'
import { nodeField, nodesField } from '../modules/node/typeRegister'
import * as UserLoader from '../modules/user/UserLoader'
import { UserType } from '../modules/user/UserType'

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'All queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    user: {
      type: UserType,
      resolve: async (_, args, ctx: GraphQLContext) => await UserLoader.load(ctx, ctx.user?.id)
    },
    events: {
      type: new GraphQLNonNull(EventConnection),
      args: { ...connectionArgs },
      resolve: async (_, args, ctx: GraphQLContext) => await EventLoader.loadAll(ctx, args)
    }
  })
})

export { QueryType }
