import { Route } from "react-router-dom";
import Product from "../pages/mainpage/product/Product";
import { lazy } from "react";

import { Tabungan } from "../pages/mainpage/Tabungan";
import Blog from "../pages/mainpage/Blog";
import { Kontak } from "../pages/mainpage/Kontak";
import { Home } from "../pages/mainpage/Home";
import { ProductDetail } from "../pages/mainpage/product-detail/ProductDetail";
import ProductOrder from "../pages/mainpage/product-order/ProductOrder";
import MyOrders from "../pages/mainpage/MyOrder";
import BlogDetail from "../pages/mainpage/BlogDetail";
import TravelAgentInfo from "../pages/mainpage/TravelAgentInfo/TravelAgentInfo";
const ToRegistration = lazy(() => import("../pages/mainpage/ToRegistration"));

const PublicRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="produk" path="/produk" element={<Product />} />,
  <Route
    key="produk-detail"
    path="/produk/detail/:id"
    element={<ProductDetail />}
  />,

  <Route
    key="produk-order"
    path="/produk/order/:id"
    element={<ProductOrder />}
  />,
  <Route
    key="travel-agent"
    path="/travel-info/:id"
    element={<TravelAgentInfo />}
  />,
  <Route key="keranjang" path="/keranjang" element={<MyOrders />} />,
  <Route key="tabungan" path="/tabungan" element={<Tabungan />} />,
  <Route key="blog" path="/blog" element={<Blog />} />,
  <Route
    key="blog-detail"
    path="/blog/:categorySlug/:postSlug"
    element={<BlogDetail />}
  />,
  <Route key="kontak" path="/kontak" element={<Kontak />} />,
  <Route key="daftar" path="/daftar" element={<ToRegistration />} />,
];

export default PublicRoutes;
