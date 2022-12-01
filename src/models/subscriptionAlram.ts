import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface subscriptionAlramAttributes {
  oid: string;
  userOid?: string;
  scheduleOid?: string;
  title?: string;
  content?: string;
  createDate?: Date;
  updateDate?: Date;
}

@Table({
  tableName: "subscription_alram",
  timestamps: false,
  comment: "알람 구독",
})
export class subscriptionAlram
  extends Model<subscriptionAlramAttributes, subscriptionAlramAttributes>
  implements subscriptionAlramAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100), comment: "키값" })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "user_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "유저 키값",
  })
  userOid?: string;

  @Column({
    field: "schedule_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "선석 스케줄 키값",
  })
  scheduleOid?: string;

  @Column({ allowNull: true, type: DataType.STRING(50), comment: "문자 제목" })
  title?: string;

  @Column({ allowNull: true, type: DataType.STRING(150), comment: "문자 내용" })
  content?: string;

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
