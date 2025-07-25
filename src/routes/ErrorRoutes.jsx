import { Route } from "react-router-dom";
import { lazy } from "react";

const Unauthorized = lazy(() => import("../pages/error/Unauthorize"));
const NotFound = lazy(() => import("../pages/error/NotFound"));

const ErrorRoute = [
  <Route key="403" path="/unauthorized" element={<Unauthorized />} />,
  <Route key="404" path="*" element={<NotFound />} />,
];

export default ErrorRoute;
