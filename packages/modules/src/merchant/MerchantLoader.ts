import { createLoader } from '@entria/graphql-mongo-helpers';

import MerchantModel from './MerchantModel';

const {
  Wrapper: MerchantLoader,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: MerchantModel,
  loaderName: 'MerchantLoader',
});

export { getLoader, clearCache, load, loadAll };
export default MerchantLoader;
