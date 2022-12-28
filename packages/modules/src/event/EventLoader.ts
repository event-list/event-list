import { createLoader } from '@entria/graphql-mongo-helpers';
import EventModel from './EventModel';

const {
  Wrapper: EventLoader,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: EventModel,
  loaderName: 'EventLoader',
});

export { getLoader, clearCache, load, loadAll };
export default EventLoader;
