import { Schema } from 'mongoose';
import type { Date as DateMongoose } from 'mongoose';

type IBatch = {
  title: string;
  value: string;
  visible?: boolean;
  date: DateMongoose;
};

const BatchSchema = new Schema<IBatch>({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export type { IBatch };
export { BatchSchema };
