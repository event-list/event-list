import { EventModel } from '@event-list/modules';
import type { EventDocument, ParticipantDocument } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

type HandleAddParticipantPayload = {
  event: EventDocument;
  participant: ParticipantDocument;
};

type HandleAddParticipantArgs = {
  payload: HandleAddParticipantPayload;
  context: GraphQLContext;
};

async function validateAndSanitizeAddParticipantInEvent({ payload, context }: HandleAddParticipantArgs) {
  const { t } = context;
  const { event, participant } = payload;

  if (!event) {
    return {
      error: t('Event is required'),
      ...payload,
    };
  }

  if (!participant) {
    return {
      error: t('Participant is required'),
      ...payload,
    };
  }

  return {
    error: null,
    participant,
    event,
  };
}

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
    success: t('Presence successfully ensured'),
    error: null,
  };
};

export { validateAndSanitizeAddParticipantInEvent, handleAddParticipantInEvent };
