import { Entity as OrigEntity, EntityOptions } from 'typeorm'

export const Entity = (name?: string, options?: EntityOptions) => {
  const newOptions: EntityOptions = options ? {...options} : {}
  const n = name ?? newOptions?.name;
  if (n) {
    newOptions.name = (process.env.TABLE_PREFIX ?? '') + n
  }
  return OrigEntity(newOptions)
}
