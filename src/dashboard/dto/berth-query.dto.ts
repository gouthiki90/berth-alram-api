export class BerthQueryDto {
  /** 터미널코드　*/
  trminlCode?: string;
  /** 기준일(시작) */
  startDate?: Date;
  /** 기준일(끝) */
  endDate?: Date;
  /** 검색일 기준 */
  searchType?: any;
}
