import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface shipBynameAttributes {
  oid: string;
  userOid?: string;
  alramOid?: string;
  scheduleOid?: string;
  nickname_01?: string;
  nickname_02?: string;
  nickname_03?: string;
  isUse?: number;
  createDate?: Date;
  updateDate?: Date;
}

@Table({
  tableName: "ship_byname",
  timestamps: false,
  comment: "각 유저들이 구독하고 있는 모선명의 별칭",
})
export class shipByname
  extends Model<shipBynameAttributes, shipBynameAttributes>
  implements shipBynameAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100) })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({ field: "user_oid", allowNull: true, type: DataType.STRING(100) })
  userOid?: string;

  @Column({ field: "alram_oid", allowNull: true, type: DataType.STRING(100) })
  alramOid?: string;

  @Column({
    field: "schedule_oid",
    allowNull: true,
    type: DataType.STRING(100),
  })
  scheduleOid?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "별칭1" })
  nickname_01?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "별칭2" })
  nickname_02?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "별칭3" })
  nickname_03?: string;

  @Column({
    field: "is_use",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "사용여부",
    defaultValue: "1",
  })
  isUse?: number;

  @Column({
    field: "create_date",
    allowNull: true,
    type: DataType.DATE,
    comment: "생성일",
    defaultValue: DataType.NOW,
  })
  createDate?: Date;

  @Column({
    field: "update_date",
    allowNull: true,
    type: DataType.DATE,
    comment: "수정일",
    defaultValue: DataType.NOW,
  })
  updateDate?: Date;
}
