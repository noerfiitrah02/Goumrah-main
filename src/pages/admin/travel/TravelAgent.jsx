import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import api from "../../../utils/api";
import SearchBar from "../../../components/ui/SearchBar";
import FilterGroup from "../../../components/ui/FilterGroup";
import HeaderSection from "../../../components/ui/HeaderSection";
import ActionButtons from "../../../components/ui/ActionButtons";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { FaBuilding, FaFilter, FaImage } from "react-icons/fa";

const TravelAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalAgents, setTotalAgents] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const tableContainerRef = useRef(null);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get("/travel", { params });
      setAgents(response.data.data);
      setTotalAgents(response.data.data?.length || 0);
    } catch (error) {
      console.error("Error fetching travel agents:", error);
      toast.error("Gagal memuat data agen perjalanan");
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
    fetchAgents();
  }, [searchTerm, statusFilter, currentPage, itemsPerPage, navigate, location]);

  useEffect(() => {
    tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const handleDelete = (id) => {
    setAgentToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/travel/${agentToDelete}`);
      toast.success("Agen perjalanan berhasil dihapus");
      fetchAgents();
    } catch (error) {
      console.error("Error deleting travel agent:", error);
      toast.error(
        error.response?.data?.message || "Gagal menghapus agen perjalanan",
      );
    } finally {
      setShowDeleteModal(false);
      setAgentToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAgentToDelete(null);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      setAgents(
        agents.map((agent) =>
          agent.user.id === userId
            ? { ...agent, user: { ...agent.user, status: newStatus } }
            : agent,
        ),
      );
      toast.success("Status agen berhasil diperbarui");
    } catch (error) {
      console.error("Error updating agent status:", error);
      toast.error("Gagal memperbarui status agen");
      fetchAgents();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const filterConfig = [
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

  const columns = [
    {
      key: "logo_name",
      label: "Logo/Nama",
      render: (row) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {row.logo ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={`${$BASE_URL}/${row.logo}`}
                alt={`Logo ${row.travel_name}`}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <FaImage className="text-gray-500" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.travel_name}
            </div>
            <div className="text-sm text-gray-500">{row.user?.name || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "company_info",
      label: "Info Perusahaan",
      render: (row) => (
        <>
          <div className="text-sm text-gray-900">{row.company_name}</div>
          <div className="text-sm text-gray-500">
            SK: {row.sk_number || "-"}
          </div>
        </>
      ),
    },
    {
      key: "contact",
      label: "Kontak",
      render: (row) => (
        <>
          <div className="text-sm text-gray-900">{row.email}</div>
          <div className="text-sm text-gray-500">{row.phone_number || "-"}</div>
        </>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.user?.status || ""}
          onChange={(e) => handleStatusChange(row.user.id, e.target.value)}
          className={`rounded-full px-2 text-xs leading-5 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none ${
            row.user?.status === "active"
              ? "bg-green-100 text-green-800"
              : row.user?.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
          <option value="pending">Pending</option>
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
              type: "edit",
              onClick: () => navigate(`/admin/travel/edit/${row.id}`),
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

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <AdminLayout title="Manajemen Travel Agent">
      <HeaderSection
        title="Kelola Travel Agent"
        description="Kelola data Travel agent yang terdaftar di sistem"
        icon={<FaBuilding className="text-white" />}
        addButtonText="Tambah Agen"
        onAddClick={() => navigate("/admin/travel/create")}
      />

      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Travel Agent..."
          />
          <FilterGroup
            filters={{ status: statusFilter }}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            filterConfig={filterConfig}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data agen perjalanan
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={agents}
            sortConfig={{ key: null, direction: "asc" }}
            onSort={() => {}}
          />
        )}
      </div>

      {!loading && agents.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalAgents / itemsPerPage)}
          totalItems={totalAgents}
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
        message="Apakah Anda yakin ingin menghapus Travel Agent ini?"
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default TravelAgent;
