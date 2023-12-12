import { jwtDecode } from "jwt-decode";
import { UserData } from "../api/userSlice";
import { getCookie } from "./getCookie";

enum JwtClaims {
  userId = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  email = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  userName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
}

type jwtTokenClaims = {
  [value in JwtClaims]: number | string;
};

export const jwtParseToken = () => {
  const token = getCookie("API_TOKEN") as string;

  const userData: jwtTokenClaims = jwtDecode(token);

  const mappedUserData: UserData = {
    userId: userData[JwtClaims.userId] as number,
    email: userData[JwtClaims.email] as string,
    userName: userData[JwtClaims.userName] as string,
    role: userData[JwtClaims.role] as string,
  };

  return mappedUserData;
};
