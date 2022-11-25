import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_EXPIRES = 60 * 5 * 1000;

const createAccessToken = (payload: any) => {
  console.log(payload, "create...");
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES, //토큰 유지 기간
  });
};

const createRefreshToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "180d",
  });
};

export const getTokenInfo = (user: any) => {
  console.log(user, "user in getToken");
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    ...user,
    accessToken: accessToken,
    accessTokenExpiry: Date.now() + ACCESS_TOKEN_EXPIRES,
    refreshToken: refreshToken,
  };
};
