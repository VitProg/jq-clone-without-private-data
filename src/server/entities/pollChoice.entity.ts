import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Entity("poll_choices", { schema: "jq" })
export class PollChoiceEntity {
  @Column("mediumint", {
    primary: true,
    name: "id_poll",
    unsigned: true,
    default: () => "'0'",
  })
  idPoll: number = 0;

  @Column("tinyint", {
    primary: true,
    name: "id_choice",
    unsigned: true,
    default: () => "'0'",
  })
  idChoice: number = 0;

  @Column("varchar", { name: "label", length: 255, default: () => "''" })
  label: string = '';

  @Column("smallint", { name: "votes", unsigned: true, default: () => "'0'" })
  votes: number = 0;
}
