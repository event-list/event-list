import validator from 'validator'
import { fieldError } from '../fieldError'

interface NewUserArgs {
  email: string
  name: string
  password: string
  gender: string
}

function validateName(name: string) {
  return validator.isLength(name)
}

function validateGender(gender: string) {
  return gender.toLowerCase() === 'f' || gender.toLowerCase() === 'm'
}

function validateAndSanitizeNewUser(args: NewUserArgs) {
  const isEmail = validator.isEmail(args.email)

  if (!isEmail) return { error: fieldError('email', 'Invalid Email') }

  const isValidName = validateName(args.name)

  if (!isValidName) return { error: fieldError('name', 'Invalid Name') }

  const isValidGender = validateGender(args.gender)

  if (!isValidGender) return { error: fieldError('gender', 'Invalid Gender') }

  return {
    name: args.name.trim(),
    password: args.password.trim(),
    email: args.email.trim().toLowerCase(),
    gender: args.email.trim().toLowerCase()
  }
}

export type { NewUserArgs }
export { validateName, validateAndSanitizeNewUser }
