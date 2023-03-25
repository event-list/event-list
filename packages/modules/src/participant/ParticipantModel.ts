import { ObjectId } from 'mongodb';
import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { IBatch } from '../batch/BatchSchema';
import { BatchSchema } from '../batch/BatchSchema';
import type { EventDocument } from '../event/EventModel';

type IParticipant = {
  _id: Types.ObjectId;
  name: string;
  event: EventDocument['_id'];
  batch: IBatch;
};

type ParticipantDocument = Document & IParticipant;

const ParticipantSchema = new Schema<ParticipantDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    event: {
      type: ObjectId,
      ref: 'Event',
      required: true,
    },
    batch: {
      type: BatchSchema,
      required: true,
    },
  },
  {
    collection: 'Participant',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

ParticipantSchema.methods = {};

const ParticipantModel = model<ParticipantDocument>('Participant', ParticipantSchema);

export type { ParticipantDocument };
export default ParticipantModel;
