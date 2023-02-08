import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface commonCodeMainAttributes {
  oid: string;
  groupCode?: string;
  code?: string;
  codeName?: string;
  createDate?: Date;
  updateDate?: Date;
}

@Table({
  tableName: "common_code_main",
  timestamps: false,
  comment: "공통 코드 메인",
})
export class commonCodeMain
  extends Model<commonCodeMainAttributes, commonCodeMainAttributes>
  implements commonCodeMainAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100) })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({ field: "group_code", allowNull: true, type: DataType.STRING(100) })
  groupCode?: string;

  @Column({ allowNull: true, type: DataType.STRING(100) })
  code?: string;

  @Column({ field: "code_name", allowNull: true, type: DataType.STRING(100) })
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
