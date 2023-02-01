import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface commonCodeSubAttributes {
  oid: string;
  mainCodeOid?: string;
  code?: string;
  codeName?: string;
  createDate?: Date;
  updateDate?: Date;
}

@Table({
  tableName: "common_code_sub",
  timestamps: false,
  comment: "공통 코드 서브",
})
export class commonCodeSub
  extends Model<commonCodeSubAttributes, commonCodeSubAttributes>
  implements commonCodeSubAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100), comment: "키값" })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "main_code_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "메인 코드 참조키",
  })
  mainCodeOid?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "서브 코드" })
  code?: string;

  @Column({
    field: "code_name",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "코드 이름",
  })
  codeName?: string;

  @Column({
    field: "create_date",
    allowNull: true,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createDate?: Date;

  @Column({
    field: "update_date",
    allowNull: true,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updateDate?: Date;
}
