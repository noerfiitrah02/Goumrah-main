import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import api from "../../../utils/api";
import { FaTags } from "react-icons/fa";
import HeaderSection from "../../../components/ui/HeaderSection";
import SearchBar from "../../../components/ui/SearchBar";
import ActionButtons from "../../../components/ui/ActionButtons";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const BlogTagManagement = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "postCount",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalTags, setTotalTags] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const isInitialMount = useRef(true);
  const tableContainerRef = useRef(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/blogs/tags", { params });
      const responseData = response.data;
      setTags(responseData.data || []);
      setTotalTags(responseData.data?.length || 0);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data tag blog");
      setTags([]);
      setTotalTags(0);
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
    fetchTags();
  }, [fetchTags]);

  const handleDelete = (slug) => {
    setTagToDelete(slug);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/blogs/tags/${tagToDelete}`);
      toast.success("Tag berhasil dihapus");
      fetchTags();
      // Reset to first page if current page becomes empty
      if (currentPage > 1 && tags.length === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus tag");
    } finally {
      setShowDeleteModal(false);
      setTagToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTagToDelete(null);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTags = useMemo(() => {
    let sortableItems = [...tags];
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
  }, [tags, sortConfig]);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedTags.slice(startIndex, endIndex);
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

  const totalPages = Math.ceil(totalTags / itemsPerPage);

  const getTagActions = (tag) => [
    {
      type: "edit",
      color: "text-green-500",
      title: "Edit",
      onClick: () => navigate(`/admin/blog-tags/edit/${tag.slug}`),
    },
    {
      type: "delete",
      color: "text-red-500",
      title: "Hapus",
      onClick: () => handleDelete(tag.slug),
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Nama Tag",
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
      render: (row) => <ActionButtons actions={getTagActions(row)} />,
    },
  ];

  return (
    <AdminLayout title="Manajemen Tag Blog">
      <HeaderSection
        title="Kelola Tag Blog"
        description="Kelola tag untuk postingan blog"
        icon={<FaTags className="h-5 w-5 text-white" />}
        addButtonText="Tambah Tag"
        onAddClick={() => navigate("/admin/blog-tags/create")}
      />

      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari Tag..."
        />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : tags.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data tag
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
      {!loading && tags.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalTags}
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
        message="Apakah Anda yakin ingin menghapus tag ini?"
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default BlogTagManagement;
