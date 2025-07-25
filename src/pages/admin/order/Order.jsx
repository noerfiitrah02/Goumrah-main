import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import SearchBar from "../../../components/ui/SearchBar";
import FilterGroup from "../../../components/ui/FilterGroup";
import HeaderSection from "../../../components/ui/HeaderSection";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import OrderActionButtons from "../../../components/ui/OrderActionButtons";
import FormatCurrency from "../../../components/common/FormatCurrency";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import api from "../../../utils/api";
import {
  FaCheck,
  FaTimes,
  FaBox,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    action: null,
    confirmText: "Ya, Lanjutkan",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const isInitialMount = useRef(true);
  const tableContainerRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        order_status: filters.status || undefined,
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get("/orders", { params });
      const responseData = response.data;
      setOrders(responseData.data || []);

      setTotalOrders(responseData.data?.length || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Gagal memuat data pemesanan");
      setOrders([]);
      setTotalOrders(0);
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
    fetchOrders();
  }, [fetchOrders, location, navigate]);

  const showConfirmationModal = (
    title,
    message,
    action,
    confirmText = "Ya, Lanjutkan",
  ) => {
    setModalConfig({
      title,
      message,
      action,
      confirmText,
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!modalConfig.action) return;
    setIsActionLoading(true);
    try {
      await modalConfig.action();
      fetchOrders();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setShowConfirmModal(false);
      setIsActionLoading(false);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedOrders.slice(startIndex, endIndex);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { order_status: status });
      toast.success("Status pemesanan berhasil diperbarui");
    } catch (error) {
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      toast.success("Pemesanan berhasil dihapus");
    } catch (error) {
      throw error;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Sudah Bayar",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Menunggu Pembayaran",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Batal" },
      failed: { bg: "bg-gray-100", text: "text-gray-800", label: "Gagal" },
    };

    const config = statusConfig[status] || statusConfig.failed;
    return (
      <span
        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getOrderActions = (order) => {
    const actions = [
      {
        type: "view",
        onClick: () => navigate(`/admin/pemesanan/detail/${order.id}`),
        color: "text-blue-500",
        title: "Detail",
      },
    ];

    if (order.order_status === "pending") {
      actions.push(
        {
          type: "confirm",
          onClick: () =>
            showConfirmationModal(
              "Konfirmasi Pembayaran",
              "Apakah Anda yakin ingin menandai pesanan ini sebagai LUNAS?",
              () => updateOrderStatus(order.id, "paid"),
              "Ya, Konfirmasi",
            ),
          color: "text-green-500",
          title: "Set Lunas",
          icon: <FaCheck />,
        },
        {
          type: "cancel",
          onClick: () =>
            showConfirmationModal(
              "Konfirmasi Pembatalan",
              "Apakah Anda yakin ingin membatalkan pesanan ini?",
              () => updateOrderStatus(order.id, "cancelled"),
              "Ya, Batalkan",
            ),
          color: "text-red-500",
          title: "Batalkan",
          icon: <FaTimes />,
        },
      );
    }

    actions.push({
      type: "delete",
      onClick: () =>
        showConfirmationModal(
          "Konfirmasi Hapus",
          "Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.",
          () => deleteOrder(order.id),
          "Ya, Hapus",
        ),
      color: "text-red-500",
      title: "Hapus",
    });

    return actions;
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
      status: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const filterConfig = [
    {
      name: "status",
      type: "select",
      icon: <FaFilter className="text-gray-400" />,
      options: [
        { value: "", label: "Semua Status" },
        { value: "pending", label: "Menunggu Pembayaran" },
        { value: "paid", label: "Sudah Bayar" },
        { value: "cancelled", label: "Batal" },
        { value: "failed", label: "Gagal" },
      ],
    },
    {
      name: "startDate",
      type: "date",
      icon: <FaCalendarAlt className="text-gray-400" />,
      placeholder: "Dari Tanggal",
    },
    {
      name: "endDate",
      type: "date",
      icon: <FaCalendarAlt className="text-gray-400" />,
      placeholder: "Sampai Tanggal",
    },
  ];

  // Table columns configuration
  const columns = [
    {
      key: "user",
      label: "User",
      sortable: false,
      render: (order) => (
        <div>
          <div className="text-sm text-gray-900">{order.user?.name || "-"}</div>
          <div className="text-sm text-gray-500">
            {order.user?.email || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "package",
      label: "Paket",
      sortable: false,
      render: (order) => (
        <div className="text-sm text-gray-900">
          {order.package?.name || "-"}
        </div>
      ),
    },
    {
      key: "total_price",
      label: "Total Harga",
      sortable: true,
      render: (order) => (
        <div className="text-sm text-gray-900">
          {FormatCurrency(order.total_price)}
        </div>
      ),
    },
    {
      key: "order_status",
      label: "Status",
      sortable: true,
      render: (order) => getStatusBadge(order.order_status),
    },
    {
      key: "actions",
      label: "Aksi",
      sortable: false,
      render: (order) => (
        <div className="flex items-center justify-end">
          <OrderActionButtons actions={getOrderActions(order)} />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Manajemen Pemesanan">
      <HeaderSection
        title="Kelola Pemesanan"
        description="Kelola semua pemesanan paket perjalanan"
        icon={<FaBox className="h-5 w-5 text-white" />}
        addButtonText="Buat Pemesanan"
        onAddClick={() => navigate("/admin/pemesanan/create")}
      />

      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama user atau paket..."
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
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data pemesanan
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={getPaginatedData()}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalOrders}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          showTotalInfo={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isConfirming={isActionLoading}
      />
    </AdminLayout>
  );
};

export default OrderManagement;
