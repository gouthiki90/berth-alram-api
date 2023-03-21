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
  companyGroupCode?: string;
  principal?: string;
  authCode?: string;
  authStatus?: string;
  userId: string;
  userName?: string;
  password: Uint8Array;
  bizName?: string;
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
    field: "company_group_code",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "회사 그룹 코드(사업자번호)",
  })
  companyGroupCode?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(50),
    comment: "대표자 이름",
  })
  principal?: string;

  @Column({
    field: "auth_code",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "권한 코드",
  })
  authCode?: string;

  @Column({
    field: "auth_status",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "가입 승인 상태",
  })
  authStatus?: string;

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
    field: "manager_name",
    allowNull: true,
    type: DataType.STRING(20),
    comment: "부서 이름",
  })
  managerName?: string;

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
