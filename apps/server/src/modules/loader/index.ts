import { Dataloaders, loaders } from './loaderRegister'

const getDataloaders = (): Dataloaders =>
  (Object.keys(loaders) as (keyof Dataloaders)[]).reduce(
    (prev, loaderKey) => ({
      ...prev,
      [loaderKey]: loaders[loaderKey]()
    }),
    {}
  ) as Dataloaders

export { getDataloaders }
