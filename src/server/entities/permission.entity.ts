import { Column } from 'typeorm'
import { Entity } from '../common/entity'


@Entity('permissions', { schema: 'jq' })
export class PermissionEntity {
  @Column('smallint', { primary: true, name: 'id_group', default: () => '\'0\'' })
  idGroup: number = 0

  @Column('varchar', {
    primary: true,
    name: 'permission',
    length: 30,
    default: () => '\'\'',
  })
  permission: string = ''

  @Column('tinyint', { name: 'add_deny', default: () => '\'1\'' })
  addDeny: number = 1
}
