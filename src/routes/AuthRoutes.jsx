import { Route } from "react-router-dom";
import { lazy } from "react";

const RegistrationJamaah = lazy(
  () => import("../pages/auth/Jamaah/RegistrationJamaah"),
);
const RegistrationTravel = lazy(
  () => import("../pages/auth/travel/RegistrationTravel"),
);
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/Jamaah/ForgotPasswordPage"),
);

const AuthRoutes = [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route
    key="forgot-password"
    path="/forgot-password"
    element={<ForgotPasswordPage />}
  />,
  <Route
    key="register-jamaah"
    path="/daftar/jamaah"
    element={<RegistrationJamaah />}
  />,
  <Route
    key="register-travel"
    path="/daftar/travel"
    element={<RegistrationTravel />}
  />,
];

export default AuthRoutes;
