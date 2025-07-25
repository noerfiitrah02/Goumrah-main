import AddPackageFlight from "../../../components/common/AddPackageFlight";
import TravelLayout from "../../../components/layout/TravelLayout";

const AddPackageFlightTravel = () => (
  <AddPackageFlight
    LayoutComponent={TravelLayout}
    theme={{
      primary: "blue-600",
    }}
    basePath="/travel/produk/detail"
  />
);

export default AddPackageFlightTravel;
