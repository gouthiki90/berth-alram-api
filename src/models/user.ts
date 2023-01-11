import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface userAttributes {
  id?: number;
  oid?: string;
  userId: string;
  userName?: string;
  password: Uint8Array;
  bizName?: string;
  contact?: string;
  managerTel?: string;
  managerName?: string;
  contactOption?: number;
  isNofitication?: number;
  createDate?: Date;
  updateDate?: Date;
}

@Table({ tableName: "user", timestamps: false, comment: "유저" })
export class user
  extends Model<userAttributes, userAttributes>
  implements userAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    comment: "키값",
  })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "키값(oid)" })
  oid?: string;

  @Column({
    field: "user_id",
    type: DataType.STRING(50),
    comment: "유저 아이디",
  })
  @Index({ name: "user_id_UNIQUE", using: "BTREE", order: "ASC", unique: true })
  userId!: string;

  @Column({ allowNull: true, type: DataType.STRING(50), comment: "유저 이름" })
  userName?: string;

  @Column({ type: DataType.BLOB, comment: "PW" })
  password!: Uint8Array;

  @Column({
    field: "biz_name",
    allowNull: true,
    type: DataType.STRING(50),
    comment: "사업자명",
  })
  bizName?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "알람 발송 대상",
  })
  contact?: string;

  @Column({
    field: "manager_tel",
    allowNull: true,
    type: DataType.STRING(15),
    comment: "담당자 연락처",
  })
  managerTel?: string;

  @Column({
    field: "manager_name",
    allowNull: true,
    type: DataType.STRING(20),
    comment: "부서 이름",
  })
  managerName?: string;

  @Column({
    field: "contact_option",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "문자/카카오톡 옵션",
    defaultValue: "0",
  })
  contactOption?: number;

  @Column({
    field: "is_nofitication",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "알람 ON/OFF 여부",
    defaultValue: "0",
  })
  isNofitication?: number;

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
