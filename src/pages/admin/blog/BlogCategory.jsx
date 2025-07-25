import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import api from "../../../utils/api";
import { FaFolder } from "react-icons/fa";
import HeaderSection from "../../../components/ui/HeaderSection";
import SearchBar from "../../../components/ui/SearchBar";
import ActionButtons from "../../../components/ui/ActionButtons";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const BlogCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "postCount",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const isInitialMount = useRef(true);
  const tableContainerRef = useRef(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/blogs/categories", { params });
      const responseData = response.data;
      setCategories(responseData.data || []);
      setTotalCategories(responseData.data?.length || 0);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      toast.error("Gagal memuat data kategori blog");
      setCategories([]);
      setTotalCategories(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (location.state?.successMessage && !toastShowRef.current) {
      toast.success(location.state.successMessage);
      toastShowRef.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = (slug) => {
    setCategoryToDelete(slug);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/blogs/categories/${categoryToDelete}`);
      toast.success("Kategori berhasil dihapus");
      fetchCategories();
      // Reset to first page if current page becomes empty
      if (currentPage > 1 && categories.length === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal menghapus kategori";
      toast.error(errorMessage);
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

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = useMemo(() => {
    let sortableItems = [...categories];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [categories, sortConfig]);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCategories.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Scroll to table when page changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const totalPages = Math.ceil(totalCategories / itemsPerPage);

  const getCategoryActions = (category) => [
    {
      type: "edit",
      color: "text-green-500",
      title: "Edit",
      onClick: () => navigate(`/admin/kategori-blog/edit/${category.slug}`),
    },
    {
      type: "delete",
      color: "text-red-500",
      title: "Hapus",
      onClick: () => handleDelete(category.slug),
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Nama Kategori",
      sortable: true,
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.slug}</div>
        </div>
      ),
    },
    {
      key: "postCount",
      label: "Jumlah Postingan",
      sortable: true,
    },
    {
      key: "actions",
      label: "Aksi",
      render: (row) => <ActionButtons actions={getCategoryActions(row)} />,
    },
  ];

  return (
    <AdminLayout title="Manajemen Kategori Blog">
      <HeaderSection
        title="Kelola Kategori Blog"
        description="Kelola kategori untuk postingan blog"
        icon={<FaFolder className="h-5 w-5 text-white" />}
        addButtonText="Tambah Kategori"
        onAddClick={() => navigate("/admin/kategori-blog/create")}
      />

      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari Kategori..."
        />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data kategori
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={getPaginatedData()}
              sortConfig={sortConfig}
              onSort={requestSort}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && categories.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
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
        message="Apakah Anda yakin ingin menghapus kategori ini? Kategori yang memiliki postingan tidak dapat dihapus."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default BlogCategoryManagement;
