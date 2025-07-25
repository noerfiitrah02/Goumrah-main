import { useEffect, useState } from "react";
import logoImage from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const statusTabs = ["", "pending", "paid", "canceled"];

function formatTanggalIndo(tanggal) {
  const bulanIndo = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agust",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const [tahun, bulan, hari] = tanggal.split("-");
  const namaBulan = bulanIndo[parseInt(bulan, 10) - 1];
  const tahunSingkat = tahun.slice(-2);
  return `${parseInt(hari)} ${namaBulan} ${tahunSingkat}`;
}

const base_url = import.meta.env.VITE_API_BASE_URL;

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("order_status", activeTab); // gunakan status tab aktif
      const res = await api.get(
        `/orders/user-orders?${params.toLocaleString()}`,
      );

      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await api.patch(`http://localhost:5000/api/orders/${orderId}`, {
        order_status: "canceled",
      });
      fetchOrders(); // refresh
    } catch (err) {
      alert("Gagal membatalkan pesanan.");
    }
  };

  const filteredOrders =
    activeTab === ""
      ? orders
      : orders.filter((order) => order.order_status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header ala ProductOrder */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1064px] items-center justify-between px-4 py-4">
          <img
            src={logoImage}
            className="h-10 cursor-pointer"
            alt="Logo GoUmrah"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      <main className="mx-auto max-w-[1064px] px-4 py-8">
        {/* Tab Filter */}
        <div className="mb-6 flex gap-2 overflow-auto">
          {statusTabs.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === status
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status === "" ? "Semua" : status}
            </button>
          ))}
        </div>

        {/* Konten Pesanan */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {loading ? (
            <p className="text-center text-gray-400">Memuat data...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500">
              Tidak ada pesanan dengan status "{activeTab}"
            </p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-center justify-between pb-2 text-sm text-gray-700">
                    <div className="font-semibold">
                      Travel |{" "}
                      <span className="text-primary">
                        {order?.package?.travel?.travel_name}
                      </span>
                    </div>
                    <div
                      className={`font-medium capitalize ${
                        order.order_status === "paid"
                          ? "text-green-600"
                          : order.order_status === "pending"
                            ? "text-yellow-600"
                            : order.order_status === "canceled"
                              ? "text-red-600"
                              : "text-gray-500"
                      }`}
                    >
                      {order.order_status}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex">
                    <img
                      src={`${base_url}/${order.package.featured_image}`}
                      alt="product"
                      className="h-20 w-20 rounded object-cover"
                    />
                    <div className="ml-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          {order.package?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Berangkat:{" "}
                          {formatTanggalIndo(order.package?.departure_date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Selesai:{" "}
                          {formatTanggalIndo(order.package?.return_date)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        Durasi: {order?.package?.duration} Hari
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex flex-col items-start justify-between gap-2 border-t border-gray-200 pt-3 sm:flex-row sm:items-center sm:gap-0">
                    <div className="text-gray-600">
                      Total:
                      <span className="text-primary text-base font-semibold">
                        {formatRupiah(order.total_price)}
                      </span>
                    </div>
                    <div className="flex gap-2 max-md:ml-auto">
                      {order.order_status === "pending" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="rounded border border-red-700 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                        >
                          Batalkan
                        </button>
                      )}
                      <button
                        onClick={() =>
                          navigate(`/produk/order/${order.package_id}`)
                        }
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                      >
                        Beli Lagi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
