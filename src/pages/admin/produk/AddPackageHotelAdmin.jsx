import AddPackageHotel from "../../../components/common/AddPackageHotel";
import AdminLayout from "../../../components/layout/AdminLayout";

const AddPackageHotelAdmin = () => (
  <AddPackageHotel
    LayoutComponent={AdminLayout}
    theme={{
      primary: "green-600",
      primaryHover: "green-700",
    }}
    basePath="/admin/produk/detail"
    showBackIcon
    showSaveIcon
  />
);

export default AddPackageHotelAdmin;
