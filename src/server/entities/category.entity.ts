import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Entity("categories", { schema: "jq" })
export class CategoryEntity {
  @PrimaryGeneratedColumn({ type: "tinyint", name: "id_cat", unsigned: true })
  idCat: number = 0;

  @Column("tinyint", { name: "cat_order", default: () => "'0'" })
  catOrder: number = 0;

  @Column("varchar", { name: "name", length: 255, default: () => "''" })
  name: string = '';

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

  @Column("tinyint", { name: "can_collapse", width: 1, default: () => "'1'" })
  canCollapse: boolean = true;

  @Column("int", { name: "site_id", nullable: true })
  siteId: number | null = null;
}
