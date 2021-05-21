import { Column, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Entity } from '../common/entity'
import { RelatedSubjectEntity } from './relatedSubject.entity'

@Index("last_message", ["idLastMsg", "idBoard"], { unique: true })
@Index("first_message", ["idFirstMsg", "idBoard"], { unique: true })
@Index("poll", ["idPoll", "idTopic"], { unique: true })
@Index("is_sticky", ["isSticky"], {})
@Index("approved", ["approved"], {})
@Index("id_board", ["idBoard"], {})
@Index("member_started", ["idMemberStarted", "idBoard"], {})
@Index("last_message_sticky", ["idBoard", "isSticky", "idLastMsg"], {})
@Index("board_news", ["idBoard", "idFirstMsg"], {})
@Entity("topics", { schema: "jq" })
export class TopicEntity {
  @PrimaryGeneratedColumn({
    type: "mediumint",
    name: "id_topic",
    unsigned: true,
  })
  idTopic: number = 0;

  @Column("smallint", { name: "is_sticky", default: () => "'0'" })
  isSticky: number = 0;

  @Column("smallint", {
    name: "id_board",
    unsigned: true,
    default: () => "'0'",
  })
  idBoard: number = 0;

  @Column("int", { name: "id_first_msg", unsigned: true, default: () => "'0'" })
  idFirstMsg: number = 0;

  @Column("int", { name: "id_last_msg", unsigned: true, default: () => "'0'" })
  idLastMsg: number = 0;

  @Column("mediumint", {
    name: "id_member_started",
    unsigned: true,
    default: () => "'0'",
  })
  idMemberStarted: number = 0;

  @Column("mediumint", {
    name: "id_member_updated",
    unsigned: true,
    default: () => "'0'",
  })
  idMemberUpdated: number = 0;

  @Column("mediumint", {
    name: "id_poll",
    unsigned: true,
    default: () => "'0'",
  })
  idPoll: number = 0;

  @Column("smallint", { name: "id_previous_board", default: () => "'0'" })
  idPreviousBoard: number = 0;

  @Column("mediumint", { name: "id_previous_topic", default: () => "'0'" })
  idPreviousTopic: number = 0;

  @Column("int", { name: "num_replies", unsigned: true, default: () => "'0'" })
  numReplies: number = 0;

  @Column("int", { name: "num_views", unsigned: true, default: () => "'0'" })
  numViews: number = 0;

  @Column("tinyint", { name: "locked", default: () => "'0'" })
  locked: number = 0;

  @Column("smallint", { name: "unapproved_posts", default: () => "'0'" })
  unapprovedPosts: number = 0;

  @Column("tinyint", { name: "approved", default: () => "'1'" })
  approved: number = 0;

  @Column("tinyint", {
    name: "is_sticky_first_post",
    unsigned: true,
    default: () => "'0'",
  })
  isStickyFirstPost: number = 0;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null = null;

  @Column("varchar", { name: "url", length: 255, default: () => "''" })
  url: string = '';

  @Column("varchar", { name: "banner", length: 128, default: () => "''" })
  banner: string = '';

  @Column("varchar", { name: "sponsor_name", length: 128, default: () => "''" })
  sponsorName: string = '';

  @Column("varchar", { name: "sponsor_link", length: 128, default: () => "''" })
  sponsorLink: string = '';

  /// relations

  // @OneToOne(type => RelatedSubjectEntity, {eager: true, lazy: false, persistence: false, deferrable: 'INITIALLY IMMEDIATE'})
  // @JoinColumn({name: 'id_topic', referencedColumnName: 'idTopic'})
  // subject?: RelatedSubjectEntity
}
