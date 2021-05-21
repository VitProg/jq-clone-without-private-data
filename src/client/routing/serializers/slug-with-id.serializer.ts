import { noMatch, ValueSerializer } from 'type-route'
import { User } from '../../../common/forum/models/user'
import { deserializeUrlSlugId, serializeUrlSlugId } from '../../../common/forum/utils'


export const slugWithIdSerializer: ValueSerializer<{id: number, url: string}> = {
  parse (raw: string) {
    const value = deserializeUrlSlugId(raw)
    return value ?? noMatch
  },
  stringify (value: {id: number, url: string}): string {
    return serializeUrlSlugId(value) ?? value.id + '-' + value.id
  },
}
