import type { Types } from 'mongoose';

import ParticipantModel from '../ParticipantModel';

type CreateParticipantPayload = {
  name: string;
  batch: string;
  event: Types.ObjectId;
};

const createParticipant = async (payload: CreateParticipantPayload) => {
  return new ParticipantModel(payload).save();
};

export { createParticipant };
export type { CreateParticipantPayload };
