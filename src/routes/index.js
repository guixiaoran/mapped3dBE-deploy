import DemoBaseRoute from "./demoRoute/demoBaseRoute";
import UserBaseRoute from "./userRoute/userBaseRoute";
import AdminBaseRoute from "./adminRoute/adminBaseRoute";
import UploadBaseRoute from "./uploadRoute/uploadBaseRoute";
import EnvironmentRoute from "./environmentRoute/environmentRoute";
import LocalObjectRoute from "./localObjectRoute/localObjectRoute";
const Routes = [].concat(
  DemoBaseRoute,
  UserBaseRoute,
  AdminBaseRoute,
  UploadBaseRoute,
  EnvironmentRoute,
  LocalObjectRoute
);

export default Routes;
