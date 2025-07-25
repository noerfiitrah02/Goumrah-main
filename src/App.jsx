import { Routes } from "react-router-dom";
import { Suspense } from "react";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";

import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import TravelRoutes from "./routes/TravelRoutes";
import ErrorRoute from "./routes/ErrorRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ScrollToTop from "./components/common/ScrollToTop";
import FullScreenLoader from "./components/common/FullScreenLoader";

const TOAST_LIMIT = 3;
const activeToastIds = new Set();

const showToastWithLimit = (originalToastFn, ...args) => {
  if (activeToastIds.size >= TOAST_LIMIT) {
    return;
  }

  const [content, options] = args;

  const id = originalToastFn(content, {
    ...options,
    onClose: (props) => {
      activeToastIds.delete(id);
      if (options?.onClose) {
        options.onClose(props);
      }
    },
  });

  activeToastIds.add(id);
  return id;
};

const original = {
  success: toast.success,
  error: toast.error,
  info: toast.info,
  warn: toast.warn,
};

toast.success = (...args) => showToastWithLimit(original.success, ...args);
toast.error = (...args) => showToastWithLimit(original.error, ...args);
toast.info = (...args) => showToastWithLimit(original.info, ...args);
toast.warn = (...args) => showToastWithLimit(original.warn, ...args);

const App = () => {
  return (
    <AuthProvider>
      <ScrollToTop>
        <ErrorBoundary>
          <Suspense fallback={<FullScreenLoader />}>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              newestOnTop={true}
              transition={Slide}
              toastClassName="custom-toast"
              bodyClassName="custom-toast-body"
            />
            <Routes>
              {PublicRoutes}
              {AdminRoutes}
              {AuthRoutes}
              {TravelRoutes}
              {ErrorRoute}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </ScrollToTop>
    </AuthProvider>
  );
};

export default App;
