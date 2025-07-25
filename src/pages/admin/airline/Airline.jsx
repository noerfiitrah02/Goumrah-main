import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import api from "../../../utils/api";
import { FaPlane, FaImage } from "react-icons/fa";
import HeaderSection from "../../../components/ui/HeaderSection";
import SearchBar from "../../../components/ui/SearchBar";
import ActionButtons from "../../../components/ui/ActionButtons";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const AirlineManagement = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [airlineToDelete, setAirlineToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Gabungkan useEffect untuk menghindari konflik
  useEffect(() => {
    // Handle success message dari navigation state
    if (location.state?.successMessage && !toastShowRef.current) {
      toast.success(location.state.successMessage);
      toastShowRef.current = true;

      // Clear state setelah toast ditampilkan
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
        toastShowRef.current = false; // Reset untuk penggunaan selanjutnya
      }, 100);

      return () => clearTimeout(timer);
    }

    // Fetch airlines
    fetchAirlines();
  }, [location.state, searchTerm]); // Gabungkan dependencies

  const fetchAirlines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/airlines", { params });
      setAirlines(response.data.data);
    } catch (error) {
      console.error("Error fetching airlines:", error);
      toast.error("Gagal memuat data airline");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setAirlineToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/airlines/${airlineToDelete}`);
      toast.success("Airline berhasil dihapus");
      fetchAirlines();
    } catch (error) {
      console.error("Error deleting airline:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus airline");
    } finally {
      setShowDeleteModal(false);
      setAirlineToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAirlineToDelete(null);
  };

  const getAirlineActions = (airline) => [
    {
      type: "edit",
      color: "text-green-500",
      title: "Edit",
      onClick: () => navigate(`/admin/airline/edit/${airline.id}`),
    },
    {
      type: "delete",
      color: "text-red-500",
      title: "Hapus",
      onClick: () => handleDelete(airline.id),
    },
  ];

  return (
    <AdminLayout title="Manajemen Airline">
      <HeaderSection
        title="Kelola Maskapai Penerbangan"
        description="Kelola data maskapai penerbangan yang tersedia"
        icon={<FaPlane className="text-white" />}
        addButtonText="Tambah Airline"
        onAddClick={() => navigate("/admin/airline/create")}
      />

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Airline..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : airlines.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data maskapai penerbangan
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {airlines.map((airline) => (
              <div
                key={airline.id}
                className="rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="mb-3 h-20 w-20">
                    {airline.logo ? (
                      <img
                        className="h-full w-full rounded-full object-cover"
                        src={`${$BASE_URL}/${airline.logo}`}
                        alt={`Logo ${airline.name}`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
                        <FaImage className="text-2xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-center font-medium text-gray-900">
                    {airline.name}
                  </h3>
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <ActionButtons actions={getAirlineActions(airline)} />
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
        message="Apakah Anda yakin ingin menghapus maskapai ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default AirlineManagement;
