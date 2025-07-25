// components/shared/RecentOrdersTable.jsx
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const RecentOrdersTable = ({
  orders,
  onRowClick,
  onViewAllClick,
  showUserColumn = false,
  detailPath = "/orders/detail",
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Pemesanan Terbaru
        </h3>
        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Lihat Semua
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                NO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Paket
              </th>
              {showUserColumn && (
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Jamaah
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onRowClick(`${detailPath}/${order.id}`)}
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {order.package_name}
                </td>
                {showUserColumn && (
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {order.user_name}
                  </td>
                )}
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {formatCurrency(order.total_price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.order_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.order_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.order_status === "paid" ? (
                      <>
                        <FaCheckCircle className="mr-1" /> Sudah Bayar
                      </>
                    ) : order.order_status === "pending" ? (
                      <>
                        <FaClock className="mr-1" /> Menunggu Pembayaran
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="mr-1" /> Batal
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
