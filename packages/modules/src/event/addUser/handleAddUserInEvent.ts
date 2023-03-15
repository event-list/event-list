import type { EventDocument } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

type HandleAddUserPayload = {
  event: EventDocument;
  name: string;
  role: string;
  overwrite?: boolean;
};

type HandleAddUserArgs = {
  payload: HandleAddUserPayload;
  context: GraphQLContext;
};

async function validateAndSanitizeAddUserInEvent({ payload, context }: HandleAddUserArgs) {
  const { t } = context;
  const { name, role, event, overwrite } = payload;

  if (!event) {
    return {
      error: t('Event not found'),
      ...payload,
    };
  }

  if (!name) {
    return {
      error: t('Name is required'),
      ...payload,
    };
  }

  const nameSanitize = event.capitilizeName(name).trim();

  if (!role) {
    return {
      error: t('Role is required'),
      ...payload,
    };
  }

  const roleExists = event.prices.some((price) => price.title === role);

  if (!roleExists) {
    return {
      error: t('Role not exists'),
      ...payload,
    };
  }

  if (!event.status) {
    return {
      error: t('This event is not available'),
      ...payload,
    };
  }

  if (!event.eventIsPublished())
    return {
      error: t('Your event is not published, please share a new event'),
      ...payload,
    };

  if (!overwrite) {
    const userExistentInEvent = event.findUserInEvent(nameSanitize);

    if (userExistentInEvent) {
      return {
        error: t(`'${nameSanitize}' is already on the list`),
        ...payload,
      };
    }
  }

  return {
    error: null,
    name: nameSanitize,
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

  if (!event) {
    return {
      error: t('Event not found'),
    };
  }

  if (payload.overwrite) {
    event.removeUserFromEvent(name);
  }

  event.users.push({ name, role });

  return {
    success: t('Presence successfully ensured'),
    error: null,
  };
};

export { validateAndSanitizeAddUserInEvent, handleAddUserInEvent };
