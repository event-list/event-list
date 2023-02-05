import { getLoaderRegistry } from '@event-list/graphql';
import { EventLoader, MerchantLoader } from '@event-list/modules';

const { registerLoader, getDataloaders } = getLoaderRegistry();

registerLoader('EventLoader', EventLoader.getLoader);
registerLoader('MerchantLoader', MerchantLoader.getLoader);

export { getDataloaders, registerLoader };
