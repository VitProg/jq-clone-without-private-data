import { Column, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Entity } from '../common/entity'


@Index('min_posts', ['minPosts'], {})
@Entity('membergroups', { schema: 'jq' })
export class MemberGroupEntity {
  @PrimaryGeneratedColumn({
    type: 'smallint',
    name: 'id_group',
    unsigned: true,
  })
  idGroup: number = 0

  @Column('varchar', { name: 'group_name', length: 80, default: () => '\'\'' })
  groupName: string = ''

  @Column('text', { name: 'description' })
  description: string = ''

  @Column('varchar', { name: 'online_color', length: 20, default: () => '\'\'' })
  onlineColor: string = ''

  @Column('mediumint', { name: 'min_posts', default: () => '\'-1\'' })
  minPosts: number = -1

  @Column('smallint', {
    name: 'max_messages',
    unsigned: true,
    default: () => '\'0\'',
  })
  maxMessages: number = 0

  @Column('varchar', { name: 'stars', length: 255, default: () => '\'\'' })
  stars: string = ''

  @Column('tinyint', { name: 'group_type', default: () => '\'0\'' })
  groupType: number = 0

  @Column('tinyint', { name: 'hidden', default: () => '\'0\'' })
  hidden: number = 0

  @Column('smallint', { name: 'id_parent', default: () => '\'-2\'' })
  idParent: number = -2
}
