import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import api from "../../../utils/api";
import { FaHotel, FaImage, FaFilter, FaStar } from "react-icons/fa";
import HeaderSection from "../../../components/ui/HeaderSection";
import SearchBar from "../../../components/ui/SearchBar";
import FilterGroup from "../../../components/ui/FilterGroup";
import DataTable from "../../../components/ui/DataTable";
import ActionButtons from "../../../components/ui/ActionButtons";
import Pagination from "../../../components/ui/Pagination";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    minStars: "",
    maxStars: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalHotels, setTotalHotels] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShowRef = useRef(false);
  const isInitialMount = useRef(true);
  const tableContainerRef = useRef(null);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        city: filters.city || undefined,
        min_stars: filters.minStars || undefined,
        max_stars: filters.maxStars || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get("/hotels", { params });
      const responseData = response.data;
      setHotels(responseData.data || []);
      setTotalHotels(responseData.data?.length || 0);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error("Gagal memuat data hotel");
      setHotels([]);
      setTotalHotels(0);
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
    fetchHotels();
  }, [fetchHotels, location, navigate]);

  const handleDelete = (id) => {
    setHotelToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/hotels/${hotelToDelete}`);
      toast.success("Hotel berhasil dihapus");
      fetchHotels();
      // Reset to first page if current page becomes empty
      if (currentPage > 1 && hotels.length === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus hotel");
    } finally {
      setShowDeleteModal(false);
      setHotelToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setHotelToDelete(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      minStars: "",
      maxStars: "",
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

  const sortedHotels = useMemo(() => {
    let sortableItems = [...hotels];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [hotels, sortConfig]);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedHotels.slice(startIndex, endIndex);
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

  const totalPages = Math.ceil(totalHotels / itemsPerPage);

  const filterConfig = [
    {
      name: "city",
      type: "select",
      icon: <FaFilter className="text-gray-400" />,
      options: [
        { value: "", label: "Semua Kota" },
        { value: "Mekkah", label: "Mekkah" },
        { value: "Madinah", label: "Madinah" },
      ],
    },
    {
      name: "minStars",
      type: "select",
      icon: <FaStar className="text-gray-400" />,
      options: [
        { value: "", label: "Min Bintang" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
    },
    {
      name: "maxStars",
      type: "select",
      icon: <FaStar className="text-gray-400" />,
      options: [
        { value: "", label: "Max Bintang" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
    },
  ];

  const getHotelActions = (hotel) => [
    {
      type: "edit",
      color: "text-green-500",
      title: "Edit",
      onClick: () => navigate(`/admin/hotel/edit/${hotel.id}`),
    },
    {
      type: "image",
      color: "text-blue-500",
      title: "Kelola Gambar",
      onClick: () => navigate(`/admin/hotel/images/${hotel.id}`),
    },
    {
      type: "delete",
      color: "text-red-500",
      title: "Hapus",
      onClick: () => handleDelete(hotel.id),
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Gambar/Nama",
      sortable: true,
      render: (hotel) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {hotel.images?.[0]?.image_path ? (
              <img
                className="h-10 w-10 rounded object-cover"
                src={`${$BASE_URL}/${hotel.images[0].image_path}`}
                alt={`Hotel ${hotel.name}`}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                <FaImage className="text-gray-500" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {hotel.name}
            </div>
            <div className="text-sm text-gray-500">{hotel.city}</div>
          </div>
        </div>
      ),
    },
    {
      key: "address",
      label: "Lokasi",
      sortable: true,
      render: (hotel) => (
        <div>
          <div className="text-sm text-gray-900">{hotel.address}</div>
          <div className="text-xs text-gray-500">
            {hotel.distance_to_haram > 0 && (
              <span>Haram: {Math.round(hotel.distance_to_haram)} meter</span>
            )}
            {hotel.distance_to_nabawi > 0 && (
              <span className={hotel.distance_to_haram > 0 ? "ml-2" : ""}>
                Nabawi: {Math.round(hotel.distance_to_nabawi)} meter
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "stars",
      label: "Bintang",
      sortable: true,
      render: (hotel) => (
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`h-4 w-4 ${
                i < hotel.stars ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (hotel) => <ActionButtons actions={getHotelActions(hotel)} />,
    },
  ];

  return (
    <AdminLayout title="Manajemen Hotel">
      <HeaderSection
        title="Kelola Hotel"
        description="Kelola data hotel yang tersedia untuk paket perjalanan"
        icon={<FaHotel className="text-white" />}
        addButtonText="Tambah Hotel"
        onAddClick={() => navigate("/admin/hotel/create")}
      />

      <div
        className="mb-6 rounded-lg bg-white p-4 shadow"
        ref={tableContainerRef}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Hotel..."
          />
          <FilterGroup
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            filterConfig={filterConfig}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <LoadingSpinner />
        ) : hotels.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data hotel
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
      {!loading && hotels.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalHotels}
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
        message="Apakah Anda yakin ingin menghapus hotel ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default HotelManagement;
