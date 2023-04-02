import { getObjectId } from '@entria/graphql-mongo-helpers';
import jwt from 'jsonwebtoken';

import { config } from '@event-list/shared';
import type { GraphQLContext } from '@event-list/types';

// 1 year
// eslint-disable-next-line
const maxAge = 365 * 24 * 60 * 60 * 100;

export const setSessionTokenCookie = async (
  context: GraphQLContext,
  COLLECTION_SESSION_COOKIE: string,
  token: string | null,
) => {
  try {
    const domain = config.EVENT_LIST_ENV === 'production' ? 'evtlist.com' : undefined;

    const options = {
      domain,
      httpOnly: true,
      secure: config.EVENT_LIST_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge,
    };

    context.ctx.cookies.set(COLLECTION_SESSION_COOKIE, token, options);
  } catch (err) {
    // eslint-disable-next-line
    console.log('set cookie failed: ', err);
  }
};

export const generateToken = <T>(model: T, scope: string) =>
  jwt.sign(
    {
      id: getObjectId(model)?.toString(),
      scope,
    },
    config.JWT_SECRET,
  );
