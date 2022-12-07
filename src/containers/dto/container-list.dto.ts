export class ContainerListDto {
  CAR_CODE?: string;
  OUTGATE_CY?: string;
  CNTR_NO?: string;
  OUTGATE_TIME?: string;
  STATUS_DT?: string;
  STATUS_NM?: string;
  CNTR_STATUS?: string;
  TERMINAL_NAME?: string;
  STATUS_TM?: string;
  /** 반입 상태값 */
  containerStatus?: number;
}
