import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { routerAdmin } from '@event-list/server-admin';

import { router } from './graphql/router';

const app = new Koa();

app.use(bodyParser());
app.use(cors({ maxAge: 86400, credentials: true }));
app.use(router.routes()).use(router.allowedMethods());
app.use(routerAdmin.routes()).use(router.allowedMethods());

export default app;
