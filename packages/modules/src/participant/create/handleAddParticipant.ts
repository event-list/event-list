import type { EventDocument, ParticipantDocument } from '@event-list/modules';
import { ParticipantModel } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { validateAndSanitizeAddParticipant } from './validateAndSanitizeAddParticipant';

type HandleAddParticipantPayload = {
  name: string;
  event: EventDocument;
  batch: string;
  overwrite?: boolean;
};

type HandleAddParticipantArgs = {
  payload: HandleAddParticipantPayload;
  context: GraphQLContext;
};

type HandleAddParticipantR = Promise<{
  error: string | null;
  success: string | null;
  participant: ParticipantDocument | null;
  isNewParticipant: boolean | null;
}>;

const handleAddParticipant = async ({ payload, context }: HandleAddParticipantArgs): HandleAddParticipantR => {
  const { t } = context;
  const {
    name,
    event,
    batch,
    error: errorParticipantValidatePayload,
  } = await validateAndSanitizeAddParticipant({ payload, context });

  if (errorParticipantValidatePayload) {
    return {
      success: null,
      participant: null,
      isNewParticipant: null,
      error: errorParticipantValidatePayload,
    };
  }

  const existentParticipant = await ParticipantModel.findOne({ name });

  if (!existentParticipant) {
    const participant = await new ParticipantModel({
      name,
      event: event._id,
      batch,
    }).save();

    return {
      error: null,
      isNewParticipant: true,
      success: t('Participant successfully created'),
      participant,
    };
  }

  if (payload.overwrite) {
    const updatedParticipant = await ParticipantModel.findOneAndUpdate(
      { _id: existentParticipant._id },
      { name, event, batch },
      { new: true },
    );

    if (!updatedParticipant) {
      return {
        success: null,
        participant: null,
        isNewParticipant: null,
        error: t('Error on update existent participant'),
      };
    }

    return {
      error: null,
      isNewParticipant: false,
      success: t('Participant successfully added'),
      participant: updatedParticipant,
    };
  }

  return {
    success: null,
    participant: null,
    isNewParticipant: false,
    error: t('Participant already going to this event'),
  };
};

export type { HandleAddParticipantArgs };
export { handleAddParticipant };
