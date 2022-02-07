import DemoBaseRoute from "./demoRoute/demoBaseRoute";
import UserBaseRoute from "./userRoute/userBaseRoute";
import AdminBaseRoute from "./adminRoute/adminBaseRoute";
import UploadBaseRoute from "./uploadRoute/uploadBaseRoute";
import EnvironmentRoute from "./environmentRoute/environmentRoute";
import LocalObjectRoute from "./localObjectRoute/localObjectRoute";
import PublicObjectRoute from "./publicObjectRoute/publicObjectRoute";
const Routes = [].concat(
  DemoBaseRoute,
  UserBaseRoute,
  AdminBaseRoute,
  UploadBaseRoute,
  EnvironmentRoute,
  LocalObjectRoute,
  PublicObjectRoute
);

export default Routes;
