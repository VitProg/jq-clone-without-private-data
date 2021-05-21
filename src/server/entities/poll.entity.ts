import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("id_topic", ["idTopic"], {})
@Entity("polls", { schema: "jq" })
export class PollEntity {
  @PrimaryGeneratedColumn({
    type: "mediumint",
    name: "id_poll",
    unsigned: true,
  })
  idPoll: number = 0;

  @Column("varchar", { name: "question", length: 255, default: () => "''" })
  question: string = '';

  @Column("tinyint", { name: "voting_locked", width: 1, default: () => "'0'" })
  votingLocked: boolean = false;

  @Column("tinyint", {
    name: "max_votes",
    unsigned: true,
    default: () => "'1'",
  })
  maxVotes: number = 0;

  @Column("int", { name: "expire_time", unsigned: true, default: () => "'0'" })
  expireTime: number = 0;

  @Column("tinyint", {
    name: "hide_results",
    unsigned: true,
    default: () => "'0'",
  })
  hideResults: number = 0;

  @Column("tinyint", {
    name: "change_vote",
    unsigned: true,
    default: () => "'0'",
  })
  changeVote: number = 0;

  @Column("tinyint", {
    name: "guest_vote",
    unsigned: true,
    default: () => "'0'",
  })
  guestVote: number = 0;

  @Column("int", {
    name: "num_guest_voters",
    unsigned: true,
    default: () => "'0'",
  })
  numGuestVoters: number = 0;

  @Column("int", { name: "reset_poll", unsigned: true, default: () => "'0'" })
  resetPoll: number = 0;

  @Column("mediumint", { name: "id_member", default: () => "'0'" })
  idMember: number = 0;

  @Column("varchar", { name: "poster_name", length: 255, default: () => "''" })
  posterName: string = '';

  @Column("mediumint", {
    name: "id_topic",
    unsigned: true,
    default: () => "'0'",
  })
  idTopic: number = 0;

  @Column("tinyint", {
    name: "show_voters",
    unsigned: true,
    default: () => "'0'",
  })
  showVoters: number = 0;
}
