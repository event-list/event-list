import jwt from 'jsonwebtoken';
import type { Context, Next } from 'koa';

import type { UserDocument } from '@event-list/modules';
import { USER_SESSION_COOKIE, UserModel } from '@event-list/modules';
import { config } from '@event-list/shared';

import { getDataloaders } from '../loader/loaderRegistry';

type GetMerchantFromCookieArgs = {
  dataloaders: object;
  user: UserDocument | null;
};

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

const getMerchantFromUser = async ({ dataloaders, user }: GetMerchantFromCookieArgs) => {
  try {
    // const merchant = await MerchantLoader.load(
    //   {
    //     dataloaders,
    //   },
    //   user?.merchant._id,
    // );
    // return { merchant };
    return { merchant: null };
  } catch (err) {
    console.log('error loading merchant ', err);
    return { merchant: null };
  }
};

const getAdminAuth = async (ctx: Context, next: Next) => {
  const dataloaders = getDataloaders();
  const sessionCookie = ctx.cookies.get(USER_SESSION_COOKIE);

  const { user } = await getUserFromCookie(sessionCookie);
  // const { merchant } = await getMerchantFromUser({
  //   user,
  //   dataloaders,
  // });

  ctx.dataloaders = dataloaders;
  // ctx.merchant = merchant;
  ctx.user = user;

  await next();
};

export { getAdminAuth, getUserFromCookie, getMerchantFromUser };
