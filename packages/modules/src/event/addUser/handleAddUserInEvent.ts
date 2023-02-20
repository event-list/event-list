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
  const { name, role, event } = payload;

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

  const userExistentInEvent = event.findUserInEvent(name, role);

  if (userExistentInEvent) {
    return {
      error: t(`${name} already going to this event as ${role} role`),
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
