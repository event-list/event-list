import jwt from 'jsonwebtoken'
import { ParameterizedContext } from 'koa'
import type { Context, Next } from 'koa';
import {config} from './config'
import { UserDocument, UserModel } from '@event-list/modules'
import { getDataloaders } from './loader/loaderRegistry'

const AUTH_COOKIE_NAME = 'jwt'

interface DecodedToken {
  id: string
}

async function getUser(ctx: ParameterizedContext) {
  const token = ctx.cookies.get('jwt')

  if (!token) return { user: null }

  try {
    const decodedToken = jwt.verify(token.substring(0), config.JWT_SECRET)

    const user = await UserModel.findOne({ _id: (decodedToken as DecodedToken).id })

    return { user }
  } catch (err) {
    return { user: null }
  }
}

export const getAdminAuth = async (ctx: Context, next: Next) => {
  const dataloaders = getDataloaders();
  const { user } = await getUser(ctx);

  ctx.dataloaders = dataloaders;
  ctx.user = user;

  await next();
};

function generateToken(user: UserDocument) {
  return jwt.sign({ id: user._id }, config.JWT_SECRET)
}

function setAuthCookie(ctx: ParameterizedContext, user: UserDocument | null) {
  ctx.cookies.set(AUTH_COOKIE_NAME, user ? generateToken(user) : null, {
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
    signed: false
  })
}

export { getUser, generateToken, setAuthCookie }
