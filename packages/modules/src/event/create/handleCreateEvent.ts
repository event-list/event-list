import type { Date } from 'mongoose';

import { EventModel } from '@event-list/modules';
import type { IBatch, MerchantDocument, EventDocument } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { validateAndSanitizeCreateEvent } from './validateAndSanitizeCreateEvent';

type HandleCreateEventPayload = {
  title: string;
  description: string;
  place: string;
  flyer: string;
  dateStart: Date;
  dateEnd: Date;
  listAvailableAt: Date;
  classification: string;
  batches: IBatch[];
  merchantId: MerchantDocument['_id'];
};

type HandleCreateEventArgs = {
  payload: HandleCreateEventPayload;
  context: GraphQLContext;
};

type HandleCreateEventR = Promise<{
  error: string | null;
  success: string | null;
  event: EventDocument | null;
}>;

const handleCreateEvent = async ({ payload, context }: HandleCreateEventArgs): HandleCreateEventR => {
  const { t } = context;
  const data = await validateAndSanitizeCreateEvent({ payload, context });

  const { error: errorEventValidatePayload, ...restData } = data;

  if (errorEventValidatePayload) {
    return {
      success: null,
      event: null,
      error: errorEventValidatePayload,
    };
  }

  const event = await new EventModel({
    ...restData,
    status: true,
    merchant: payload.merchantId,
  }).save();

  if (!event) {
    return {
      event: null,
      success: null,
      error: t('Something went wrong'),
    };
  }

  return {
    event: event._id,
    success: t('Event successfully created'),
    error: null,
  };
};

export type { HandleCreateEventArgs };
export { handleCreateEvent };
