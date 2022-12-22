import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface berthStatScheduleAttributes {
  oid: string;
  trminlCode?: string;
  berthCode?: string;
  trminlVoyg?: string;
  wtorcmpCode?: string;
  trminlShipnm?: string;
  shipRute?: string;
  csdhpPrarnde?: string;
  tkoffPrarnde?: string;
  csdhpDrc?: string;
  workStarDay?: string;
  workFiniDay?: string;
  carryFiniDay?: string;
  landngQy?: string;
  shipngQy?: string;
  reshmtQy?: string;
  predBerth?: string;
  shipment?: string;
  shifting?: string;
  isNewPort?: number;
  createDate?: Date;
  updateDate?: Date;
}

@Table({ tableName: "berthStat_schedule", timestamps: false })
export class berthStatSchedule
  extends Model<berthStatScheduleAttributes, berthStatScheduleAttributes>
  implements berthStatScheduleAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100) })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "터미널코드",
  })
  trminlCode?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "선석" })
  berthCode?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "모선-선사항차",
  })
  trminlVoyg?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "선사" })
  wtorcmpCode?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "모선명" })
  trminlShipnm?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "항로" })
  shipRute?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "입항일시" })
  csdhpPrarnde?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "출항일시" })
  tkoffPrarnde?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "접안/접안방향",
  })
  csdhpDrc?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "작업시작일시",
  })
  workStarDay?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "완료일시" })
  workFiniDay?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "반입마감일지",
  })
  carryFiniDay?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "양하수량" })
  landngQy?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "적하수량" })
  shipngQy?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "이적수량" })
  reshmtQy?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "전배" })
  predBerth?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "선적" })
  shipment?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "S/H" })
  shifting?: string;

  @Column({
    allowNull: true,
    type: DataType.TINYINT,
    comment: "신항/북항 구분",
    defaultValue: "0",
  })
  isNewPort?: number;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  createDate?: Date;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  updateDate?: Date;
}
