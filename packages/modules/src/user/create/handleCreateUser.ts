import validator from 'validator';
import UserModel, { UserDocument } from '../UserModel';

type HandleCreateUserPayload = {
  email: string;
  name: string;
  password: string;
  gender: string;
};

type HandleCreateUserArgs = {
  payload: HandleCreateUserPayload;
  context: Record<string, unknown>;
};

function validateGender(gender: string) {
  return gender.toLowerCase() === 'f' || gender.toLowerCase() === 'm';
}

async function validateAndSanitizeCreateUser({
  payload,
  context,
}: HandleCreateUserArgs) {
  const { t } = context;
  const { email, name, password, gender } = payload;

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

  if (!gender || !validateGender(gender)) {
    return {
      error: t('Gender is required'),
      ...payload,
    };
  }

  const userExistent = await UserModel.findOne({
    email: email.trim().toLowerCase(),
    removedAt: null,
  });

  if (userExistent) {
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
    gender,
  };
}

const handleUserCreate = async ({
  payload,
  context,
}: HandleCreateUserArgs): Promise<
  { error?: null; user: UserDocument } | { error: string; user?: null }
> => {
  const {
    email,
    name,
    password,
    gender,
    error: errorUserValidatePayload,
  } = await validateAndSanitizeCreateUser({ payload, context });

  if (errorUserValidatePayload) {
    return {
      error: errorUserValidatePayload,
    };
  }

  const user = await new UserModel({
    email,
    password,
    name,
    gender,
  }).save();

  return {
    error: null,
    user,
  };
};

export type { HandleCreateUserPayload };
export { validateAndSanitizeCreateUser, handleUserCreate };
