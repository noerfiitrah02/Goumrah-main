import AddPackageItinerary from "../../../components/common/AddPackageItinerary";
import AdminLayout from "../../../components/layout/AdminLayout";

const AddPackageItineraryAdmin = () => (
  <AddPackageItinerary
    LayoutComponent={AdminLayout}
    theme={{
      primary: "green-600",
    }}
    basePath="/admin/produk/detail"
    showBackIcon
    showSaveIcon
  />
);

export default AddPackageItineraryAdmin;
