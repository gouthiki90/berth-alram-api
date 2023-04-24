import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface stmCompanyAttributes {
  oid: string;
  bizName?: string;
  principal?: string;
  code?: string;
  email?: string;
  tel?: string;
  limitUser?: number;
  createDate?: Date;
  updateDate?: Date;
}

@Table({ tableName: "stm_company", timestamps: false, comment: "업체" })
export class stmCompany
  extends Model<stmCompanyAttributes, stmCompanyAttributes>
  implements stmCompanyAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100), comment: "키값" })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "biz_name",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "회사명",
  })
  bizName?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(50),
    comment: "회사 대표자",
  })
  principal?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
    comment: "회사 코드(사업자번호)",
  })
  @Index({ name: "code_UNIQUE", using: "BTREE", order: "ASC", unique: true })
  code?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(50),
    comment: "회사 대표 이메일",
  })
  email?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(50),
    comment: "회사 대표 연락처",
  })
  tel?: string;

  @Column({ field: "limit_user", allowNull: true, type: DataType.INTEGER })
  limitUser?: number;

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
