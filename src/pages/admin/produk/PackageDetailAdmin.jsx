import PackageDetail from "../../../components/common/PackageDetail";
import AdminLayout from "../../../components/layout/AdminLayout";

const PackageDetailAdmin = () => (
  <PackageDetail
    LayoutComponent={AdminLayout}
    theme={{
      primary: "green-600",
      secondary: "green-100",
    }}
    basePath="/admin/produk"
    showCreator
    showFeatured
    showAddButton={false}
  />
);

export default PackageDetailAdmin;
