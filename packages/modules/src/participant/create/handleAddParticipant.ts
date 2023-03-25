import type { EventDocument, ParticipantDocument } from '@event-list/modules';
import { ParticipantModel } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

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

async function validateAndSanitizeAddParticipant({ payload, context }: HandleAddParticipantArgs) {
  const { t } = context;
  const { name, event, batch } = payload;

  if (!name) {
    return {
      error: t('Name is required'),
      ...payload,
    };
  }

  if (!event) {
    return {
      error: t('Event is required'),
      ...payload,
    };
  }

  if (!batch) {
    return {
      error: t('Batch is required'),
      ...payload,
    };
  }

  const nameSanitized = (name.charAt(0).toUpperCase() + name.slice(1)).trim();

  const eventBatch = event.batches.find((eventBatch) => eventBatch.title === batch);

  if (!eventBatch) {
    return {
      error: t('Batch not found'),
      ...payload,
    };
  }

  if (!event.status || !event.isPublished(event.dateEnd)) {
    return {
      error: t('This event is not available'),
      ...payload,
    };
  }

  return {
    error: null,
    name: nameSanitized,
    event,
    batch: eventBatch,
  };
}

const handleAddParticipant = async ({
  payload,
  context,
}: HandleAddParticipantArgs): Promise<
  | {
      error?: null;
      success: string;
      participant: ParticipantDocument;
      isNewParticipant: boolean;
    }
  | {
      error: string;
      success?: null;
      participant?: null;
      isNewParticipant?: null;
    }
> => {
  const { t } = context;
  const {
    name,
    event,
    batch,
    error: errorParticipantValidatePayload,
  } = await validateAndSanitizeAddParticipant({ payload, context });

  if (errorParticipantValidatePayload) {
    return {
      error: errorParticipantValidatePayload,
    };
  }

  const existentParticipant = await ParticipantModel.findOne({ name });

  if (existentParticipant) {
    if (payload.overwrite) {
      const updatedParticipant = await ParticipantModel.findOneAndUpdate(
        { _id: existentParticipant._id },
        { name, event, batch },
      );

      if (!updatedParticipant) {
        return {
          error: t('Error on update existent participant'),
        };
      }

      return {
        error: null,
        isNewParticipant: false,
        success: t('Participant successfully added'),
        participant: existentParticipant,
      };
    }

    return {
      error: t('Participant already goingo to this event'),
    };
  }

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
};

export { validateAndSanitizeAddParticipant, handleAddParticipant };
