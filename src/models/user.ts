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
  oid: string;
  stmCompanyOid?: string;
  userId: string;
  userName?: string;
  password: Uint8Array;
  managerName?: string;
  contact?: string;
  contact_01?: string;
  contact_02?: string;
  contact_03?: string;
  contact_04?: string;
  contact_05?: string;
  contact_06?: string;
  contact_07?: string;
  contact_08?: string;
  contact_09?: string;
  managerTel?: string;
  role?: string;
  authStatus?: string;
  status?: string;
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
    type: DataType.STRING(100),
    comment: "키값(oid)",
  })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "stm_company_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "회사 참조키",
  })
  stmCompanyOid?: string;

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
    field: "manager_name",
    allowNull: true,
    type: DataType.STRING(20),
    comment: "부서 이름",
  })
  managerName?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "알람 발송 대상 1번",
  })
  contact?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "알람 발송 대상2",
  })
  contact_01?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처2" })
  contact_02?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처3" })
  contact_03?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처4" })
  contact_04?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처5" })
  contact_05?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처6" })
  contact_06?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처7" })
  contact_07?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처8" })
  contact_08?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "연락처9" })
  contact_09?: string;

  @Column({
    field: "manager_tel",
    allowNull: true,
    type: DataType.STRING(15),
    comment: "담당자 연락처",
  })
  managerTel?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "권한(회사 관리자, 슈퍼 관리자, 회사 직원)",
  })
  role?: string;

  @Column({
    field: "auth_status",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "가입 승인 상태",
  })
  authStatus?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "유저 사용 상태",
    defaultValue: "0aply_using",
  })
  status?: string;

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
    defaultValue: "1",
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
