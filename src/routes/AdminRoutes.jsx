import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const User = lazy(() => import("../pages/admin/user/User"));
const UserForm = lazy(() => import("../pages/admin/user/Userform"));
const TravelAgent = lazy(() => import("../pages/admin/travel/TravelAgent"));
const TravelAgentForm = lazy(
  () => import("../pages/admin/travel/TravelAgentForm"),
);
const AirlineManagement = lazy(() => import("../pages/admin/airline/Airline"));
const AirlineForm = lazy(() => import("../pages/admin/airline/AirlineForm"));
const BankManagement = lazy(() => import("../pages/admin/bank/Bank"));
const BankForm = lazy(() => import("../pages/admin/bank/BankForm"));
const HotelManagement = lazy(() => import("../pages/admin/hotel/Hotel"));
const HotelForm = lazy(() => import("../pages/admin/hotel/HotelForm"));
const HotelImage = lazy(() => import("../pages/admin/hotel/HotelImage"));
const BlogCategoryManagement = lazy(
  () => import("../pages/admin/blog/BlogCategory"),
);
const BlogCategoryForm = lazy(
  () => import("../pages/admin/blog/BlogCategoryForm"),
);
const BlogPostManagement = lazy(() => import("../pages/admin/blog/BlogPost"));
const BlogPostForm = lazy(() => import("../pages/admin/blog/BlogPostForm"));
const BlogTagManagement = lazy(() => import("../pages/admin/blog/BlogTag"));
const BlogTagForm = lazy(() => import("../pages/admin/blog/BlogTagForm"));
const PackageCategoryManagement = lazy(
  () => import("../pages/admin/produk/PackageCategory"),
);
const PackageCategoryForm = lazy(
  () => import("../pages/admin/produk/PackageCategoryForm"),
);
const PackageManagement = lazy(() => import("../pages/admin/produk/Package"));
const PackageForm = lazy(() => import("../pages/admin/produk/PackageForm"));
const PackageDetailAdmin = lazy(
  () => import("../pages/admin/produk/PackageDetailAdmin"),
);
const AddPackageImage = lazy(
  () => import("../pages/admin/produk/AddPackageImageAdmin"),
);
const AddPackageFlight = lazy(
  () => import("../pages/admin/produk/AddPackageFlightAdmin"),
);
const AddPackageItinerary = lazy(
  () => import("../pages/admin/produk/AddPackageItineraryAdmin"),
);
const AddPackageHotel = lazy(
  () => import("../pages/admin/produk/AddPackageHotelAdmin"),
);
const OrderManagement = lazy(() => import("../pages/admin/order/Order"));
const OrderForm = lazy(() => import("../pages/admin/order/OrderForm"));
const OrderDetail = lazy(() => import("../pages/admin/order/AdminOrderDetail"));

const AdminRoutes = [
  <Route key="admin-routes" element={<ProtectedRoute roles={["admin"]} />}>
    <Route
      key="dashboard"
      path="/admin/dashboard"
      element={<AdminDashboard />}
    />
    <Route key="user" path="/admin/user" element={<User />} />
    <Route key="user-create" path="/admin/user/create" element={<UserForm />} />
    <Route key="user-edit" path="/admin/user/edit/:id" element={<UserForm />} />
    <Route key="travel" path="/admin/travel" element={<TravelAgent />} />
    <Route
      key="travel-create"
      path="/admin/travel/create"
      element={<TravelAgentForm />}
    />
    <Route
      key="travel-edit"
      path="/admin/travel/edit/:id"
      element={<TravelAgentForm />}
    />
    <Route
      key="airline"
      path="/admin/airline"
      element={<AirlineManagement />}
    />
    <Route
      key="airline-create"
      path="/admin/airline/create"
      element={<AirlineForm />}
    />
    <Route
      key="airline-edit"
      path="/admin/airline/edit/:id"
      element={<AirlineForm />}
    />
    <Route key="bank" path="/admin/bank" element={<BankManagement />} />
    <Route key="bank-create" path="/admin/bank/create" element={<BankForm />} />
    <Route key="bank-edit" path="/admin/bank/edit/:id" element={<BankForm />} />
    <Route key="hotel" path="/admin/hotel" element={<HotelManagement />} />
    <Route
      key="hotel-create"
      path="/admin/hotel/create"
      element={<HotelForm />}
    />
    <Route
      key="hotel-edit"
      path="/admin/hotel/edit/:id"
      element={<HotelForm />}
    />
    <Route
      key="hotel-images"
      path="/admin/hotel/images/:id"
      element={<HotelImage />}
    />
    <Route
      key="blog-category"
      path="/admin/kategori-blog"
      element={<BlogCategoryManagement />}
    />
    <Route
      key="blog-category-create"
      path="/admin/kategori-blog/create"
      element={<BlogCategoryForm />}
    />
    <Route
      key="blog-category-edit"
      path="/admin/kategori-blog/edit/:slug"
      element={<BlogCategoryForm />}
    />
    <Route
      key="blog-posts"
      path="/admin/blog-posts"
      element={<BlogPostManagement />}
    />
    <Route
      key="blog-posts-create"
      path="/admin/blog-posts/create"
      element={<BlogPostForm />}
    />
    <Route
      key="blog-posts-edit"
      path="/admin/blog-posts/edit/:categorySlug/:postSlug"
      element={<BlogPostForm />}
    />
    <Route
      key="blog-posts-tags"
      path="/admin/blog-tags"
      element={<BlogTagManagement />}
    />
    <Route
      key="blog-posts-tags-create"
      path="/admin/blog-tags/create"
      element={<BlogTagForm />}
    />
    <Route
      key="blog-posts-tags-edit"
      path="/admin/blog-tags/edit/:slug"
      element={<BlogTagForm />}
    />
    <Route
      key="package-category"
      path="/admin/kategori-produk"
      element={<PackageCategoryManagement />}
    />
    <Route
      key="package-category-create"
      path="/admin/kategori-produk/create"
      element={<PackageCategoryForm />}
    />
    <Route
      key="package-category-edit"
      path="/admin/kategori-produk/edit/:slug"
      element={<PackageCategoryForm />}
    />
    <Route key="package" path="/admin/produk" element={<PackageManagement />} />
    <Route
      key="package-create"
      path="/admin/produk/create"
      element={<PackageForm />}
    />
    <Route
      key="package-edit"
      path="/admin/produk/edit/:id"
      element={<PackageForm />}
    />
    <Route
      key="package-detail"
      path="/admin/produk/detail/:id"
      element={<PackageDetailAdmin />}
    />
    <Route
      key="package-image"
      path="/admin/produk/:id/add-image"
      element={<AddPackageImage />}
    />
    <Route
      key="package-flight"
      path="/admin/produk/:id/add-flight"
      element={<AddPackageFlight />}
    />
    <Route
      key="package-itinerary"
      path="/admin/produk/:id/add-itinerary"
      element={<AddPackageItinerary />}
    />
    <Route
      key="package-hotel"
      path="/admin/produk/:id/add-hotel"
      element={<AddPackageHotel />}
    />
    <Route key="order" path="/admin/pemesanan" element={<OrderManagement />} />
    <Route
      key="order-create"
      path="/admin/pemesanan/create"
      element={<OrderForm />}
    />
    <Route
      key="order-detail"
      path="/admin/pemesanan/detail/:id"
      element={<OrderDetail />}
    />
  </Route>,
];

export default AdminRoutes;
