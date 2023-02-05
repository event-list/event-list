export const TAXID_TYPE = {
  BR_CPF: 'BR:CPF',
  BR_CNPJ: 'BR:CNPJ',
} as const;

export interface ITaxID {
  taxID: string;
  type: (typeof TAXID_TYPE)[keyof typeof TAXID_TYPE];
}

export const taxIDFields = {
  taxID: {
    taxID: {
      type: String,
      description: 'TaxId could also be used to login in the system',
      index: true,
      unique: true,
    },
    type: {
      type: String,
      uppercase: true,
      enum: Object.values(TAXID_TYPE),
    },
  },
};
