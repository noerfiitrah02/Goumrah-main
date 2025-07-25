import AddPackageFlight from "../../../components/common/AddPackageFlight";
import AdminLayout from "../../../components/layout/AdminLayout";

const AddPackageFlightAdmin = () => (
  <AddPackageFlight
    LayoutComponent={AdminLayout}
    theme={{
      primary: "green-600",
    }}
    basePath="/admin/produk/detail"
    showBackIcon
    showSaveIcon
  />
);

export default AddPackageFlightAdmin;
