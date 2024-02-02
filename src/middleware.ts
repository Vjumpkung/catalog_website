import { getCookie, hasCookie, setCookie } from "cookies-next";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwt_token } from "./utils/config";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (hasCookie(jwt_token, { req, res })) {
    setCookie(jwt_token, getCookie(jwt_token, { req, res }), {
      req,
      res,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
