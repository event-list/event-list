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
    event,
    participant,
    error: null,
  };
}

export { validateAndSanitizeAddParticipantInEvent };
