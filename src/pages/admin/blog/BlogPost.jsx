import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import api from "../../../utils/api";
import { FaFilter, FaStar } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import SearchBar from "../../../components/ui/SearchBar";
import HeaderSection from "../../../components/ui/HeaderSection";
import SearchableSelect from "../../../components/ui/SearchableSelect";
import ActionButtons from "../../../components/ui/ActionButtons";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const BlogPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category_slug: "",
    status: "",
    is_featured: "",
    tag_slug: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const isInitialMount = useRef(true);
  const tableContainerRef = useRef(null);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        category_slug: filters.category_slug || undefined,
        status: filters.status || undefined,
        is_featured: filters.is_featured || undefined,
        tag_slug: filters.tag_slug || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get("/blogs", { params });
      const responseData = response.data;
      setPosts(responseData.data || []);
      setTotalPosts(responseData.data?.length || 0);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Gagal memuat data postingan blog");
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    if (location.state?.successMessage && !toastShowRef.current) {
      toast.success(location.state.successMessage);
      toastShowRef.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blogs/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get("/blogs/tags");
      setAvailableTags(response.data.data);
    } catch (error) {
      console.error("Error fetching blog tags:", error);
    }
  };

  const handleDelete = (categorySlug, postSlug) => {
    setPostToDelete({ categorySlug, postSlug });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(
        `/blogs/${postToDelete.categorySlug}/${postToDelete.postSlug}`,
      );
      toast.success("Postingan berhasil dihapus");
      fetchPosts();
      // Reset to first page if current page becomes empty
      if (currentPage > 1 && posts.length === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus postingan");
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const toggleFeatured = async (categorySlug, postSlug, currentStatus) => {
    try {
      await api.put(`/blogs/${categorySlug}/${postSlug}/featured`);
      toast.success(
        `Postingan ${currentStatus ? "dihapus dari" : "ditambahkan ke"} featured`,
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.slug === postSlug && post.category.slug === categorySlug
            ? { ...post, is_featured: !post.is_featured }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error(error.response?.data?.message || "Gagal mengubah status");
    }
  };

  const resetFilters = () => {
    setFilters({
      category_slug: "",
      status: "",
      is_featured: "",
      tag_slug: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPosts = useMemo(() => {
    let sortableItems = [...posts];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === "category") {
          aValue = a.category?.name || "";
          bValue = b.category?.name || "";
        } else if (sortConfig.key === "createdAt") {
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
        }

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
  }, [posts, sortConfig]);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPosts.slice(startIndex, endIndex);
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

  const totalPages = Math.ceil(totalPosts / itemsPerPage);

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getPostActions = (post) => [
    {
      type: "view",
      color: "text-blue-500",
      title: "Lihat",
      onClick: () =>
        navigate(`/blog/${post.category.slug}/${post.slug}`, {
          state: { fromAdmin: true },
        }),
    },
    {
      type: "edit",
      color: "text-green-500",
      title: "Edit",
      onClick: () =>
        navigate(`/admin/blog-posts/edit/${post.category.slug}/${post.slug}`),
    },
    {
      type: "delete",
      color: "text-red-500",
      title: "Hapus",
      onClick: () => handleDelete(post.category.slug, post.slug),
    },
  ];

  const columns = [
    {
      key: "title",
      label: "Judul",
      sortable: true,
      render: (post) => (
        <div className="flex max-w-xs items-center">
          {post.featured_image && (
            <div className="h-10 w-10 flex-shrink-0">
              <img
                className="h-10 w-10 rounded object-cover"
                src={`${$BASE_URL}/${post.featured_image}`}
                alt={post.title}
              />
            </div>
          )}
          <div className="ml-4 min-w-0 flex-1">
            <div
              className="truncate text-sm font-medium text-gray-900"
              title={post.title}
            >
              {post.title}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategori/Status",
      sortable: true,
      render: (post) => (
        <div className="whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {post.category?.name || "-"}
          </div>
          <div
            className={`text-xs ${
              post.status === "published" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {capitalizeFirstLetter(post.status)}
          </div>
        </div>
      ),
    },
    {
      key: "tags",
      label: "Tags",
      sortable: false,
      render: (post) => {
        const maxVisibleTags = 2;
        const visibleTags = post.tags?.slice(0, maxVisibleTags) || [];
        const hiddenTagsCount =
          post.tags?.length > maxVisibleTags
            ? post.tags.length - maxVisibleTags
            : 0;
        const allTagNames = post.tags?.map((tag) => tag.name).join(", ");

        return (
          <div
            className="flex flex-wrap items-center gap-1"
            title={allTagNames}
          >
            {visibleTags.map((tag) => (
              <span
                key={tag.slug}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
              >
                {tag.name}
              </span>
            ))}
            {hiddenTagsCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                +{hiddenTagsCount}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "is_featured",
      label: "Featured",
      sortable: true,
      render: (post) => (
        <div className="whitespace-nowrap">
          <button
            onClick={() =>
              toggleFeatured(post.category.slug, post.slug, post.is_featured)
            }
            className={`rounded-full p-1 ${
              post.is_featured ? "text-yellow-400" : "text-gray-300"
            }`}
            title={
              post.is_featured ? "Hapus dari featured" : "Tambahkan ke featured"
            }
          >
            <FaStar className="h-5 w-5" />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (post) => <ActionButtons actions={getPostActions(post)} />,
    },
  ];

  return (
    <AdminLayout title="Manajemen Postingan Blog">
      <HeaderSection
        title="Kelola Postingan Blog"
        description="Kelola semua postingan blog di sistem"
        icon={<FiBook className="text-lg text-white" />}
        addButtonText="Tambah Postingan"
        onAddClick={() => navigate("/admin/blog-posts/create")}
      />
      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
          {/* Search Bar */}
          <div className="flex-grow lg:min-w-[300px]">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Postingan..."
            />
          </div>

          {/* Filter Controls - Inline */}
          <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
            {/* Category Filter */}
            <div className="w-full min-w-[150px] sm:w-auto">
              <SearchableSelect
                name="category_slug"
                options={[
                  { value: "", label: "Semua Kategori" },
                  ...categories.map((category) => ({
                    value: category.slug,
                    label: category.name,
                  })),
                ]}
                value={filters.category_slug}
                onChange={handleFilterChange}
                placeholder="Pilih Kategori"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full min-w-[150px] sm:w-auto">
              <SearchableSelect
                name="status"
                options={[
                  { value: "", label: "Semua Status" },
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
                value={filters.status}
                onChange={handleFilterChange}
                placeholder="Pilih Status"
              />
            </div>

            {/* Featured Filter */}
            <div className="w-full min-w-[150px] sm:w-auto">
              <SearchableSelect
                name="is_featured"
                options={[
                  { value: "", label: "Semua" },
                  { value: "true", label: "Featured" },
                  { value: "false", label: "Non-Featured" },
                ]}
                value={filters.is_featured}
                onChange={handleFilterChange}
                placeholder="Pilih Tipe"
              />
            </div>

            {/* Tag Filter */}
            <div className="w-full min-w-[150px] sm:w-auto">
              <SearchableSelect
                name="tag_slug"
                options={[
                  { value: "", label: "Semua Tag" },
                  ...availableTags.map((tag) => ({
                    value: tag.slug,
                    label: tag.name,
                  })),
                ]}
                value={filters.tag_slug}
                onChange={handleFilterChange}
                placeholder="Filter berdasarkan tag"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data postingan
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
      {!loading && posts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalPosts}
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
        message="Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan."
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default BlogPostManagement;
