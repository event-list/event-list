import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

type IParticipant = {
  _id: Types.ObjectId;
  name: string;
  batch: string;
};

type ParticipantDocument = Document & IParticipant;

const ParticipantSchema = new Schema<ParticipantDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
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
