import type { Document, Types } from 'mongoose';
import mongoose, { Date, model, Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

type IEvent = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  flyer: string;
  label: Types.ObjectId;
  place: string;
  date: Date;
  eventOpenAt: string;
  eventEndAt: string;
  listAvailableAt: string;
  classification: string;
  price: string;
  status: boolean;
  users: {
    mas: string[];
    fem: string[];
    free: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  findUserInEvent: (name: string, role?: string) => boolean;
  removeUserFromAllRoles: (name: string) => void;
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
    status: {
      type: Boolean,
      required: true,
    },
    users: {
      mas: [
        {
          type: String,
        },
      ],
      fem: [
        {
          type: String,
        },
      ],
      free: [
        {
          type: String,
        },
      ],
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

EventSchema.methods = {
  findUserInEvent(name, role) {
    if (role) {
      return this.users[role].includes(name);
    }
    return Object.keys(this.users).filter((key) => this.users[key].includes(name)).length > 0;
  },

  removeUserFromAllRoles(name) {
    Object.keys(this.users).map((key) => {
      this.users[key] = this.users[key].filter((currentName) => currentName !== name);
    });
  },
};

const EventModel = model<EventDocument>('Event', EventSchema);

export type { EventDocument };
export default EventModel;
