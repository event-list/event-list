import { isCNPJ } from 'brazilian-values';

import type { ITaxID, MerchantDocument } from '@event-list/modules';
import { MerchantModel } from '@event-list/modules';

import UserModel from '../../user/UserModel';

type HandleCreateMerchantPayload = {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  cnpj: ITaxID;
};

type HandleCreateMerchantArgs = {
  payload: HandleCreateMerchantPayload;
  context: Record<string, unknown>;
};

async function validateAndSanitizeCreateMerchant({ payload, context }: HandleCreateMerchantArgs) {
  const { t } = context;
  const { email, name, password, phoneNumber, cnpj } = payload;

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

  if (!phoneNumber) {
    return {
      error: t('Password is required'),
      ...payload,
    };
  }

  if (!cnpj.taxID) {
    return {
      error: t('Cnpj is required'),
      ...payload,
    };
  }

  if (!isCNPJ(cnpj.taxID)) {
    return {
      error: t('Cnpj is required'),
      ...payload,
    };
  }

  const merchantExistent = await MerchantModel.findOne({
    email: email.trim().toLowerCase(),
    removedAt: null,
  });

  const userExistent = await UserModel.findOne({
    email: email.trim().toLowerCase(),
    removedAt: null,
  });

  const merchantCnpjExistent = await MerchantModel.findOne({
    taxID: { taxID: cnpj.taxID, type: cnpj.type },
    removedAt: null,
  });

  if (merchantExistent || userExistent) {
    return {
      error: t('Email already in use'),
      ...payload,
    };
  }

  if (merchantCnpjExistent) {
    return {
      error: t('Merchant already in use'),
      ...payload,
    };
  }

  return {
    error: null,
    email,
    password,
    name,
    phoneNumber,
    cnpj,
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
    cnpj,
    error: errorMerchantValidatePayload,
  } = await validateAndSanitizeCreateMerchant({ payload, context });

  if (errorMerchantValidatePayload) {
    return {
      error: errorMerchantValidatePayload,
    };
  }

  const merchant = await new MerchantModel({
    email,
    password,
    name,
    phoneNumber,
    taxID: cnpj,
  }).save();

  return {
    error: null,
    merchant,
  };
};

export { validateAndSanitizeCreateMerchant, handleCreateMerchant };
