import { compareSync, hashSync } from 'bcryptjs';
import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import { taxIDFields } from '../taxid/TaxIDSchema';
import type { ITaxID } from '../taxid/TaxIDSchema';

interface IMerchant {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  encryptPassword: (password: string) => string;
  authenticate: (plainTextPassword: string) => boolean;
  taxID: ITaxID;
}

type MerchantDocument = Document & IMerchant;

const MerchantSchema = new Schema<MerchantDocument>(
  {
    name: {
      type: String,
      description: 'Merchant name',
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      hidden: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    ...taxIDFields,
  },
  {
    collection: 'Merchant',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

MerchantSchema.methods = {
  authenticate(plainTextPassword: string) {
    return compareSync(plainTextPassword, this.password);
  },

  encryptPassword(password: string) {
    return hashSync(password);
  },
};

MerchantSchema.pre('save', function encryptPasswordHook(next) {
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

const MerchantModel = model<MerchantDocument>('Merchant', MerchantSchema);

export type { MerchantDocument };
export default MerchantModel;
