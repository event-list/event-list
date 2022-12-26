import { createLoader } from '@entria/graphql-mongo-helpers'

import { registerLoader } from '../loader/loaderRegister'

import { EventModel } from './EventModel'

const {
  Wrapper: Event,
  getLoader,
  clearCache,
  load,
  loadAll
} = createLoader({
  model: EventModel,
  loaderName: 'EventLoader'
})

registerLoader('EventLoader', getLoader)

export { Event, getLoader, clearCache, load, loadAll }
