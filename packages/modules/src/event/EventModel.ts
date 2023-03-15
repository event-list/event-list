import type { Document, Types, Date as DateMongoose } from 'mongoose';
import mongoose, { model, Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

type EventPrice = { title: string; value: string; date: DateMongoose };
type EventUsers = { name: string; role: string };

type IEvent = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  flyer: string;
  label: Types.ObjectId;
  place: string;
  dateStart: DateMongoose;
  dateEnd: DateMongoose;
  listAvailableAt: DateMongoose;
  classification: string;
  prices: EventPrice[];
  status: boolean;
  users: EventUsers[];
  createdAt: DateMongoose;
  updatedAt: DateMongoose;
  findUserInEvent: (name: string) => boolean;
  removeUserFromEvent: (name: string) => void;
  eventIsPublished: () => boolean;
  capitilizeName: (str: string) => string;
  getCurrentPrice: () => EventPrice;
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
    label: {
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
    prices: [
      {
        title: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
    status: {
      type: Boolean,
      required: true,
    },
    users: [
      {
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
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
  findUserInEvent(name) {
    return this.users.some((user) => user.name === name);
  },

  removeUserFromEvent(name) {
    const data = this.users.find((user) => user.name === name);
    if (data) {
      const index = this.users.indexOf(data);
      this.users.splice(index, 1);
    }
  },

  eventIsPublished() {
    return this.dateEnd > new Date();
  },

  capitilizeName(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  getCurrentPrice() {
    return this.prices.find((price) => new Date() < price.date);
  },
};

const EventModel = model<EventDocument>('Event', EventSchema);

export type { EventDocument };
export default EventModel;
