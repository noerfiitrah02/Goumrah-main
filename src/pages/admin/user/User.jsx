import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import SearchBar from "../../../components/ui/SearchBar";
import FilterGroup from "../../../components/ui/FilterGroup";
import HeaderSection from "../../../components/ui/HeaderSection";
import ActionButtons from "../../../components/ui/ActionButtons";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { FaUserCircle, FaFilter } from "react-icons/fa";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const tableContainerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
      };
      if (searchTerm) params.search = searchTerm;
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;

      const response = await api.get("/users", { params });
      setUsers(response.data.data);
      setTotalUsers(response.data.data?.length || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.successMessage && !toastShowRef.current) {
      toast.success(location.state.successMessage);
      toastShowRef.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
    fetchUsers();
  }, [searchTerm, filters, currentPage, itemsPerPage, navigate, location]);

  useEffect(() => {
    tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  // Filter configuration
  const filterConfig = [
    {
      name: "role",
      type: "select",
      icon: <FaFilter className="text-gray-400" />,
      options: [
        { value: "", label: "Semua Role" },
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
        { value: "travel_agent", label: "Travel Agent" },
      ],
    },
    {
      name: "status",
      type: "select",
      icon: <FaFilter className="text-gray-400" />,
      options: [
        { value: "", label: "Semua Status" },
        { value: "active", label: "Aktif" },
        { value: "inactive", label: "Nonaktif" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  // Table columns configuration
  const columns = [
    {
      key: "name",
      label: "Nama",
      sortable: true,
      render: (user) => (
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <span className="text-sm font-medium text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">
              {user.phone_number || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (user) => (
        <div className="text-sm text-gray-900">{user.email}</div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (user) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : user.role === "travel_agent"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {user.role === "admin"
            ? "Admin"
            : user.role === "travel_agent"
              ? "Travel Agent"
              : "User"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (user) => {
        // Jika role admin, tampilkan badge status saja
        if (user.role === "admin") {
          return (
            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
              Aktif
            </span>
          );
        }

        // Untuk role lain, tampilkan dropdown
        return (
          <select
            value={user.status}
            onChange={(e) => handleStatusChange(user.id, e.target.value)}
            className={`rounded-full px-2 text-xs leading-5 font-semibold focus:ring-1 focus:ring-green-500 focus:outline-none ${
              user.status === "active"
                ? "bg-green-100 text-green-800"
                : user.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
            <option value="pending">Pending</option>
          </select>
        );
      },
    },
    {
      key: "actions",
      label: "Aksi",
      render: (user) => (
        <ActionButtons
          actions={[
            {
              type: "edit",
              onClick: () => navigate(`/admin/user/edit/${user.id}`),
              color: "text-green-500",
              title: "Edit",
            },
            ...(user.role === "user"
              ? [
                  {
                    type: "delete",
                    onClick: () => handleDelete(user.id),
                    color: "text-red-500",
                    title: "Hapus",
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  const handleDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/users/${userToDelete}`);
      toast.success("Pengguna berhasil dihapus");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus pengguna");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user,
        ),
      );
      toast.success("Status pengguna berhasil diperbarui");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Gagal memperbarui status pengguna");
      fetchUsers();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterReset = () => {
    setFilters({
      role: "",
      status: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort users based on sortConfig (client-side sorting for current page)
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <AdminLayout title="Manajemen Pengguna">
      <HeaderSection
        title="Kelola Pengguna"
        description="Kelola akun pengguna dan atur hak akses sistem"
        icon={<FaUserCircle className="text-white" />}
        addButtonText="Tambah Pengguna"
        onAddClick={() => navigate("/admin/user/create")}
      />

      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pengguna..."
          />
          <FilterGroup
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
            filterConfig={filterConfig}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data pengguna
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedUsers}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </div>

      {!loading && users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalUsers / itemsPerPage)}
          totalItems={totalUsers}
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
        message="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default User;
