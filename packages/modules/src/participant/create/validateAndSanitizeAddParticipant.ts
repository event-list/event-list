import type { HandleAddParticipantArgs } from './handleAddParticipant';

async function validateAndSanitizeAddParticipant({ payload, context }: HandleAddParticipantArgs) {
  const { t } = context;
  const { name, event, batch } = payload;

  if (!name) {
    return {
      name,
      event,
      batch,
      error: t('Name is required'),
    };
  }

  if (!event) {
    return {
      name,
      event,
      batch,
      error: t('Event is required'),
    };
  }

  if (!batch) {
    return {
      name,
      event,
      batch,
      error: t('Batch is required'),
    };
  }

  const nameSanitized = (name.charAt(0).toUpperCase() + name.slice(1)).trim();

  const eventBatch = event.batches.find((eventBatch) => eventBatch.title === batch);

  if (!eventBatch) {
    return {
      name,
      event,
      batch,
      error: t('Batch not found'),
    };
  }

  if (!event.status || !event.isPublished(event.dateEnd)) {
    return {
      name,
      event,
      batch,
      error: t('This event is not available'),
    };
  }

  return {
    error: null,
    name: nameSanitized,
    event,
    batch: eventBatch,
  };
}

export { validateAndSanitizeAddParticipant };
