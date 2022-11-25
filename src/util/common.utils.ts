import sequelize from "sequelize";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Utils {
  // oid 생성
  getOid = async (model, param) => {
    const data = await model.sequelize.query(
      `SELECT Oid_Create("${param}") as Oid`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return data[0].Oid;
  };

  // whereQuery 생성
  generator = (whereArr: any, query: any) => {
    let string = "";
    for (const obj of whereArr) {
      if (!obj[1]) continue;

      const stringArr = obj[0]
        .split(" ")
        .filter((cur) => cur[0] === ":")
        .map((cur) => cur.substr(1));

      let flag = true;
      for (const queryKey of stringArr) {
        if (!query[queryKey]) flag = false;
      }

      if (flag) {
        string += `
          ${obj[0]} `;
      }
    }
    return string;
  };

  // 접수번호 생성
  makeReciptNo = async (sequelize: any) => {
    const recipNo = await sequelize.query(
      `SELECT CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(IFNULL(MAX(RIGHT(Recipt_No, 3)) + 1, 1), 5, 0)) AS Recipt_No 
        FROM Order_Main 
        WHERE LEFT(Recipt_No, 8) = DATE_FORMAT(NOW(), '%Y%m%d')`,
      { type: sequelize.QueryTypes.SELECT }
    );
    return recipNo;
  };

  // whereQuery like 생성
  likeGenerator = (whereArr: any, query: any) => {
    let string = "";
    for (const obj of whereArr) {
      if (!obj[1]) continue;

      const stringArr = obj[0]
        .split(" ")
        .filter((cur) => cur[0] === ":")
        .map((cur) => cur.substr(1));

      let flag = true;
      for (const queryKey of stringArr) {
        if (!query[queryKey]) flag = false;
        else query[queryKey] = `%${query[queryKey]}%`;
      }

      if (flag) {
        string += `
      ${obj[0]} `;
      }
    }
    return string;
  };
}
