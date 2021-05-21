import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("id_member", ["idMember", "idAttach"], { unique: true })
@Index("id_msg", ["idMsg"], {})
@Index("attachment_type", ["attachmentType"], {})
@Entity("attachments", { schema: "jq" })
export class AttachmentEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_attach", unsigned: true })
  idAttach: number = 0;

  @Column("int", { name: "id_thumb", unsigned: true, default: () => "'0'" })
  idThumb: number = 0;

  @Column("int", { name: "id_msg", unsigned: true, default: () => "'0'" })
  idMsg: number = 0;

  @Column("mediumint", {
    name: "id_member",
    unsigned: true,
    default: () => "'0'",
  })
  idMember: number = 0;

  @Column("tinyint", { name: "id_folder", default: () => "'1'" })
  idFolder: number = 1;

  @Column("tinyint", {
    name: "attachment_type",
    unsigned: true,
    default: () => "'0'",
  })
  attachmentType: number = 0;

  @Column("varchar", { name: "filename", length: 255, default: () => "''" })
  filename: string = '';

  @Column("varchar", { name: "file_hash", length: 40, default: () => "''" })
  fileHash: string = '';

  @Column("varchar", { name: "fileext", length: 8, default: () => "''" })
  fileext: string = '';

  @Column("int", { name: "size", unsigned: true, default: () => "'0'" })
  size: number = 0;

  @Column("mediumint", {
    name: "downloads",
    unsigned: true,
    default: () => "'0'",
  })
  downloads: number = 0;

  @Column("mediumint", { name: "width", unsigned: true, default: () => "'0'" })
  width: number = 0;

  @Column("mediumint", { name: "height", unsigned: true, default: () => "'0'" })
  height: number = 0;

  @Column("varchar", { name: "mime_type", length: 20, default: () => "''" })
  mimeType: string = '';

  @Column("tinyint", { name: "approved", default: () => "'1'" })
  approved: number = 1;
}
