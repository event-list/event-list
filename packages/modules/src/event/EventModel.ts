import type { Document, Types, Date as DateMongoose } from 'mongoose';
import mongoose, { model, Schema } from 'mongoose';

import type { IBatch } from '../batch/BatchSchema';
import { BatchSchema } from '../batch/BatchSchema';

const { ObjectId } = mongoose.Schema.Types;

type IEvent = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  flyer: string;
  merchant: Types.ObjectId;
  place: string;
  dateStart: DateMongoose;
  dateEnd: DateMongoose;
  listAvailableAt: DateMongoose;
  classification: string;
  batches: IBatch[];
  status: boolean;
  participants: Types.ObjectId[];
  createdAt: DateMongoose;
  updatedAt: DateMongoose;
  eventIsPublished: (date: DateMongoose) => boolean;
  getCurrentBatch: (batches: IBatch[]) => IBatch;
};

type EventDocument = Document & IEvent;

const EventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    flyer: {
      type: String,
      required: true,
    },
    merchant: {
      type: ObjectId,
      ref: 'Merchant',
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    listAvailableAt: {
      type: Date,
      required: true,
    },
    classification: {
      type: String,
      required: true,
    },
    batches: {
      type: [BatchSchema],
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    participants: [
      {
        type: ObjectId,
        ref: 'Participant',
        required: false,
      },
    ],
  },
  {
    collection: 'Event',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

EventSchema.methods = {
  eventIsPublished(dateEnd) {
    return dateEnd > new Date();
  },

  getCurrentBatch(batches) {
    return batches.find((batch) => new Date() < batch.date);
  },
};

const EventModel = model<EventDocument>('Event', EventSchema);

export type { EventDocument };
export default EventModel;
