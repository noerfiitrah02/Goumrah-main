import TravelLayout from "../../../components/layout/TravelLayout";
import OrderDetail from "../../../components/common/OrderDetail";
import "./OrderDetailPrint.css";

const TravelOrderDetail = () => {
  return (
    <OrderDetail LayoutComponent={TravelLayout} backPath="/travel/orders" />
  );
};

export default TravelOrderDetail;
