import PackageDetail from "../../../components/common/PackageDetail";
import TravelLayout from "../../../components/layout/TravelLayout";

const PackageDetailTravel = () => (
  <PackageDetail
    LayoutComponent={TravelLayout}
    theme={{
      primary: "blue-600",
      primaryHover: "blue-700",
      secondary: "blue-100",
    }}
    basePath="/travel/produk"
  />
);

export default PackageDetailTravel;
