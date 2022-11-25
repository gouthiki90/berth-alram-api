import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface alramHistoryAttributes {
  oid: string;
  alramOid?: string;
  userOid?: string;
  title?: string;
  content?: string;
  createDate?: Date;
  updateDate?: Date;
}

@Table({ tableName: "alram_history", timestamps: false, comment: "알람 기록" })
export class alramHistory
  extends Model<alramHistoryAttributes, alramHistoryAttributes>
  implements alramHistoryAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100), comment: "키값" })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "alram_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "알람 키값",
  })
  alramOid?: string;

  @Column({
    field: "user_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "유저 연결값",
  })
  userOid?: string;

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
