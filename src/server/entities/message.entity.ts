import { Column, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Entity } from '../common/entity'
import { BoardEntity } from './board.entity'
import { MemberEntity } from './member.entity'
import { TopicEntity } from './topic.entity'

@Index("topic", ["idTopic", "idMsg"], { unique: true })
@Index("id_board", ["idBoard", "idMsg"], { unique: true })
@Index("id_member", ["idMember", "idMsg"], { unique: true })
@Index("approved", ["approved"], {})
@Index("ip_index", ["posterIp", "idTopic"], {})
@Index("participation", ["idMember", "idTopic"], {})
@Index("show_posts", ["idMember", "idBoard"], {})
@Index("id_topic", ["idTopic"], {})
@Index("id_member_msg", ["idMember", "approved", "idMsg"], {})
@Index("current_topic", ["idTopic", "idMsg", "idMember", "approved"], {})
@Index("related_ip", ["idMember", "posterIp", "idMsg"], {})
@Index("rating", ["rating", "nRateGood", "nRateBad"], {})
@Index(
  "idx_smf_messages_id_topic_id_board_poster_time",
  ["idTopic", "idBoard", "posterTime"],
  {}
)
@Entity("messages", { schema: "jq" })
export class MessageEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_msg", unsigned: true })
  idMsg: number = 0;

  @Column("mediumint", {
    name: "id_topic",
    unsigned: true,
    default: () => "'0'",
  })
  idTopic: number = 0;

  @Column("smallint", {
    name: "id_board",
    unsigned: true,
    default: () => "'0'",
  })
  idBoard: number = 0;

  @Column("int", { name: "poster_time", unsigned: true, default: () => "'0'" })
  posterTime: number = 0;

  @Column("mediumint", {
    name: "id_member",
    unsigned: true,
    default: () => "'0'",
  })
  idMember: number = 0;

  @Column("int", {
    name: "id_msg_modified",
    unsigned: true,
    default: () => "'0'",
  })
  idMsgModified: number = 0;

  @Column("varchar", { name: "subject", length: 255, default: () => "''" })
  subject: string = '';

  @Column("varchar", { name: "poster_name", length: 255, default: () => "''" })
  posterName: string = '';

  @Column("varchar", { name: "poster_email", length: 255, default: () => "''" })
  posterEmail: string = '';

  @Column("varchar", { name: "poster_ip", length: 255, default: () => "''" })
  posterIp: string = '';

  @Column("tinyint", { name: "smileys_enabled", default: () => "'1'" })
  smileysEnabled: number = 0;

  @Column("int", {
    name: "modified_time",
    unsigned: true,
    default: () => "'0'",
  })
  modifiedTime: number = 0;

  @Column("varchar", {
    name: "modified_name",
    length: 255,
    default: () => "''",
  })
  modifiedName: string = '';

  @Column("text", { name: "body" })
  body: string = '';

  @Column("text", { name: "body_html", nullable: true })
  bodyHtml: string | null = null;

  @Column("tinyint", { name: "_smg", unsigned: true, default: () => "'0'" })
  smg: number = 0;

  @Column("varchar", { name: "icon", length: 16, default: () => "'xx'" })
  icon: string = '';

  @Column("tinyint", { name: "approved", default: () => "'1'" })
  approved: number = 0;

  @Column("tinyint", { name: "tapa", unsigned: true, default: () => "'0'" })
  tapa: number = 0;

  @Column("smallint", { name: "rating", default: () => "'0'" })
  rating: number = 0;

  @Column("mediumint", {
    name: "n_rate_good",
    unsigned: true,
    default: () => "'0'",
  })
  nRateGood: number = 0;

  @Column("mediumint", {
    name: "n_rate_bad",
    unsigned: true,
    default: () => "'0'",
  })
  nRateBad: number = 0;

  @Column("timestamp", {
    name: "update_timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateTimestamp: Date = new Date();

  // relations
  // @OneToOne(type => BoardEntity, {eager: true})
  // @JoinColumn({name: 'id_board', referencedColumnName: 'idBoard'})
  // board?: BoardEntity

  // @OneToOne(type => MemberEntity)
  // @JoinColumn({name: 'idMember', referencedColumnName: 'idMember'})
  // member?: MemberEntity
  //
  // @OneToOne(type => TopicEntity)
  // @JoinColumn({name: 'idTopic', referencedColumnName: 'idTopic'})
  // topic?: TopicEntity

}
