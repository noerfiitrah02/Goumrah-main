import AddPackageImage from "../../../components/common/AddPackageImage";
import TravelLayout from "../../../components/layout/TravelLayout";

const AddPackageImageTravel = () => (
  <AddPackageImage
    LayoutComponent={TravelLayout}
    theme={{
      primary: "blue-600",
    }}
    basePath="/travel/produk/detail"
  />
);

export default AddPackageImageTravel;
