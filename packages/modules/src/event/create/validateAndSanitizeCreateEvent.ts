import moment from 'moment';

import type { HandleCreateEventArgs } from './handleCreateEvent';

async function validateAndSanitizeCreateEvent({ payload, context }: HandleCreateEventArgs) {
  const { t } = context;
  const { title, place, listAvailableAt, flyer, description, dateStart, dateEnd, classification, batches } = payload;

  const data = {
    title,
    place,
    listAvailableAt,
    flyer,
    description,
    dateStart,
    dateEnd,
    classification,
    batches,
  };

  if (!title) {
    return {
      ...data,
      error: t('Title is required'),
    };
  }

  if (!place) {
    return {
      ...data,
      error: t('Place is required'),
    };
  }

  if (!listAvailableAt) {
    return {
      ...data,
      error: t('List available at is required'),
    };
  }

  if (!flyer) {
    return {
      ...data,
      error: t('Fyler is required'),
    };
  }

  if (!description) {
    return {
      ...data,
      error: t('Description is required'),
    };
  }

  if (!dateStart) {
    return {
      ...data,
      error: t('Date start is required'),
    };
  }

  if (!dateEnd) {
    return {
      ...data,
      error: t('Date end is required'),
    };
  }

  if (!classification) {
    return {
      ...data,
      error: t('Classification is required'),
    };
  }

  if (!batches) {
    return {
      ...data,
      error: t('Batches is required'),
    };
  }

  console.log('date end', dateEnd);

  const dateStartMoment = moment(dateStart.toLocaleString(), 'YYYY-MM-DDTHH:mm');
  const dateEndMoment = moment(dateEnd.toLocaleString(), 'YYYY-MM-DDTHH:mm');
  const listAvailableAtMoment = moment(listAvailableAt.toLocaleString(), 'YYYY-MM-DDTHH:mm');

  if (
    dateEndMoment.isSameOrBefore(moment()) ||
    dateStartMoment.isSameOrBefore(moment()) ||
    listAvailableAtMoment.isSameOrBefore(moment())
  ) {
    return {
      ...data,
      error: t('One of the dates is less than or equal to the current date'),
    };
  }

  if (!batches.some((batch) => moment(batch.date.toLocaleString(), 'YYYY-MM-DDTHH:mm').isSame(dateEndMoment))) {
    return {
      ...data,
      error: t('At least one batch must have a date equal to the event end date'),
    };
  }

  if (batches.some((batch) => moment(batch.date.toLocaleString(), 'YYYY-MM-DDTHH:mm') > dateEndMoment)) {
    return {
      ...data,
      error: t('Event date batch cannot be greater than event end date'),
    };
  }

  if (dateEndMoment.isSameOrBefore(dateStartMoment)) {
    return {
      ...data,
      error: t('Event start date cannot be greater than or equal event end date'),
    };
  }

  if (listAvailableAtMoment.isSameOrAfter(dateEndMoment)) {
    return {
      ...data,
      error: t('List available at cannot be greater than or equal event end date'),
    };
  }

  if (listAvailableAtMoment.isSameOrBefore(dateStartMoment)) {
    return {
      ...data,
      error: t('List available at cannot be less than or equal event start date'),
    };
  }

  return {
    ...data,
    error: null,
  };
}

export { validateAndSanitizeCreateEvent };
