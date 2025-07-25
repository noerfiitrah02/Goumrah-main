import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../utils/api";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import StatCard from "../../components/ui/StatCard";
import QuickActionCard from "../../components/ui/QuickActionCard";
import RecentOrdersTable from "../../components/ui/RecentOrdersTable";
import PopularPackagesList from "../../components/ui/PopularPackagesList";
import FormatCurrency from "../../components/common/FormatCurrency";
import {
  FaBox,
  FaPlus,
  FaUsers,
  FaBook,
  FaBuilding,
  FaFileInvoiceDollar,
  FaChartLine,
  FaShoppingCart,
  FaCalendarAlt,
} from "react-icons/fa";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

Chart.register(...registerables);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalBlogPosts: 0,
    totalAirlines: 0,
    totalBanks: 0,
    totalTravelAgents: 0,
    recentOrders: [],
    orderStatus: {
      paid: 0,
      pending: 0,
      cancelled: 0,
    },
    monthlyRevenue: [],
    yearlyRevenue: [],
    popularPackages: [],
    selectedYear: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(true);
  const [isRevenueLoading, setIsRevenueLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/admin");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleYearChange = async (year) => {
    setIsRevenueLoading(true);
    try {
      const response = await api.get(`/dashboard/admin?year=${year}`);
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
        label: "Total Pendapatan",
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
    <AdminLayout title="Dashboard Admin">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
            <FaChartLine className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">
              Ringkasan statistik dan aktivitas sistem
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
        <LoadingSpinner />
      ) : (
        <>
          {/* Statistik Utama */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total transaksi"
              value={FormatCurrency(stats.totalRevenue)}
              subText={`${stats.totalOrders} transaksi`}
              icon={FaFileInvoiceDollar}
              onClick={() => navigate("/admin/pemesanan")}
            />

            <StatCard
              title="Total Produk"
              value={stats.totalPackages}
              subText={`${stats.orderStatus.paid} terjual`}
              icon={FaBox}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              onClick={() => navigate("/admin/produk")}
            />

            <StatCard
              title="Total Pengguna"
              value={stats.totalUsers}
              subText={`${stats.totalTravelAgents} travel agent`}
              icon={FaUsers}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              onClick={() => navigate("/admin/user")}
            />

            <StatCard
              title="Posting Blog"
              value={stats.totalBlogPosts}
              subText="Kelola konten blog anda"
              icon={FaBook}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              onClick={() => navigate("/admin/blog-posts")}
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
                Paket Terpopuler
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
                        title: {
                          display: true,
                          text: "Jumlah Pesanan",
                        },
                        ticks: {
                          precision: 0,
                        },
                      },
                      y1: {
                        beginAtZero: true,
                        position: "right",
                        title: {
                          display: true,
                          text: "Total Pendapatan",
                        },
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
                            if (label.includes("Pendapatan")) {
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
            onViewAllClick={() => navigate("/admin/pemesanan")}
            showUserColumn={false}
            detailPath="/admin/pemesanan/detail"
          />

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Kelola Produk"
              description="Ubah dan hapus produk"
              icon={FaPlus}
              onClick={() => navigate("/admin/produk/create")}
            />

            <QuickActionCard
              title="Buat Pemesanan"
              description="Pesanan manual"
              icon={FaShoppingCart}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              onClick={() => navigate("/admin/pemesanan/create")}
            />

            <QuickActionCard
              title="Kelola Travel Agent"
              description={`${stats.totalTravelAgents} agent terdaftar`}
              icon={FaBuilding}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              onClick={() => navigate("/admin/travel")}
            />

            <QuickActionCard
              title="Tulis Blog"
              description="Buat konten terbaru"
              icon={FaBook}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              onClick={() => navigate("/admin/blog-posts/create")}
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
