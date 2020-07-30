import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions = {
  // 토큰을 받아와서 해석
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //토큰을 암호화하는거
  secretOrKey: process.env.JWT_SECRET,
};

const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

//해석된 정보를 콜백함수로 전달
passport.use(new Strategy(jwtOptions, verifyUser));
