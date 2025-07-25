import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/TravelLayout";
import api from "../../utils/api";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import StatCard from "../../components/ui/StatCard";
import QuickActionCard from "../../components/ui/QuickActionCard";
import RecentOrdersTable from "../../components/ui/RecentOrdersTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PopularPackagesList from "../../components/ui/PopularPackagesList";
import FormatCurrency from "../../components/common/FormatCurrency";
import {
  FaUser,
  FaBox,
  FaPlus,
  FaShoppingCart,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

Chart.register(...registerables);

const TravelAgentDashboard = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activePackages: 0,
    orderStatus: {
      paid: 0,
      pending: 0,
      cancelled: 0,
    },
    monthlyRevenue: [],
    yearlyRevenue: [],
    popularPackages: [],
    recentOrders: [],
    selectedYear: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(true);
  const [isRevenueLoading, setIsRevenueLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/travel-agent");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching travel agent dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleYearChange = async (year) => {
    setIsRevenueLoading(true);
    try {
      const response = await api.get(`/dashboard/travel-agent?year=${year}`);
      setStats(response.data.data);
    } catch (error) {
      console.error(`Error fetching dashboard data for year ${year}:`, error);
    } finally {
      setIsRevenueLoading(false);
    }
  };

  // Data untuk chart pendapatan bulanan
  const revenueChartData = {
    labels: stats.monthlyRevenue.map((item) => {
      const [year, month] = item.month.split("-");
      return new Date(year, month - 1).toLocaleDateString("id-ID", {
        month: "short",
      });
    }),
    datasets: [
      {
        label: "Total Transaksi",
        data: stats.monthlyRevenue.map((item) => item.total),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Data untuk chart status pemesanan
  const orderStatusData = {
    labels: ["Sudah Bayar", "Belum Bayar", "Batal"],
    datasets: [
      {
        data: [
          stats.orderStatus.paid,
          stats.orderStatus.pending,
          stats.orderStatus.cancelled,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(255, 99, 132, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data untuk chart paket populer
  const popularPackagesData = {
    labels: stats.popularPackages.map((pkg, index) => `Paket ${index + 1}`),
    datasets: [
      {
        label: "Jumlah Pesanan",
        data: stats.popularPackages.map((pkg) => pkg.order_count),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Transaksi",
        data: stats.popularPackages.map((pkg) => pkg.total_revenue),
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        type: "line",
        yAxisID: "y1",
      },
    ],
  };

  return (
    <Layout title="Dashboard Travel Agent">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
            <FaChartLine className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">
              Ringkasan statistik dan aktivitas travel agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaCalendarAlt />
          <span>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner color="border-blue-500" />
      ) : (
        <>
          {/* Statistik Utama */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Transaksi"
              value={FormatCurrency(stats.totalRevenue)}
              subText={`${stats.totalOrders} transaksi`}
              icon={FaFileInvoiceDollar}
              onClick={() => navigate("/travel/orders")}
            />

            <StatCard
              title="Transaksi Bulan Ini"
              value={stats.ordersThisMonth}
              subText={FormatCurrency(stats.revenueThisMonth)}
              icon={FaCalendarAlt}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
            />

            <StatCard
              title="Tingkat Konversi"
              value={`${stats.conversionRate.toFixed(2)}%`}
              subText="Pesanan yang berhasil dibayar"
              icon={FaCheckCircle}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />

            <StatCard
              title="Total Paket"
              value={stats.totalPackages}
              subText={`${stats.activePackages} paket aktif`}
              icon={FaBox}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              onClick={() => navigate("/travel/produk")}
            />
          </div>

          {/* Grafik dan Data */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Grafik Pendapatan Bulanan */}
            <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Transaksi Bulanan ({stats.selectedYear})
                </h3>
                <select
                  onChange={(e) => handleYearChange(e.target.value)}
                  value={stats.selectedYear}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isRevenueLoading}
                >
                  {stats.yearlyRevenue.map((yearData) => (
                    <option key={yearData.year} value={yearData.year}>
                      {yearData.year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative h-64">
                {isRevenueLoading && (
                  <LoadingSpinner containerClassName="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70" />
                )}
                <Bar
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return FormatCurrency(value).replace("Rp", "");
                          },
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return FormatCurrency(context.raw);
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Status Pemesanan */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Status Pemesanan
              </h3>
              <div className="h-64">
                <Pie
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce(
                              (a, b) => a + b,
                              0,
                            );
                            const percentage = Math.round(
                              (value / total) * 100,
                            );
                            return `${label}: ${value} (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Baris Kedua Grafik */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Grafik Paket Populer */}
            <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Paket Dengan Pemesanan Terbanyak
              </h3>
              <div className="h-64">
                <Bar
                  data={popularPackagesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                      y1: {
                        beginAtZero: true,
                        position: "right",
                        ticks: {
                          callback: function (value) {
                            return FormatCurrency(value).replace("Rp", "");
                          },
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          title: function (tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            return stats.popularPackages[index]?.name || "";
                          },
                          label: function (context) {
                            let label = context.dataset.label || "";
                            if (label.includes("Transaksi")) {
                              return `${label}: ${FormatCurrency(context.raw)}`;
                            }
                            return `${label}: ${context.raw}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Tabel Paket Populer */}
            <PopularPackagesList
              packages={stats.popularPackages}
              FormatCurrency={FormatCurrency}
            />
          </div>

          {/* Pemesanan Terbaru */}
          <RecentOrdersTable
            orders={stats.recentOrders}
            onRowClick={(path) => navigate(path)}
            onViewAllClick={() => navigate("/travel/orders")}
            showUserColumn={true}
            detailPath="/travel/orders/detail"
          />

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <QuickActionCard
              title="Buat Paket Baru"
              description="Tambah paket wisata"
              icon={FaPlus}
              onClick={() => navigate("/travel/produk/create")}
            />

            <QuickActionCard
              title="Buat Pemesanan"
              description="Pesanan manual"
              icon={FaShoppingCart}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              onClick={() => navigate("/travel/orders/create")}
            />

            <QuickActionCard
              title="Kelola Paket"
              description={`${stats.totalPackages} paket terdaftar`}
              icon={FaBox}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              onClick={() => navigate("/travel/produk")}
            />
            <QuickActionCard
              title="Kelola Profil"
              description="Ubah informasi profil"
              icon={FaUser}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              onClick={() => navigate("/travel/profile")}
            />
          </div>
        </>
      )}
    </Layout>
  );
};

export default TravelAgentDashboard;
