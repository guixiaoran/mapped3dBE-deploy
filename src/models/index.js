/**
 * Created by Sanchit
 */
import User from "./user";
import Admin from "./admin";
import Token from "./token";
import SSO from "./sso";
import Environment from "./environment";
import LocalObject from "./localObject";

const ForgetPassword = require("./forgotPasswordRequest");

export default {
  User,
  ForgetPassword,
  Admin,
  Token,
  SSO,
  Environment,
  LocalObject,
};
