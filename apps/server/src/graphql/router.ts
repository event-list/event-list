import Router from '@koa/router';
import { getGraphQLParameters, processRequest, renderGraphiQL, shouldRenderGraphiQL } from 'graphql-helix';
import { koaPlayground } from 'graphql-playground-middleware';
import type koa from 'koa';

import { GRAPHQL_TYPE } from '@event-list/modules';

import { getDataloaders } from '../loader/loaderRegistry';
import { schema } from '../schema';
import { getAdminAuth } from './getAuth';

export const serverHelix = async (ctx: koa.Context, next: koa.Next) => {
  const request = ctx.request;

  if (shouldRenderGraphiQL(request)) {
    ctx.body = renderGraphiQL({ endpoint: '/admin' });
    return;
  }

  const dataloaders = ctx?.dataloaders ?? getDataloaders();

  const context = {
    dataloaders,
    graphql: GRAPHQL_TYPE.SERVER,
    ctx,
    merchant: ctx.merchant,
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
  }),
);

router.all('/graphql', serverHelix);
