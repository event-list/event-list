import type { Document, Types } from 'mongoose';
import mongoose, { Date, model, Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

type IEvent = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  slug: string;
  flyer: string;
  label: Types.ObjectId;
  place: string;
  published: boolean;
  date: Date;
  eventOpenAt: string;
  eventEndAt: string;
  listAvailableAt: string;
  classification: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
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
    slug: {
      type: String,
      required: true,
    },
    flyer: {
      type: String,
      required: true,
    },
    label: {
      type: ObjectId,
      ref: 'Merchant',
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    eventOpenAt: {
      type: String,
      required: true,
    },
    eventEndAt: {
      type: String,
      required: true,
    },
    listAvailableAt: {
      type: String,
      required: true,
    },
    classification: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'Event',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const EventModel = model<EventDocument>('Event', EventSchema);

export type { EventDocument };
export default EventModel;
