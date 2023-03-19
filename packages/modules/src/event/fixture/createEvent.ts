import type { Types } from 'mongoose';

import EventModel from '../EventModel';

type CreateEventPayload = {
  title: string;
  description: string;
  place: string;
  flyer: string;
  merchant: Types.ObjectId;
  status?: boolean;
  dateStart: Date;
  dateEnd: Date;
  listAvailableAt: Date;
  classification: string;
  prices: { title: string; value: string; visible?: boolean; date: Date }[];
  users: { name: string; role: string }[];
};

const createEvent = async (payload: CreateEventPayload) => {
  if (!payload.status) {
    payload['status'] = true;
  }

  return new EventModel(payload).save();
};

export { createEvent };
export type { CreateEventPayload };
