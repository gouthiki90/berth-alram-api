import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface commonCodeAttributes {
  oid: string;
  parentOid?: string;
  depth?: number;
  code?: string;
  codeName?: string;
  useYn?: number;
  etc_01?: string;
  etc_02?: string;
  remark?: string;
  createDate?: Date;
  updateDate?: Date;
}

@Table({ tableName: "common_code", timestamps: false, comment: "사용자 코드" })
export class commonCode
  extends Model<commonCodeAttributes, commonCodeAttributes>
  implements commonCodeAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100), comment: "키값" })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "parent_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "상위 부모키",
  })
  parentOid?: string;

  @Column({ allowNull: true, type: DataType.INTEGER, comment: "Depth" })
  depth?: number;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "코드" })
  code?: string;

  @Column({
    field: "code_name",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "코드 이름",
  })
  codeName?: string;

  @Column({
    field: "use_yn",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "사용 여부",
    defaultValue: "1",
  })
  useYn?: number;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "기타1" })
  etc_01?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "기타2" })
  etc_02?: string;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "비고" })
  remark?: string;

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
