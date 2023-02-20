import jwt from 'jsonwebtoken';
import type { Context, Next } from 'koa';

import { MERCHANT_SESSION_COOKIE, MerchantModel } from '@event-list/modules';
import { config } from '@event-list/shared';

import { getDataloaders } from '../loader/loaderRegistry';

const getUserFromCookie = async (sessionCookie?: string) => {
  if (!sessionCookie) {
    return { merchant: null };
  }

  try {
    // @ts-expect-error todo
    const token = jwt.verify(sessionCookie?.replace('JWT', '').trim(), config.JWT_SECRET);

    const merchant = await MerchantModel.findById(token.id);

    return { merchant };
  } catch (err) {
    console.log('error while verifying token ', err);
    return { merchant: null };
  }
};

const getAdminAuth = async (ctx: Context, next: Next) => {
  const dataloaders = getDataloaders();
  const sessionCookie = ctx.cookies.get(MERCHANT_SESSION_COOKIE);

  const { merchant } = await getUserFromCookie(sessionCookie);

  ctx.dataloaders = dataloaders;
  ctx.merchant = merchant;

  await next();
};

export { getAdminAuth, getUserFromCookie };
