import { getLoaderRegistry } from '@event-list/graphql';
import { UserLoader, EventLoader, MerchantLoader } from '@event-list/modules';

const { registerLoader, getDataloaders } = getLoaderRegistry();

registerLoader('UserLoader', UserLoader.getLoader);
registerLoader('EventLoader', EventLoader.getLoader);
registerLoader('MerchantLoader', MerchantLoader.getLoader);

export { getDataloaders, registerLoader };
