interface Dataloaders {
  EventLoader: ReturnType<typeof import('../event/EventLoader').getLoader>
  UserLoader: ReturnType<typeof import('../user/UserLoader').getLoader>
}
type Loaders = { [Name in keyof Dataloaders]: () => Dataloaders[Name] } | Record<string, () => unknown>

export const loaders: Loaders = {}

export const registerLoader = <Name extends keyof Dataloaders>(key: Name, getLoader: () => Dataloaders[Name]) => {
  loaders[key] = getLoader
}

export type { Dataloaders }
