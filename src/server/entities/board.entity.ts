import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("categories", ["idCat", "idBoard"], { unique: true })
@Index("id_board", ["idBoard"], { unique: true })
@Index("id_parent", ["idParent"], {})
@Index("id_msg_updated", ["idMsgUpdated"], {})
@Index("member_groups", ["memberGroups"], {})
@Index("hidden", ["hidden"], {})
@Entity("boards", { schema: "jq" })
export class BoardEntity {
  @PrimaryGeneratedColumn({
    type: "smallint",
    name: "id_board",
    unsigned: true,
  })
  idBoard: number = 0;

  @Column("tinyint", { name: "id_cat", unsigned: true, default: () => "'0'" })
  idCat: number = 0;

  @Column("tinyint", {
    name: "child_level",
    unsigned: true,
    default: () => "'0'",
  })
  childLevel: number = 0;

  @Column("smallint", {
    name: "id_parent",
    unsigned: true,
    default: () => "'0'",
  })
  idParent: number = 0;

  @Column("smallint", {
    // primary: true,
    name: "board_order",
    default: () => "'0'",
  })
  boardOrder: number = 0;

  @Column("int", { name: "id_last_msg", unsigned: true, default: () => "'0'" })
  idLastMsg: number = 0;

  @Column("int", {
    name: "id_msg_updated",
    unsigned: true,
    default: () => "'0'",
  })
  idMsgUpdated: number = 0;

  @Column("varchar", {
    name: "member_groups",
    length: 255,
    default: () => "'-1,0'",
  })
  memberGroups: string = '-1,0';

  @Column("smallint", {
    name: "id_profile",
    unsigned: true,
    default: () => "'1'",
  })
  idProfile: number = 1;

  @Column("varchar", { name: "name", length: 255, default: () => "''" })
  name: string = ''

  @Column("varchar", {
    name: "name_fun_balg",
    length: 255,
    default: () => "''",
  })
  nameFunBalg: string = '';

  @Column("varchar", { name: "name_fun_bel", length: 255, default: () => "''" })
  nameFunBel: string = '';

  @Column("varchar", {
    name: "name_fun_makedon",
    length: 255,
    default: () => "''",
  })
  nameFunMakedon: string = '';

  @Column("varchar", { name: "name_fun_ukr", length: 255, default: () => "''" })
  nameFunUkr: string = '';

  @Column("varchar", { name: "name_fun_kz", length: 255, default: () => "''" })
  nameFunKz: string = '';

  @Column("varchar", { name: "description", length: 255, default: () => "''" })
  description: string = '';

  @Column("mediumint", {
    name: "num_topics",
    unsigned: true,
    default: () => "'0'",
  })
  numTopics: number = 0;

  @Column("mediumint", {
    name: "num_posts",
    unsigned: true,
    default: () => "'0'",
  })
  numPosts: number = 0;

  @Column("tinyint", { name: "count_posts", default: () => "'0'" })
  countPosts: number = 0;

  @Column("tinyint", { name: "id_theme", unsigned: true, default: () => "'0'" })
  idTheme: number = 0;

  @Column("tinyint", {
    name: "override_theme",
    unsigned: true,
    default: () => "'0'",
  })
  overrideTheme: number = 0;

  @Column("smallint", { name: "unapproved_posts", default: () => "'0'" })
  unapprovedPosts: number = 0;

  @Column("smallint", { name: "unapproved_topics", default: () => "'0'" })
  unapprovedTopics: number = 0;

  @Column("varchar", { name: "redirect", length: 255, default: () => "''" })
  redirect: string = '';

  @Column("tinyint", { name: "for_chat", unsigned: true, default: () => "'0'" })
  forChat: number = 0;

  @Column("tinyint", { name: "hidden", unsigned: true, default: () => "'0'" })
  hidden: number = 0;

  @Column("varchar", { name: "notice_title", length: 255, default: () => "''" })
  noticeTitle: string = '';

  @Column("varchar", {
    name: "notice_description",
    length: 255,
    default: () => "''",
  })
  noticeDescription: string = '';

  @Column("varchar", { name: "sponsor_name", nullable: true, length: 256 })
  sponsorName: string | null = null;

  @Column("varchar", { name: "sponsor_id_topic", nullable: true, length: 128 })
  sponsorIdTopic: string | null = null;

  @Column("varchar", {
    name: "member_groups_only_index",
    length: 255,
    default: () => "''",
  })
  memberGroupsOnlyIndex: string = '';

  @Column("text", { name: "is_only_index_message", nullable: true })
  isOnlyIndexMessage: string | null = null;

  @Column("varchar", { name: "url", length: 255, default: () => "''" })
  url: string = '';
}
