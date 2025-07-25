import AdminLayout from "../../../components/layout/AdminLayout";
import OrderDetail from "../../../components/common/OrderDetail";
import "./OrderDetailPrint.css";

const AdminOrderDetail = () => {
  return (
    <OrderDetail LayoutComponent={AdminLayout} backPath="/admin/pemesanan" />
  );
};

export default AdminOrderDetail;
