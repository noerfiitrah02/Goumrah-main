import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import SearchBar from "../../../components/ui/SearchBar";
import ActionButtons from "../../../components/ui/ActionButtons";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import api from "../../../utils/api";
import { FaBox, FaStar, FaPlus } from "react-icons/fa";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPackages, setTotalPackages] = useState(0);
  const tableContainerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    fetchPackages();
  }, [searchTerm, featuredFilter, sortConfig, currentPage, itemsPerPage]);

  useEffect(() => {
    tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm,
      };

      if (featuredFilter !== "all") {
        params.is_featured = featuredFilter;
      }

      const response = await api.get("/packages", { params });
      let data = response.data.data;
      setTotalPackages(response.data.data?.length || 0);

      // Apply client-side sorting if needed
      if (sortConfig.key) {
        data = [...data].sort((a, b) => {
          const aValue = a[sortConfig.key] || "";
          const bValue = b[sortConfig.key] || "";
          if (sortConfig.direction === "asc") {
            return aValue > bValue ? 1 : -1;
          }
          return aValue < bValue ? 1 : -1;
        });
      }

      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Gagal memuat data paket");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setPackageToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/packages/${packageToDelete}`);
      toast.success("Paket berhasil dihapus");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus paket.");
    } finally {
      setShowDeleteModal(false);
      setPackageToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPackageToDelete(null);
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await api.put(`/packages/${id}/featured`, {
        is_featured: !currentStatus,
      });
      toast.success(
        `Paket ${currentStatus ? "dihapus dari" : "ditambahkan ke"} featured`,
      );
      setPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === id ? { ...pkg, is_featured: !pkg.is_featured } : pkg,
        ),
      );
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error(error.response?.data?.message || "Gagal mengubah status");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/packages/${id}/status`, { status });
      toast.success("Status paket berhasil diubah");
      setPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === id ? { ...pkg, status: status } : pkg,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Gagal mengubah status");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "name",
      label: "Nama Paket",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              className="h-10 w-10 rounded-md object-cover"
              src={`${BASE_URL}/${row.featured_image}`}
              alt={row.name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.duration} hari</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      sortable: true,
      render: (row) => row.category?.name || "-",
    },
    {
      key: "creator",
      label: "Creator",
      sortable: true,
      render: (row) => row.creator.name,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateStatus(row.id, e.target.value)}
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            row.status === "published"
              ? "bg-green-100 text-green-800"
              : row.status === "draft"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      ),
    },
    {
      key: "is_featured",
      label: "Featured",
      sortable: true,
      render: (row) => (
        <div className="whitespace-nowrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFeatured(row.id, row.is_featured);
            }}
            className={`rounded-full p-1 ${
              row.is_featured ? "text-yellow-400" : "text-gray-300"
            }`}
            title={
              row.is_featured ? "Hapus dari featured" : "Tambahkan ke featured"
            }
          >
            <FaStar className="h-5 w-5 text-center" />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (row) => (
        <ActionButtons
          actions={[
            {
              type: "view",
              onClick: (e) => {
                e.stopPropagation();
                navigate(`/admin/produk/detail/${row.id}`);
              },
              color: "text-blue-500",
              title: "Detail",
            },
            {
              type: "edit",
              onClick: (e) => {
                e.stopPropagation();
                navigate(`/admin/produk/edit/${row.id}`);
              },
              color: "text-green-500",
              title: "Edit",
            },
            {
              type: "delete",
              onClick: (e) => {
                e.stopPropagation();
                handleDelete(row.id);
              },
              color: "text-red-500",
              title: "Hapus",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Manajemen Paket">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
            <FaBox className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Produk</h2>
            <p className="text-sm text-gray-500">
              Kelola paket perjalanan yang tersedia
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/produk/create")}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          <FaPlus /> Tambah Paket
        </button>
      </div>
      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari Paket..."
          />
          <div className="flex-none">
            <select
              className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-3 focus:border-blue-500 focus:outline-none md:w-auto"
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Semua Status Featured</option>
              <option value="true">Featured</option>
              <option value="false">Normal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : packages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data paket
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={packages}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={(row) => navigate(`/admin/produk/detail/${row.id}`)}
          />
        )}
      </div>

      {!loading && packages.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPackages / itemsPerPage)}
          totalItems={totalPackages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          showTotalInfo={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default PackageManagement;
