import type { Document, Types, Date as DateMongoose } from 'mongoose';
import mongoose, { model, Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

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
  price: string;
  status: boolean;
  users: {
    mas: string[];
    fem: string[];
    free: string[];
  };
  createdAt: DateMongoose;
  updatedAt: DateMongoose;
  findUserInEvent: (name: string, role?: string | null) => boolean;
  removeUserFromAllRoles: (name: string) => void;
  eventIsPublished: () => boolean;
  capitilizeName: (str: string) => string;
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

  eventIsPublished() {
    return this.dateEnd > new Date();
  },

  capitilizeName(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

const EventModel = model<EventDocument>('Event', EventSchema);

export type { EventDocument };
export default EventModel;
