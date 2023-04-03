import type { MerchantDocument } from '@event-list/modules';
import { MerchantModel, sendToDiscord } from '@event-list/modules';
import { config } from '@event-list/shared';
import type { GraphQLContext } from '@event-list/types';

import UserModel from '../../user/UserModel';

type HandleCreateMerchantPayload = {
  email: string;
  name: string;
  description: string;
  logo: string;
  password: string;
  phoneNumber: string;
  // cnpj: ITaxID;
};

type HandleCreateMerchantArgs = {
  payload: HandleCreateMerchantPayload;
  context: GraphQLContext;
};

async function validateAndSanitizeCreateMerchant({ payload, context }: HandleCreateMerchantArgs) {
  const { t } = context;
  const { email, name, password, phoneNumber, description, logo } = payload;

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

  if (!description) {
    return {
      error: t('Description is required'),
      ...payload,
    };
  }

  if (!logo) {
    return {
      error: t('Logo is required'),
      ...payload,
    };
  }

  if (!password) {
    return {
      error: t('Password is required'),
      ...payload,
    };
  }

  if (!phoneNumber) {
    return {
      error: t('Password is required'),
      ...payload,
    };
  }

  const emailMerchantExistent = await MerchantModel.findOne({
    email: email.trim(),
    removedAt: null,
  });

  const emailUserExistent = await UserModel.findOne({
    email: email.trim(),
    removedAt: null,
  });

  const numberMerchantExistent = await MerchantModel.findOne({
    phoneNumber,
    removedAt: null,
  });

  const nameMerchantExistent = await MerchantModel.findOne({
    name,
    removedAt: null,
  });

  if (emailMerchantExistent || emailUserExistent) {
    return {
      error: t('Email already in use'),
      ...payload,
    };
  }

  if (numberMerchantExistent) {
    return {
      error: t('Phone number already in use'),
      ...payload,
    };
  }

  if (nameMerchantExistent) {
    return {
      error: t('Name number already in use'),
      ...payload,
    };
  }

  // if (!cnpj.taxID) {
  //   return {
  //     error: t('Cnpj is required'),
  //     ...payload,
  //   };
  // }
  //
  // if (!isCNPJ(cnpj.taxID)) {
  //   return {
  //     error: t('Cnpj is required'),
  //     ...payload,
  //   };
  // }

  // const merchantCnpjExistent = await MerchantModel.findOne({
  //   taxID: { taxID: cnpj.taxID, type: cnpj.type },
  //   removedAt: null,
  // });

  // if (merchantCnpjExistent) {
  //   return {
  //     error: t('Merchant already in use'),
  //     ...payload,
  //   };
  // }

  return {
    error: null,
    email,
    description,
    logo,
    password,
    name,
    phoneNumber,
  };
}

const handleCreateMerchant = async ({
  payload,
  context,
}: HandleCreateMerchantArgs): Promise<
  { error?: null; merchant: MerchantDocument } | { error: string; merchant?: null }
> => {
  const {
    email,
    name,
    password,
    phoneNumber,
    description,
    logo,
    error: errorMerchantValidatePayload,
  } = await validateAndSanitizeCreateMerchant({ payload, context });

  if (errorMerchantValidatePayload) {
    return {
      error: errorMerchantValidatePayload,
    };
  }

  const data = {
    email,
    password,
    name,
    description,
    logo,
    phoneNumber,
  };

  const merchant = await new MerchantModel(data).save();

  if (config.EVENT_LIST_ENV === 'production') {
    await sendToDiscord({
      url: config.DISCORD_ENTRIES_WEBHOOK,
      content: `**new merchant** - ${JSON.stringify(data)}`,
    });
  }

  return {
    error: null,
    merchant,
  };
};

export { validateAndSanitizeCreateMerchant, handleCreateMerchant };
