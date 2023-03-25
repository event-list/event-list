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

const handleAddParticipantInEvent = async ({
  payload,
  context,
}: HandleAddParticipantArgs): Promise<{ error?: null; success: string } | { error: string; success?: null }> => {
  const { t } = context;
  const {
    participant,
    event,
    error: errorParticipantValidatePayload,
  } = await validateAndSanitizeAddParticipantInEvent({ payload, context });

  if (errorParticipantValidatePayload) {
    return {
      error: errorParticipantValidatePayload,
    };
  }

  const updatedEvent = await EventModel.updateOne({ _id: event._id }, { $push: { participants: participant._id } });

  if (!updatedEvent) {
    return {
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
