import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import HeaderSection from "../../../components/ui/HeaderSection";
import SearchBar from "../../../components/ui/SearchBar";
import DataTable from "../../../components/ui/DataTable";
import ActionButtons from "../../../components/ui/ActionButtons";
import Pagination from "../../../components/ui/Pagination";
import { FaBoxOpen } from "react-icons/fa";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const PackageCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  const tableContainerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);

  useEffect(() => {
    if (location.state?.successMessage && !toastShowRef.current) {
      toast.success(location.state.successMessage);
      toastShowRef.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
    fetchCategories();
  }, [searchTerm, currentPage, itemsPerPage, navigate, location]);

  useEffect(() => {
    tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
      };
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/package-categories", { params });
      setCategories(response.data.data);
      setTotalCategories(response.data.data?.length || 0);
    } catch (error) {
      console.error("Error fetching package categories:", error);
      toast.error("Gagal memuat data kategori paket");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/package-categories/${categoryToDelete}`);
      toast.success("Kategori berhasil dihapus");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus kategori");
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
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
      label: "Nama Kategori",
      render: (row) => (
        <div className="text-sm font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (row) => (
        <ActionButtons
          actions={[
            {
              type: "edit",
              onClick: () => navigate(`/admin/kategori-produk/edit/${row.id}`),
              color: "text-green-500",
              title: "Edit",
            },
            {
              type: "delete",
              onClick: () => handleDelete(row.id),
              color: "text-red-500",
              title: "Hapus",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Manajemen Kategori Paket">
      <HeaderSection
        title="Kelola Kategori Paket"
        description="Kelola kategori untuk paket perjalanan"
        icon={<FaBoxOpen className="text-white" />}
        addButtonText="Tambah Kategori"
        onAddClick={() => navigate("/admin/kategori-produk/create")}
      />

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
            placeholder="Cari Kategori..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data kategori
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={categories}
            sortConfig={{ key: null, direction: "asc" }}
            onSort={() => {}}
          />
        )}
      </div>

      {!loading && categories.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCategories / itemsPerPage)}
          totalItems={totalCategories}
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
        message="Apakah Anda yakin ingin menghapus kategori ini? Kategori yang memiliki paket tidak dapat dihapus."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default PackageCategoryManagement;
