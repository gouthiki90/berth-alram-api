import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface containerAttributes {
  oid: string;
  berthOid?: string;
  userOid?: string;
  alramOid?: string;
  containerStatus?: number;
  containerNumnber?: string;
  isDanger?: number;
  isNewPort?: string;
  isComplete?: number;
  remark?: string;
  createDate?: Date;
  updateDate?: Date;
}

@Table({
  tableName: "container",
  timestamps: false,
  comment: "컨테이너 반입/반출 정보",
})
export class container
  extends Model<containerAttributes, containerAttributes>
  implements containerAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(100), comment: "키값" })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  oid!: string;

  @Column({
    field: "berth_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "선석 스케줄 키값",
  })
  berthOid?: string;

  @Column({
    field: "user_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "유저 키값",
  })
  userOid?: string;

  @Column({
    field: "alram_oid",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "알람 키값",
  })
  alramOid?: string;

  @Column({
    field: "container_status",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "컨테이너 반입 상태(대기, 반입완료)",
    defaultValue: "0",
  })
  containerStatus?: number;

  @Column({
    field: "container_numnber",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "컨테이너 넘버",
  })
  containerNumnber?: string;

  @Column({
    field: "is_danger",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "위험물 여부",
    defaultValue: "0",
  })
  isDanger?: number;

  @Column({
    field: "is_new_port",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "반입/출입 컨테이너 구분값",
  })
  isNewPort?: string;

  @Column({
    field: "is_complete",
    allowNull: true,
    type: DataType.TINYINT,
    comment: "완료/미완료 구분값",
    defaultValue: "0",
  })
  isComplete?: number;

  @Column({
    allowNull: true,
    type: DataType.STRING(200),
    comment: "컨테이너에 따른 메모",
  })
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
