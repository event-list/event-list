import { EventModel } from '@event-list/modules';
import type { EventDocument, ParticipantDocument } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { validateAndSanitizeAddParticipantInEvent } from './validateAndSanitizeAddParticipantInEvent';

type HandleAddParticipantPayload = {
  event: EventDocument;
  participant: ParticipantDocument;
};

type HandleAddParticipantArgs = {
  payload: HandleAddParticipantPayload;
  context: GraphQLContext;
};

type HandleAddParticipantR = Promise<{
  success: string | null;
  error: string | null;
}>;

const handleAddParticipantInEvent = async ({ payload, context }: HandleAddParticipantArgs): HandleAddParticipantR => {
  const { t } = context;
  const {
    participant,
    event,
    error: errorParticipantValidatePayload,
  } = await validateAndSanitizeAddParticipantInEvent({ payload, context });

  if (errorParticipantValidatePayload) {
    return {
      success: null,
      error: errorParticipantValidatePayload,
    };
  }

  const updatedEvent = await EventModel.updateOne({ _id: event._id }, { $push: { participants: participant._id } });

  if (!updatedEvent) {
    return {
      success: null,
      error: t('Error on update existent event'),
    };
  }

  return {
    success: t('Event successfully updated'),
    error: null,
  };
};

export type { HandleAddParticipantArgs };
export { handleAddParticipantInEvent };
