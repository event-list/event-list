import type { EventDocument } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

type HandleAddUserPayload = {
  event: EventDocument;
  name: string;
  role: 'mas' | 'fem' | 'free';
  overwrite?: boolean;
};

type HandleAddUserArgs = {
  payload: HandleAddUserPayload;
  context: GraphQLContext;
};

async function validateAndSanitizeAddUserInEvent({ payload, context }: HandleAddUserArgs) {
  const { t } = context;
  const { name, role, event, overwrite } = payload;

  if (!name) {
    return {
      error: t('Name is required'),
      ...payload,
    };
  }

  if (!role) {
    return {
      error: t('Type is required'),
      ...payload,
    };
  }

  const userExistentInEvent = event.findUserInEvent(name, overwrite ? role : null);

  if (!event.status) {
    return {
      error: t('This event is not available'),
      ...payload,
    };
  }

  if (userExistentInEvent) {
    return {
      error: t(`'${name}' is already on the list`),
      ...payload,
    };
  }

  return {
    error: null,
    name,
    event,
    role,
  };
}

const handleAddUserInEvent = async ({
  payload,
  context,
}: HandleAddUserArgs): Promise<{ error?: null; success: string } | { error: string; success?: null }> => {
  const { t } = context;
  const {
    name,
    role,
    event,
    error: errorUserValidatePayload,
  } = await validateAndSanitizeAddUserInEvent({ payload, context });

  if (errorUserValidatePayload) {
    return {
      error: errorUserValidatePayload,
    };
  }

  if (payload.overwrite) {
    event.removeUserFromAllRoles(name);
  }

  event.users[role].push(name);
  await event.save();

  return {
    success: t('Presence successfully ensured'),
    error: null,
  };
};

export { validateAndSanitizeAddUserInEvent, handleAddUserInEvent };
