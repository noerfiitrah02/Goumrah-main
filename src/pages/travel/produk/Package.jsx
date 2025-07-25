import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import TravelLayout from "../../../components/layout/TravelLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import SearchBar from "../../../components/ui/SearchBar";
import ActionButtons from "../../../components/ui/ActionButtons";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import api from "../../../utils/api";
import { FaBox, FaPlus } from "react-icons/fa";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
  }, [searchTerm, sortConfig, currentPage, itemsPerPage]);

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
        show_only_mine: "true",
      };

      const response = await api.get("/packages/my-packages", { params });
      let data = response.data.data;
      setTotalPackages(response.data.meta?.total || data.length);

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
      key: "departure_date",
      label: "Tanggal Keberangkatan",
      sortable: true,
      render: (row) => new Date(row.departure_date).toLocaleDateString(),
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
      key: "actions",
      label: "Aksi",
      render: (row) => (
        <ActionButtons
          actions={[
            {
              type: "view",
              onClick: (e) => {
                e.stopPropagation();
                navigate(`/travel/produk/${row.id}`);
              },
              color: "text-blue-500",
              title: "Detail",
            },
            {
              type: "edit",
              onClick: (e) => {
                e.stopPropagation();
                navigate(`/travel/produk/edit/${row.id}`);
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
    <TravelLayout title="Daftar Paket">
      {/* Header khusus untuk travel agent */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
            <FaBox className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daftar Paket</h2>
            <p className="text-sm text-gray-500">
              Kelola paket perjalanan yang tersedia
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/travel/produk/create")}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FaPlus /> Tambah Paket
        </button>
      </div>

      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari Paket..."
        />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner color="border-blue-500" />
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
            onRowClick={(row) => navigate(`/travel/produk/detail/${row.id}`)}
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
    </TravelLayout>
  );
};

export default Packages;
