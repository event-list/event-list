import koa from 'koa';
import Router from '@koa/router';
import { koaPlayground } from 'graphql-playground-middleware';
import { schema } from './schema';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import { getDataloaders } from './loader/loaderRegistry';
import { getAdminAuth, getUser } from './auth';

export const serverHelix = async (ctx: koa.Context, next: koa.Next) => {
  const request = ctx.request;

  if (shouldRenderGraphiQL(request)) {
    ctx.body = renderGraphiQL({ endpoint: '/admin' });
    return;
  }

  const dataloaders = ctx?.dataloaders ?? getDataloaders();

  const context = {
    dataloaders,
    ctx,
    user: ctx.user,
    t: (key: string) => key,
  };

  const test = getGraphQLParameters(request);
  const { operationName, query, variables } = test;

  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema,
    contextFactory: () => context,
  });

  if (result.type === 'RESPONSE') {
    result.headers.forEach(({ name, value }) => {
      ctx.headers[name] = value;
    });
    ctx.status = result.status;
    ctx.body = result.payload;
    await next();
    return;
  }

  ctx.status = 200;
  ctx.headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  await next();
};

export const router = new Router();

router.all('/graphql', getAdminAuth);

router.all(
  '/graphql/playground',
  koaPlayground({
    endpoint: '/graphql',
  })
);

router.all('/graphql', serverHelix);
