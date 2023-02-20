import { getObjectId } from '@entria/graphql-mongo-helpers';

import type { EventDocument, MerchantDocument } from '@event-list/modules';
import { EventModel } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

type HandleInativeEventPayload = {
  eventId: EventDocument['_id'];
  merchantId: MerchantDocument['_id'];
};

type HandleInativeEventArgs = {
  payload: HandleInativeEventPayload;
  context: GraphQLContext;
};

async function validateAndSanitizeChangeEventStatus({ payload, context }: HandleInativeEventArgs) {
  const { t } = context;
  const { eventId, merchantId } = payload;

  if (!eventId)
    return {
      error: t('Event Id is required'),
      ...payload,
    };

  const event = await EventModel.findOne({ _id: getObjectId(eventId) });

  if (!event) return { error: t('Event not found'), ...payload };

  if (event.label.toString() != merchantId.toString()) return { error: t('Unauthorized'), ...payload };

  return {
    error: null,
    event,
  };
}

const handleChangeEventStatus = async ({
  payload,
  context,
}: HandleInativeEventArgs): Promise<{ error?: null; success: string } | { error: string; success?: null }> => {
  const { t } = context;

  const { event, error: errorInativeEventPayload } = await validateAndSanitizeChangeEventStatus({ payload, context });

  if (errorInativeEventPayload) {
    return {
      error: errorInativeEventPayload,
    };
  }

  if (!event) return { error: t('Event not found') };

  event.status = !event.status;
  await event.save();

  return {
    success: t('Event successfully changed status'),
    error: null,
  };
};

export { validateAndSanitizeChangeEventStatus, handleChangeEventStatus };
