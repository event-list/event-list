import moment from 'moment';

import type { HandleCreateEventArgs } from './handleCreateEvent';

async function validateAndSanitizeCreateEvent({ payload, context }: HandleCreateEventArgs) {
  const { t } = context;
  const { title, place, listAvailableAt, flyer, description, dateStart, dateEnd, classification, batches } = payload;

  if (!title) {
    return {
      ...payload,
      error: t('Title is required'),
    };
  }

  if (!place) {
    return {
      ...payload,
      error: t('Place is required'),
    };
  }

  if (!listAvailableAt) {
    return {
      ...payload,
      error: t('List available at is required'),
    };
  }

  if (!flyer) {
    return {
      ...payload,
      error: t('Fyler is required'),
    };
  }

  if (!description) {
    return {
      ...payload,
      error: t('Description is required'),
    };
  }

  if (!dateStart) {
    return {
      ...payload,
      error: t('Date start is required'),
    };
  }

  if (!dateEnd) {
    return {
      ...payload,
      error: t('Date end is required'),
    };
  }

  if (!classification) {
    return {
      ...payload,
      error: t('Classification is required'),
    };
  }

  if (!batches) {
    return {
      ...payload,
      error: t('Batches is required'),
    };
  }

  const dateStartMoment = moment(dateStart.toLocaleString(), 'YYYY-MM-DDTHH:mm');
  const dateEndMoment = moment(dateEnd.toLocaleString(), 'YYYY-MM-DDTHH:mm');
  const listAvailableAtMoment = moment(listAvailableAt.toLocaleString(), 'YYYY-MM-DDTHH:mm');

  if (
    dateEndMoment.isSameOrBefore(moment()) ||
    dateStartMoment.isSameOrBefore(moment()) ||
    listAvailableAtMoment.isSameOrBefore(moment())
  ) {
    return {
      ...payload,
      error: t('One of the dates is less than or equal to the current date'),
    };
  }

  if (!batches.some((batch) => moment(batch.date.toLocaleString(), 'YYYY-MM-DDTHH:mm').isSame(dateEndMoment))) {
    return {
      ...payload,
      error: t('At least one batch must have a date equal to the event end date'),
    };
  }

  if (batches.some((batch) => moment(batch.date.toLocaleString(), 'YYYY-MM-DDTHH:mm') > dateEndMoment)) {
    return {
      ...payload,
      error: t('Event date batch cannot be greater than event end date'),
    };
  }

  if (dateEndMoment.isSameOrBefore(dateStartMoment)) {
    return {
      ...payload,
      error: t('Event start date cannot be greater than or equal event end date'),
    };
  }

  if (listAvailableAtMoment.isSameOrAfter(dateEndMoment)) {
    return {
      ...payload,
      error: t('List available at cannot be greater than or equal event end date'),
    };
  }

  if (listAvailableAtMoment.isSameOrBefore(dateStartMoment)) {
    return {
      ...payload,
      error: t('List available at cannot be less than or equal event start date'),
    };
  }

  return {
    ...payload,
    error: null,
  };
}

export { validateAndSanitizeCreateEvent };
