import AddPackageImage from "../../../components/common/AddPackageImage";
import AdminLayout from "../../../components/layout/AdminLayout";

const AddPackageImageAdmin = () => (
  <AddPackageImage
    LayoutComponent={AdminLayout}
    theme={{
      primary: "green-600",
    }}
    basePath="/admin/produk/detail"
  />
);

export default AddPackageImageAdmin;
