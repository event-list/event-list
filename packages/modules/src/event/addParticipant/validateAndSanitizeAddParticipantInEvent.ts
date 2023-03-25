import type { HandleAddParticipantArgs } from './handleAddParticipantInEvent';

type Payload = HandleAddParticipantArgs['payload'];

type ValidateAndSanitizeAddParticipantInEventR = Promise<{
  event: Payload['event'];
  participant: Payload['participant'];
  error: string | null;
}>;

async function validateAndSanitizeAddParticipantInEvent({
  payload,
  context,
}: HandleAddParticipantArgs): ValidateAndSanitizeAddParticipantInEventR {
  const { t } = context;
  const { event, participant } = payload;

  if (!event) {
    return {
      participant,
      event,
      error: t('Event is required'),
    };
  }

  if (!participant) {
    return {
      participant,
      event,
      error: t('Participant is required'),
    };
  }

  return {
    event,
    participant,
    error: null,
  };
}

export { validateAndSanitizeAddParticipantInEvent };
