import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("subject", ["subject"], {})
@Entity("related_subjects", { schema: "jq" })
export class RelatedSubjectEntity {
  @Column("int", { primary: true, name: "id_topic", unsigned: true })
  idTopic: number = 0;

  @Column("tinytext", { name: "subject" })
  subject: string = '';
}
