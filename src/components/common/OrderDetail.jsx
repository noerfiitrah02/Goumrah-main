import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";
import FormatCurrency from "./FormatCurrency";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  FaArrowLeft,
  FaPrint,
  FaUser,
  FaHotel,
  FaMoneyBillWave,
  FaUsers,
  FaIdCard,
  FaBirthdayCake,
  FaTransgender,
  FaChevronDown,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const OrderDetail = ({ LayoutComponent, backPath = "/admin/pemesanan" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [expandedPilgrim, setExpandedPilgrim] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Gagal memuat detail pemesanan");
      navigate(backPath);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handlePrint = () => {
    window.print();
  };

  const togglePilgrimDetails = (id) => {
    setExpandedPilgrim(expandedPilgrim === id ? null : id);
  };

  const calculateAge = (birthDate) => {
    const ageDiff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) {
    return (
      <LayoutComponent title="Loading...">
        <LoadingSpinner />
      </LayoutComponent>
    );
  }

  if (!order) {
    return (
      <LayoutComponent title="Pemesanan Tidak Ditemukan">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-center text-gray-500">
            Pemesanan tidak ditemukan
          </div>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent title={"Detail Pemesanan"} className="print-hidden">
      <div className="rounded-lg bg-white p-6 shadow print:p-4">
        {/* Header with back and print buttons */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50 sm:justify-start"
          >
            <FaArrowLeft /> Kembali
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
          >
            <FaPrint /> Cetak
          </button>
        </div>

        {/* Print Header - only visible when printing */}
        <div className="hidden print:mb-6 print:block print:border-b print:pb-4">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Detail Pemesanan
          </h1>
          <p className="text-center text-gray-600">
            Dicetak pada: {formatDateTime(new Date())}
          </p>
        </div>

        {/* Order summary */}
        <div className="mb-6 flex items-center gap-3 print:hidden">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Pemesanan Paket {order.package.category.name}
            </h2>
            <p className="text-sm text-gray-500">
              Tanggal: {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="hidden print:mb-6 print:block">
          <h2 className="text-center text-xl font-semibold text-gray-800">
            Pemesanan Paket {order.package.category.name}
          </h2>
          <p className="text-center text-sm text-gray-500">
            Tanggal: {formatDateTime(order.createdAt)}
          </p>
        </div>

        {/* Information cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2">
          {/* User information */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center gap-2">
              <FaUser className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Informasi User
              </h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium">{order.user?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.user?.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">No. Telepon</p>
                <p className="font-medium">{order.user?.phone_number || "-"}</p>
              </div>
            </div>
          </div>

          {/* Package information */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center gap-2">
              <FaHotel className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Informasi Paket
              </h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Nama Paket</p>
                <p className="font-medium">{order.package?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                <p className="font-medium">
                  {order.package?.category?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Keberangkatan</p>
                <p className="font-medium">
                  {order.package?.departure_date
                    ? formatDate(order.package.departure_date)
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipe Kamar</p>
                <p className="font-medium capitalize">{order.room_type}</p>
              </div>
            </div>
          </div>

          {/* Payment information */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Detail Pembayaran
              </h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                    order.order_status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.order_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.order_status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.order_status === "paid"
                    ? "Sudah Bayar"
                    : order.order_status === "pending"
                      ? "Menunggu Pembayaran"
                      : order.order_status === "cancelled"
                        ? "Batal"
                        : "Gagal"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Harga</p>
                <p className="font-medium">
                  {FormatCurrency(order.total_price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jumlah Jamaah</p>
                <p className="font-medium">
                  {order.details?.length || 0} orang
                </p>
              </div>
            </div>
          </div>

          {/* Pilgrim summary */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center gap-2">
              <FaUsers className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Ringkasan Jamaah
              </h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Jumlah Laki-laki</p>
                <p className="font-medium">
                  {order.details?.filter((d) => d.gender === "male").length ||
                    0}{" "}
                  orang
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jumlah Perempuan</p>
                <p className="font-medium">
                  {order.details?.filter((d) => d.gender === "female").length ||
                    0}{" "}
                  orang
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rata-rata Usia</p>
                <p className="font-medium">
                  {order.details?.length
                    ? Math.round(
                        order.details.reduce((sum, detail) => {
                          return sum + calculateAge(detail.birth_date);
                        }, 0) / order.details.length,
                      ) + " tahun"
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pilgrim data - hidden when printing */}
        <div className="mt-6 print:hidden">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Data Jamaah ({order.details?.length || 0})
          </h3>

          <div className="space-y-3">
            {order.details?.map((detail) => (
              <div
                key={detail.id}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                <button
                  className="w-full p-4 text-left hover:bg-gray-50 focus:outline-none"
                  onClick={() => togglePilgrimDetails(detail.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <FaUser className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {detail.name}
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaIdCard className="text-xs" /> {detail.nik}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaBirthdayCake className="text-xs" />{" "}
                            {calculateAge(detail.birth_date)} tahun
                          </span>
                          <span className="flex items-center gap-1">
                            <FaTransgender className="text-xs" />{" "}
                            {detail.gender === "male"
                              ? "Laki-laki"
                              : "Perempuan"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {expandedPilgrim === detail.id ? (
                        <FaChevronDown className="rotate-180 transform transition-transform" />
                      ) : (
                        <FaChevronDown className="transition-transform" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedPilgrim === detail.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                          <FaBirthdayCake /> Data Pribadi
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-500">Tempat/Tgl Lahir</p>
                            <p className="font-medium">
                              {detail.birth_place},{" "}
                              {formatDate(detail.birth_date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Pekerjaan</p>
                            <p className="font-medium">{detail.job || "-"}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                          <FaMapMarkerAlt /> Alamat
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-500">Alamat Lengkap</p>
                            <p className="font-medium">
                              {detail.address || "-"}
                              {detail.city && <>, {detail.city}</>}
                              {detail.postal_code && (
                                <>, {detail.postal_code}</>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                          <FaPhoneAlt /> Kontak Darurat
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-500">Nama</p>
                            <p className="font-medium">
                              {detail.emergency_contact_name || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">No. Telepon</p>
                            <p className="font-medium">
                              {detail.emergency_contact_phone || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Hubungan</p>
                            <p className="font-medium">
                              {detail.emergency_contact_relationship || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default OrderDetail;
