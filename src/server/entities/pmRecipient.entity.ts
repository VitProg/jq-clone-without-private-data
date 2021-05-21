import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("id_member", ["idMember", "deleted", "idPm"], { unique: true })
@Entity("pm_recipients", { schema: "jq" })
export class PmRecipientEntity {
  @Column("int", {
    primary: true,
    name: "id_pm",
    unsigned: true,
    default: () => "'0'",
  })
  idPm: number = 0;

  @Column("mediumint", {
    primary: true,
    name: "id_member",
    unsigned: true,
    default: () => "'0'",
  })
  idMember: number = 0;

  @Column("varchar", { name: "labels", length: 60, default: () => "'-1'" })
  labels: string = '';

  @Column("tinyint", { name: "bcc", unsigned: true, default: () => "'0'" })
  bcc: number = 0;

  @Column("tinyint", { name: "is_read", unsigned: true, default: () => "'0'" })
  isRead: number = 0;

  @Column("tinyint", { name: "is_new", unsigned: true, default: () => "'0'" })
  isNew: number = 0;

  @Column("tinyint", { name: "deleted", unsigned: true, default: () => "'0'" })
  deleted: number = 0;

  @Column("varchar", { name: "attachments", length: 255, default: () => "''" })
  attachments: string = '';

  @Column("varchar", { name: "downloads", length: 255, default: () => "''" })
  downloads: string = '';
}
