import GenericService from "./genericService";

import ForgetPasswordService from "./forgetPasswordService";

export default {
  UserService: new GenericService("User"),
  ForgetPasswordService,
  AdminService: new GenericService("Admin"),
  TokenService: new GenericService("Token"),
  SSOManagerService: new GenericService("SSO"),
  EnvironmentService: new GenericService("Environment"),
  LocalObjectService: new GenericService("LocalObject"),
  PublicObjectService: new GenericService("PublicObject"),
  LocalObjectItemService: new GenericService("LocalObjectItem"),
};
