import AddPackageItinerary from "../../../components/common/AddPackageItinerary";
import TravelLayout from "../../../components/layout/TravelLayout";

const AddPackageItineraryTravel = () => (
  <AddPackageItinerary
    LayoutComponent={TravelLayout}
    theme={{
      primary: "blue-600",
    }}
    basePath="/travel/produk/detail"
  />
);

export default AddPackageItineraryTravel;
