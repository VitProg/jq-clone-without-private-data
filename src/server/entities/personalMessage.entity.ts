import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("id_member", ["idMemberFrom", "deletedBySender"], {})
@Index("msgtime", ["msgtime"], {})
@Index("id_pm_head", ["idPmHead"], {})
@Entity("personal_messages", { schema: "jq" })
export class PersonalMessageEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pm", unsigned: true })
  idPm: number = 0;

  @Column("int", { name: "id_pm_head", unsigned: true, default: () => "'0'" })
  idPmHead: number = 0;

  @Column("mediumint", {
    name: "id_member_from",
    unsigned: true,
    default: () => "'0'",
  })
  idMemberFrom: number = 0;

  @Column("tinyint", {
    name: "deleted_by_sender",
    unsigned: true,
    default: () => "'0'",
  })
  deletedBySender: number = 0;

  @Column("varchar", { name: "from_name", length: 255, default: () => "''" })
  fromName: string = '';

  @Column("int", { name: "msgtime", unsigned: true, default: () => "'0'" })
  msgtime: number = 0;

  @Column("varchar", { name: "subject", length: 255, default: () => "''" })
  subject: string = '';

  @Column("text", { name: "body" })
  body: string = '';
}
