import { getObjectId } from '@entria/graphql-mongo-helpers';
import jwt from 'jsonwebtoken';

import { sendToDiscord } from '@event-list/modules';
import { config } from '@event-list/shared';
import type { GraphQLContext } from '@event-list/types';

// 1 year
const maxAge = 365 * 24 * 60 * 60 * 100;

export const setSessionTokenCookie = async (
  context: GraphQLContext,
  COLLECTION_SESSION_COOKIE: string,
  token: string | null,
) => {
  try {
    const domain = config.EVENT_LIST_ENV === 'production' ? config.EVENT_LIST_DOMAIN : undefined;

    const options = {
      domain,
      httpOnly: true,
      secure: false,
      // secure: config.EVENT_LIST_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge,
    };

    context.ctx.cookies.set(COLLECTION_SESSION_COOKIE, token, options);
  } catch (err) {
    console.log('set cookie failed: ', err);

    if (config.EVENT_LIST_ENV === 'production') {
      await sendToDiscord({
        url: config.DISCORD_GENERAL_WEBHOOK,
        content: `cookies err - ${COLLECTION_SESSION_COOKIE} - ${err}`,
      });
    }
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
