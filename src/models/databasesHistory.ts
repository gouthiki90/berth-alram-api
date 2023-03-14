import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface databasesHistoryAttributes {
  oid: string;
  workOid?: string;
  tableName?: string;
  queryText?: string;
  userOid?: string;
  createDate?: Date;
  updateDate?: Date;
}

@Table({
  tableName: "databases_history",
  timestamps: false,
  comment: "쿼리 히스토리",
})
export class databasesHistory
  extends Model<databasesHistoryAttributes, databasesHistoryAttributes>
  implements databasesHistoryAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100) })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "work_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "테이블 키값",
  })
  workOid?: string;

  @Column({
    field: "table_name",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "테이블 이름",
  })
  tableName?: string;

  @Column({
    field: "query_text",
    allowNull: true,
    type: DataType.STRING(5000),
    comment: "INSERT 쿼리",
  })
  queryText?: string;

  @Column({
    field: "user_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "유저 키값",
  })
  userOid?: string;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  createDate?: Date;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  updateDate?: Date;
}
