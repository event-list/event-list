import cors from '@koa/cors'
import { GraphQLError } from 'graphql'
import koaPlayground from 'graphql-playground-middleware-koa'
import Koa, { ParameterizedContext, Request, Response } from 'koa'
import bodyParser from 'koa-bodyparser'
import { graphqlHTTP, OptionsData } from 'koa-graphql'
import Router from 'koa-router'
import { getUser } from './auth'
import { getDataloaders } from './modules/loader'
import { UserDocument } from './modules/user/UserModel'
import { schema } from './schema'

interface ContextVars {
  ctx?: ParameterizedContext
  user: UserDocument | null
}

const app = new Koa()
const router = new Router()

async function getContext({ ctx, user }: ContextVars) {
  const dataloaders = getDataloaders()

  return {
    ctx,
    dataloaders,
    user
  } as const
}

const graphqlSettingsPerReq = async (_: Request, __: Response, ctx: ParameterizedContext) => {
  const { user } = await getUser(ctx)

  return {
    graphiql: true,
    schema,
    context: await getContext({ ctx, user }),
    customFormatErrorFn: (error: GraphQLError) => {
      console.log(error.message)
      console.log(error.locations)
      console.log(error.stack)

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack
      }
    }
  } as OptionsData
}

router.all('/graphql', graphqlHTTP(graphqlSettingsPerReq))

router.all(
  '/graphiql',
  koaPlayground({
    endpoint: '/graphql',
    workspaceName: 'dark'
  })
)

app.use(bodyParser())
app.use(cors({ credentials: true }))
app.use(router.routes()).use(router.allowedMethods())

export default app
