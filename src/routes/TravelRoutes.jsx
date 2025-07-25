import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "../components/common/ProtectedRoute";

const Dashboard = lazy(() => import("../pages/travel/Dashboard"));
const Packages = lazy(() => import("../pages/travel/produk/Package"));
const PackageDetailTravel = lazy(
  () => import("../pages/travel/produk/PackageDetailTravel"),
);
const PackageForm = lazy(() => import("../pages/travel/produk/PackageForm"));
const AddPackageItinerary = lazy(
  () => import("../pages/travel/produk/AddPackageItineraryTravel"),
);
const AddPackageHotel = lazy(
  () => import("../pages/travel/produk/AddPackageHotelTravel"),
);
const AddPackageFlight = lazy(
  () => import("../pages/travel/produk/AddPackageFlightTravel"),
);
const AddPackageImage = lazy(
  () => import("../pages/travel/produk/AddPackageImageTravel"),
);
const OrderTravelAgent = lazy(() => import("../pages/travel/order/Order"));
const CreateOrderTravelAgent = lazy(
  () => import("../pages/travel/order/OrderForm"),
);
const OrderDetailTravelAgent = lazy(
  () => import("../pages/travel/order/TravelOrderDetail"),
);

const Profile = lazy(() => import("../pages/travel/Profile"));

const TravelRoutes = [
  <Route
    key="travel-route"
    element={<ProtectedRoute roles={["travel_agent"]} />}
  >
    <Route
      key="dashboard-travel"
      path="/travel/dashboard"
      element={<Dashboard />}
    />
    <Route key="produk-travel" path="/travel/produk" element={<Packages />} />
    <Route
      key="produk-travel-detail"
      path="/travel/produk/detail/:id"
      element={<PackageDetailTravel />}
    />
    <Route
      key="produk-travel-create"
      path="/travel/produk/create"
      element={<PackageForm />}
    />
    <Route
      key="produk-travel-edit"
      path="/travel/produk/edit/:id"
      element={<PackageForm />}
    />
    <Route
      key="package-itinerary-travel"
      path="/travel/produk/:id/add-itinerary"
      element={<AddPackageItinerary />}
    />
    <Route
      key="package-image-travel"
      path="/travel/produk/:id/add-image"
      element={<AddPackageImage />}
    />
    <Route
      key="package-hotel-travel"
      path="/travel/produk/:id/add-hotel"
      element={<AddPackageHotel />}
    />
    <Route
      key="package-flight-travel"
      path="/travel/produk/:id/add-flight"
      element={<AddPackageFlight />}
    />
    <Route
      key="order-travel"
      path="/travel/orders"
      element={<OrderTravelAgent />}
    />
    <Route
      key="create-order-travel"
      path="/travel/orders/create"
      element={<CreateOrderTravelAgent />}
    />
    <Route
      key="detail-order-travel-agent"
      path="/travel/orders/detail/:id"
      element={<OrderDetailTravelAgent />}
    />
    <Route key="profile-travel" path="/travel/profile" element={<Profile />} />
  </Route>,
];

export default TravelRoutes;
