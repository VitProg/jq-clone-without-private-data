import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("id_pm", ["idPm"], {})
@Entity("pm_attachments", { schema: "jq" })
export class PmAttachmentEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_attach", unsigned: true })
  idAttach: number = 0;

  @Column("int", { name: "id_thumb", unsigned: true, default: () => "'0'" })
  idThumb: number = 0;

  @Column("int", { name: "id_pm", unsigned: true, default: () => "'0'" })
  idPm: number = 0;

  @Column("int", { name: "pm_report", unsigned: true, default: () => "'0'" })
  pmReport: number = 0;

  @Column("tinyint", { name: "id_folder", default: () => "'1'" })
  idFolder: number = 0;

  @Column("tinyint", {
    name: "attachment_type",
    unsigned: true,
    default: () => "'0'",
  })
  attachmentType: number = 0;

  @Column("tinytext", { name: "filename" })
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
}
