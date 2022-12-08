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
  id?: number;
  oid?: string;
  berthOid?: string;
  userOid?: string;
  alramOid?: string;
  containerStatus?: number;
  carCode?: string;
  outgateCy?: string;
  cntrNo?: string;
  outgateTime?: string;
  statusDt?: string;
  statusNm?: string;
  cntrStatus?: string;
  terminalName?: string;
  statusTm?: string;
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
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    comment: "키값",
  })
  @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(100), comment: "키값" })
  oid?: string;

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
    field: "CAR_CODE",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "차량번호",
  })
  carCode?: string;

  @Column({
    field: "OUTGATE_CY",
    allowNull: true,
    type: DataType.STRING(50),
    comment: "터미널 코드",
  })
  outgateCy?: string;

  @Column({
    field: "CNTR_NO",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "컨테이너 번호",
  })
  cntrNo?: string;

  @Column({
    field: "OUTGATE_TIME",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "반출시간",
  })
  outgateTime?: string;

  @Column({
    field: "STATUS_DT",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "해당 데이터 기준 날짜",
  })
  statusDt?: string;

  @Column({
    field: "STATUS_NM",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "반입/반출 상태",
  })
  statusNm?: string;

  @Column({
    field: "CNTR_STATUS",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "반입/반출 상태 코드",
  })
  cntrStatus?: string;

  @Column({
    field: "TERMINAL_NAME",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "터미널 이름",
  })
  terminalName?: string;

  @Column({
    field: "STATUS_TM",
    allowNull: true,
    type: DataType.STRING(100),
    comment: "해당 데이터 기준의 시간",
  })
  statusTm?: string;

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
