import jwt from 'jsonwebtoken';
import type { Context, Next } from 'koa';

import { USER_SESSION_COOKIE, UserModel } from '@event-list/modules';
import { config } from '@event-list/shared';

import { getDataloaders } from '../loader/loaderRegistry';

const getUserFromCookie = async (sessionCookie?: string) => {
  if (!sessionCookie) {
    return { user: null };
  }

  try {
    const token = jwt.verify(sessionCookie?.replace('JWT', '').trim(), config.JWT_SECRET);

    const user = await UserModel.findById(token.id);

    return { user };
  } catch (err) {
    console.log('error while verifying token ', err);
    return { user: null };
  }
};

const getAdminAuth = async (ctx: Context, next: Next) => {
  const dataloaders = getDataloaders();
  const sessionCookie = ctx.cookies.get(USER_SESSION_COOKIE);

  const { user } = await getUserFromCookie(sessionCookie);

  ctx.dataloaders = dataloaders;
  ctx.user = user;

  await next();
};

export { getAdminAuth, getUserFromCookie };
