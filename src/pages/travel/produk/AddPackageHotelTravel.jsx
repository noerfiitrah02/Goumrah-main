import AddPackageHotel from "../../../components/common/AddPackageHotel";
import TravelLayout from "../../../components/layout/TravelLayout";

const AddPackageHotelTravel = () => (
  <AddPackageHotel
    LayoutComponent={TravelLayout}
    theme={{
      primary: "blue-600",
    }}
    basePath="/travel/produk/detail"
  />
);

export default AddPackageHotelTravel;
