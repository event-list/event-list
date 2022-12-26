import dotenvSafe from 'dotenv-safe'
import path from 'path'

const cwd = process.cwd()

const root = path.join.bind(cwd)

dotenvSafe.config({
  path: root('.env'),
  sample: root('.env.example')
})

export const config = {
  API_PORT: process.env.PORT || 4000,
  MONGO_URL: process.env.MONGO_URL || 'mongo',
  JWT_SECRET: process.env.JWT_SECRET || ''
}