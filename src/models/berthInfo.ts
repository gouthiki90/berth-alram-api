import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface berthInfoAttributes {
  oid: string;
  turminalCode?: string;
  turminalKorea?: string;
  isNewPort?: number;
  carryTiming?: number;
  createDate?: Date;
  updateDate?: Date;
}

@Table({
  tableName: "berth_info",
  timestamps: false,
  comment: "선석 데이터(static)",
})
export class berthInfo
  extends Model<berthInfoAttributes, berthInfoAttributes>
  implements berthInfoAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100), comment: "키값" })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "turminal_code",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "터미널 코드",
  })
  turminalCode?: string;

  @Column({
    field: "turminal_korea",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "터미널 한글 이름",
  })
  turminalKorea?: string;

  @Column({
    field: "is_new_port",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "신항/북항 구분",
    defaultValue: "0",
  })
  isNewPort?: number;

  @Column({
    field: "carry_timing",
    allowNull: true,
    type: DataType.INTEGER,
    comment: "사전 반입일",
  })
  carryTiming?: number;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  createDate?: Date;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  updateDate?: Date;
}
