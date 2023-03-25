import type { EventDocument, MerchantDocument } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

type HandleUpdateEventPayload = {
  event: EventDocument;
  merchantId: MerchantDocument['_id'];
  title: string;
  description: string;
  flyer: string;
  place: string;
  listAvailableAt: Date;
  classification: string;
  status: boolean;
};

type HandleUpdateEventArgs = {
  payload: HandleUpdateEventPayload;
  context: GraphQLContext;
};

async function validateAndSanitizeUpdateEvent({ payload, context }: HandleUpdateEventArgs) {
  const { t } = context;
  const { event, merchantId, ...restPayload } = payload;

  if (!event.isPublished(event.dateEnd))
    return {
      error: t('Your event is not published, please share a new event'),
      payload: restPayload,
    };

  if (event.merchant.toString() != merchantId.toString()) return { error: t('Unauthorized'), payload: restPayload };

  return {
    error: null,
    event,
    payload: restPayload,
  };
}

const handleUpdateEvent = async ({
  payload,
  context,
}: HandleUpdateEventArgs): Promise<{ error?: null; success: string } | { error: string; success?: null }> => {
  const { t } = context;

  const {
    event,
    payload: payloadValidated,
    error: errorUpdateEventPayload,
  } = await validateAndSanitizeUpdateEvent({ payload, context });

  if (errorUpdateEventPayload) {
    return {
      error: errorUpdateEventPayload,
    };
  }

  if (!event) return { error: t('Event not found') };

  Object.keys(payloadValidated).forEach((key) => (event[key] = payloadValidated[key]));

  await event.save();

  return {
    success: t('Event successfully updated'),
    error: null,
  };
};

export { validateAndSanitizeUpdateEvent, handleUpdateEvent };
