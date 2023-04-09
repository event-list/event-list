import { compareSync, hashSync } from 'bcryptjs';
import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

interface IMerchant {
  _id: Types.ObjectId;
  email: string;
  name: string;
  description: string;
  logo: string;
  biography: string;
  password: string;
  phoneNumber: string;
  instagramAccount: string;
  facebookAccount: string;
  twitterAccount: string;
  website: string;
  features: string[];
  hasEventPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  encryptPassword: (password: string) => string;
  authenticate: (plainTextPassword: string) => boolean;
  // taxID: ITaxID;
}

type MerchantDocument = Document & IMerchant;

const MerchantSchema = new Schema<MerchantDocument>(
  {
    name: {
      type: String,
      description: 'Merchant name',
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      hidden: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    instagramAccount: {
      type: String,
      required: false,
      index: true,
    },
    facebookAccount: {
      type: String,
      required: false,
      index: true,
    },
    twitterAccount: {
      type: String,
      required: false,
      index: true,
    },
    website: {
      type: String,
      required: false,
      index: true,
    },
    features: {
      type: [String],
      required: false,
      index: true,
    },
    hasEventPublished: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
    // ...taxIDFields,
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
