import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import FormatCurrency from "./FormatCurrency";
import api from "../../utils/api";
import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaTag,
  FaStar,
  FaPlane,
  FaHotel,
  FaRoute,
  FaBuilding,
} from "react-icons/fa";

const PackageDetail = ({
  LayoutComponent,
  theme,
  basePath,
  showCreator = false,
  showFeatured = false,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: null, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/packages/${id}`);
      setPackageData(response.data.data);
    } catch (error) {
      console.error("Error fetching package details:", error);
      toast.error("Gagal memuat detail paket");
      navigate(basePath);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const prepareDelete = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const { type, id } = itemToDelete;
    setIsDeleting(true);
    try {
      let endpoint = "";
      switch (type) {
        case "image":
          endpoint = `/packages/${packageData.id}/images/${id}`;
          break;
        case "flight":
          endpoint = `/packages/${packageData.id}/flights/${id}`;
          break;
        case "hotel":
          endpoint = `/packages/${packageData.id}/hotels/${id}`;
          break;
        case "itinerary":
          endpoint = `/packages/${packageData.id}/itineraries/${id}`;
          break;
        default:
          return;
      }

      await api.delete(endpoint);
      toast.success("Item berhasil dihapus");
      fetchPackage();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Gagal menghapus ${type}`);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete({ type: null, id: null });
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete({ type: null, id: null });
  };

  if (loading) {
    return (
      <LayoutComponent title="Loading...">
        <div className="flex min-h-96 items-center justify-center">
          <div
            className={`h-12 w-12 animate-spin rounded-full border-b-2 border-${theme.primary}`}
          ></div>
        </div>
      </LayoutComponent>
    );
  }

  if (!packageData) {
    return (
      <LayoutComponent title="Paket Tidak Ditemukan">
        <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <div className="text-lg text-gray-400">Paket tidak ditemukan</div>
        </div>
      </LayoutComponent>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FaTag },
    { id: "itinerary", label: "Itinerary", icon: FaRoute },
    { id: "images", label: "Galeri", icon: FaStar },
    { id: "flights", label: "Penerbangan", icon: FaPlane },
    { id: "hotels", label: "Hotel", icon: FaHotel },
  ];

  return (
    <LayoutComponent title={packageData.name}>
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate(basePath)}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <FaArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <button
              onClick={() => navigate(`${basePath}/edit/${id}`)}
              className={`inline-flex items-center gap-2 rounded-lg bg-${theme.primary} px-4 py-2 text-white transition-colors hover:bg-${theme.primaryHover}`}
            >
              <FaEdit className="h-4 w-4" />
              Edit Paket
            </button>
          </div>

          <div className="flex items-start gap-6">
            <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`${$BASE_URL}/${packageData.featured_image}`}
                alt={packageData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {packageData.name}
              </h1>
              <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <FaTag className="h-4 w-4" />
                  {packageData.category?.name || "Tidak ada kategori"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaCalendarAlt className="h-4 w-4" />
                  {packageData.duration} hari
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaMapMarkerAlt className="h-4 w-4" />
                  {packageData.departure_city}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaUsers className="h-4 w-4" />
                  {packageData.remaining_quota}/{packageData.quota}
                </span>
                {showCreator && (
                  <span className="inline-flex items-center gap-1">
                    <FaBuilding className="h-4 w-4" />
                    {packageData.creator?.role === "admin"
                      ? "Admin Goumroh"
                      : packageData.creator?.name || "Unknown"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium bg-${theme.secondary} text-${theme.primary}`}
                >
                  {packageData.status === "published"
                    ? "Published"
                    : packageData.status === "draft"
                      ? "Draft"
                      : "Archived"}
                </span>
                {showFeatured && packageData.is_featured && (
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium bg-${theme.secondary.replace(
                      "100",
                      "200",
                    )} text-${theme.primary}`}
                  >
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 text-sm text-gray-500">Mulai dari</div>
              <div className="text-2xl font-bold text-gray-900">
                {FormatCurrency(packageData.price_quadraple)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? `border-${theme.primary} bg-${theme.secondary} text-${theme.primary}`
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div
                    className={`rounded-lg bg-gradient-to-br from-${theme.secondary} to-${theme.secondary.replace(
                      "100",
                      "200",
                    )} p-6`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <FaCalendarAlt
                        className={`h-5 w-5 text-${theme.primary}`}
                      />
                      <h3 className="font-semibold text-gray-900">
                        Tanggal Perjalanan
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Keberangkatan: </span>
                        <span className="font-medium">
                          {formatDate(packageData.departure_date)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Kepulangan: </span>
                        <span className="font-medium">
                          {formatDate(packageData.return_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-lg bg-gradient-to-br from-${theme.secondary} to-${theme.secondary.replace(
                      "100",
                      "200",
                    )} p-6`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <FaUsers className={`h-5 w-5 text-${theme.primary}`} />
                      <h3 className="font-semibold text-gray-900">
                        Kuota & Harga
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Sisa kuota: </span>
                        <span className="font-medium">
                          {packageData.remaining_quota} dari {packageData.quota}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Harga double: </span>
                        <span className="font-medium">
                          {FormatCurrency(packageData.price_double)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-lg bg-gradient-to-br from-${theme.secondary} to-${theme.secondary.replace(
                      "100",
                      "200",
                    )} p-6`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <FaMapMarkerAlt
                        className={`h-5 w-5 text-${theme.primary}`}
                      />
                      <h3 className="font-semibold text-gray-900">Lokasi</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Keberangkatan: </span>
                        <span className="font-medium">
                          {packageData.departure_city}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Durasi: </span>
                        <span className="font-medium">
                          {packageData.duration} hari
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Detail Harga
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-4">
                      <div className="mb-1 text-sm text-gray-500">
                        Harga Double
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {FormatCurrency(packageData.price_double)}
                      </div>
                    </div>
                    {packageData.price_tripple && (
                      <div className="rounded-lg bg-white p-4">
                        <div className="mb-1 text-sm text-gray-500">
                          Harga Triple
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {FormatCurrency(packageData.price_tripple)}
                        </div>
                      </div>
                    )}
                    {packageData.price_quadraple && (
                      <div className="rounded-lg bg-white p-4">
                        <div className="mb-1 text-sm text-gray-500">
                          Harga Quadruple
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {FormatCurrency(packageData.price_quadraple)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className={`rounded-lg bg-${theme.secondary} p-6`}>
                    <h3
                      className={`mb-4 text-lg font-semibold text-${theme.primary.replace(
                        "600",
                        "800",
                      )}`}
                    >
                      ✓ Termasuk dalam paket
                    </h3>
                    <ul className="space-y-2">
                      {(() => {
                        let includesArray = [];
                        try {
                          includesArray = Array.isArray(packageData.includes)
                            ? packageData.includes
                            : JSON.parse(packageData.includes || "[]");
                        } catch (e) {
                          includesArray = [];
                        }
                        return includesArray.map((item, index) => (
                          <li
                            key={index}
                            className={`flex items-start gap-2 text-${theme.primary.replace(
                              "600",
                              "700",
                            )}`}
                          >
                            <span
                              className={`mt-1 text-${theme.primary.replace(
                                "600",
                                "500",
                              )}`}
                            >
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>

                  <div className="rounded-lg bg-red-50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-red-800">
                      ✗ Tidak termasuk dalam paket
                    </h3>
                    <ul className="space-y-2">
                      {(() => {
                        let excludesArray = [];
                        try {
                          excludesArray = Array.isArray(packageData.excludes)
                            ? packageData.excludes
                            : JSON.parse(packageData.excludes || "[]");
                        } catch (e) {
                          excludesArray = [];
                        }
                        return excludesArray.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-red-700"
                          >
                            <span className="mt-1 text-red-500">•</span>
                            <span>{item}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                </div>

                {packageData.terms_conditions && (
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Syarat & Ketentuan
                    </h3>
                    <div
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: packageData.terms_conditions,
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "images" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Galeri Foto
                  </h3>
                  <button
                    onClick={() => navigate(`${basePath}/${id}/add-image`)}
                    className={`inline-flex items-center gap-2 rounded-lg bg-${theme.primary} px-4 py-2 text-white transition-colors hover:bg-${theme.primaryHover}`}
                  >
                    <FaPlus className="h-4 w-4" />
                    Tambah Foto
                  </button>
                </div>
                {packageData.images && packageData.images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {packageData.images.map((image) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={`${$BASE_URL}/${image.image_path}`}
                            alt={image.caption || "Package Image"}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        </div>
                        {image.caption && (
                          <div className="p-3">
                            <p className="line-clamp-2 text-sm text-gray-600">
                              {image.caption}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={() => prepareDelete("image", image.id)}
                          className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <div className="mb-4 text-6xl">📸</div>
                    <div className="mb-2 text-lg font-medium">
                      Belum ada foto
                    </div>
                    <div className="text-sm">
                      Tambahkan foto untuk membuat paket lebih menarik
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "flights" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Jadwal Penerbangan
                  </h3>
                  <button
                    onClick={() => navigate(`${basePath}/${id}/add-flight`)}
                    className={`inline-flex items-center gap-2 rounded-lg bg-${theme.primary} px-4 py-2 text-white transition-colors hover:bg-${theme.primaryHover}`}
                  >
                    <FaPlus className="h-4 w-4" />
                    Tambah Penerbangan
                  </button>
                </div>
                {packageData.flights && packageData.flights.length > 0 ? (
                  <div className="space-y-4">
                    {packageData.flights.map((flight) => (
                      <div
                        key={flight.id}
                        className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {flight.flight_type === "departure"
                                ? "Keberangkatan"
                                : flight.flight_type === "return"
                                  ? "Kepulangan"
                                  : "Penerbangan"}
                            </h4>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                              <span>
                                {flight.airline?.name ||
                                  "Maskapai tidak diketahui"}
                              </span>
                              <span className="rounded bg-gray-100 px-2 py-1">
                                {flight.flight_number}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => prepareDelete("flight", flight.id)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full bg-${theme.secondary}`}
                            >
                              <FaPlane
                                className={`h-4 w-4 text-${theme.primary}`}
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {flight.departure_airport}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDate(flight.departure_datetime)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full bg-${theme.secondary}`}
                            >
                              <FaMapMarkerAlt
                                className={`h-4 w-4 text-${theme.primary}`}
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {flight.arrival_airport}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDate(flight.arrival_datetime)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <div className="mb-4 text-6xl">✈️</div>
                    <div className="mb-2 text-lg font-medium">
                      Belum ada jadwal penerbangan
                    </div>
                    <div className="text-sm">
                      Tambahkan jadwal penerbangan untuk paket ini
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "hotels" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Hotel
                  </h3>
                  <button
                    onClick={() => navigate(`${basePath}/${id}/add-hotel`)}
                    className={`inline-flex items-center gap-2 rounded-lg bg-${theme.primary} px-4 py-2 text-white transition-colors hover:bg-${theme.primaryHover}`}
                  >
                    <FaPlus className="h-4 w-4" />
                    Tambah Hotel
                  </button>
                </div>
                {packageData.hotels && packageData.hotels.length > 0 ? (
                  <div className="space-y-4">
                    {packageData.hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {hotel.hotel?.name || "Unknown Hotel"}
                            </h4>
                          </div>
                          <button
                            onClick={() => prepareDelete("hotel", hotel.id)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full bg-${theme.secondary}`}
                            >
                              <FaCalendarAlt
                                className={`h-4 w-4 text-${theme.primary}`}
                              />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">
                                Check-in
                              </div>
                              <div className="font-medium text-gray-900">
                                {formatDate(hotel.check_in_date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full bg-${theme.secondary}`}
                            >
                              <FaCalendarAlt
                                className={`h-4 w-4 text-${theme.primary}`}
                              />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">
                                Check-out
                              </div>
                              <div className="font-medium text-gray-900">
                                {formatDate(hotel.check_out_date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <div className="mb-4 text-6xl">🏨</div>
                    <div className="mb-2 text-lg font-medium">
                      Belum ada hotel
                    </div>
                    <div className="text-sm">
                      Tambahkan hotel untuk paket perjalanan ini
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "itinerary" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rencana Perjalanan
                  </h3>
                  <button
                    onClick={() => navigate(`${basePath}/${id}/add-itinerary`)}
                    className={`inline-flex items-center gap-2 rounded-lg bg-${theme.primary} px-4 py-2 text-white transition-colors hover:bg-${theme.primaryHover}`}
                  >
                    <FaPlus className="h-4 w-4" />
                    Tambah Itinerary
                  </button>
                </div>
                {packageData.itineraries &&
                packageData.itineraries.length > 0 ? (
                  <div className="space-y-4">
                    {packageData.itineraries
                      .sort((a, b) => a.day - b.day)
                      .map((itinerary) => (
                        <div
                          key={itinerary.id}
                          className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full bg-${theme.secondary}`}
                              >
                                <span
                                  className={`font-semibold text-${theme.primary}`}
                                >
                                  {itinerary.day}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="mb-2 flex items-start justify-between">
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    {itinerary.title}
                                  </h4>
                                  {itinerary.location && (
                                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                      <FaMapMarkerAlt className="h-3 w-3" />
                                      {itinerary.location}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() =>
                                    prepareDelete("itinerary", itinerary.id)
                                  }
                                  className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="leading-relaxed text-gray-700">
                                {itinerary.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <div className="mb-4 text-6xl">🗺️</div>
                    <div className="mb-2 text-lg font-medium">
                      Belum ada itinerary
                    </div>
                    <div className="text-sm">
                      Tambahkan rencana perjalanan untuk paket ini
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </LayoutComponent>
  );
};

export default PackageDetail;
