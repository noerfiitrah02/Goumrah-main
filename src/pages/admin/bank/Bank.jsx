import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaUniversity } from "react-icons/fa";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import HeaderSection from "../../../components/ui/HeaderSection";
import SearchBar from "../../../components/ui/SearchBar";
import ActionButtons from "../../../components/ui/ActionButtons";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const BankManagement = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bankToDelete, setBankToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const loadingTimerRef = useRef(null);
  const isInitialLoad = useRef(true);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Gabungkan useEffect untuk menghindari konflik
  useEffect(() => {
    if (location.state?.successMessage && !toastShowRef.current) {
      toast.success(location.state.successMessage);
      toastShowRef.current = true;

      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
        toastShowRef.current = false;
      }, 100);

      return () => clearTimeout(timer);
    }

    fetchBanks();

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [location.state, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBanks = async () => {
    // Set timer untuk menunda munculnya loader (300ms)
    loadingTimerRef.current = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/banks", { params });
      setBanks(response.data.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Gagal memuat data bank");
    } finally {
      // Clear timer dan set loading ke false
      clearTimeout(loadingTimerRef.current);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setBankToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/banks/${bankToDelete}`);
      toast.success("Bank berhasil dihapus");
      fetchBanks();
    } catch (error) {
      console.error("Error deleting bank:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus bank");
    } finally {
      setShowDeleteModal(false);
      setBankToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBankToDelete(null);
  };

  const getBankActions = (bank) => [
    {
      type: "edit",
      color: "text-green-500",
      title: "Edit",
      onClick: () => navigate(`/admin/bank/edit/${bank.id}`),
    },
    {
      type: "delete",
      color: "text-red-500",
      title: "Hapus",
      onClick: () => handleDelete(bank.id),
    },
  ];

  return (
    <AdminLayout title="Manajemen Bank">
      <HeaderSection
        title="Kelola Bank"
        description="Kelola data bank yang tersedia untuk pembayaran"
        icon={<FaUniversity className="text-white" />}
        addButtonText="Tambah Bank"
        onAddClick={() => navigate("/admin/bank/create")}
      />

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Bank..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : banks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data bank
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-3 h-20 w-20">
                    {bank.logo ? (
                      <img
                        className="h-full w-full rounded-lg bg-gray-50 object-contain p-2"
                        src={`${$BASE_URL}/${bank.logo}`}
                        alt={`Logo ${bank.bank_name}`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200">
                        <FaUniversity className="text-2xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-center font-medium text-gray-900">
                    {bank.bank_name}
                  </h3>
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <ActionButtons actions={getBankActions(bank)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus bank ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default BankManagement;
