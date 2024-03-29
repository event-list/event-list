import { MerchantModel, sendToDiscord } from '@event-list/modules';
import { config } from '@event-list/shared';
import type { GraphQLContext } from '@event-list/types';

import type { UserDocument } from '../UserModel';
import UserModel from '../UserModel';

type HandleCreateUserPayload = {
  email: string;
  name: string;
  password: string;
};

type HandleCreateUserArgs = {
  payload: HandleCreateUserPayload;
  context: GraphQLContext;
};

async function validateAndSanitizeCreateUser({ payload, context }: HandleCreateUserArgs) {
  const { t } = context;
  const { email, name, password } = payload;

  if (!email) {
    return {
      error: t('Email is required'),
      ...payload,
    };
  }

  if (!name) {
    return {
      error: t('Name is required'),
      ...payload,
    };
  }

  if (!password) {
    return {
      error: t('Password is required'),
      ...payload,
    };
  }

  const userExistent = await UserModel.findOne({
    email: email.trim(),
    removedAt: null,
  });

  const merchantExistent = await MerchantModel.findOne({
    email: email.trim(),
    removedAt: null,
  });

  if (userExistent || merchantExistent) {
    return {
      error: t('Email already in use'),
      ...payload,
    };
  }

  return {
    error: null,
    email,
    password,
    name,
  };
}

const handleCreateUser = async ({
  payload,
  context,
}: HandleCreateUserArgs): Promise<{ error?: null; user: UserDocument } | { error: string; user?: null }> => {
  const {
    email,
    name,
    password,
    error: errorUserValidatePayload,
  } = await validateAndSanitizeCreateUser({ payload, context });

  if (errorUserValidatePayload) {
    return {
      error: errorUserValidatePayload,
    };
  }

  const data = {
    email,
    password,
    name,
  };

  const user = await new UserModel(data).save();

  if (config.EVENT_LIST_ENV === 'production') {
    const { password, ...rest } = data;

    await sendToDiscord({
      url: config.DISCORD_ENTRIES_WEBHOOK,
      content: `**new user** - ${JSON.stringify(rest)}`,
    });
  }

  return {
    error: null,
    user,
  };
};

export { validateAndSanitizeCreateUser, handleCreateUser };
