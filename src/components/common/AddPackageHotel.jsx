import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import api from "../../utils/api";

const AddPackageHotelBase = ({
  LayoutComponent,
  theme,
  basePath,
  showBackIcon = false,
  showSaveIcon = false,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    hotel_id: "",
    check_in_date: "",
    check_out_date: "",
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await api.get("/hotels");
      setHotels(response.data.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error("Gagal memuat data hotel");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (new Date(formData.check_in_date) >= new Date(formData.check_out_date)) {
      toast.error("Tanggal check-in harus sebelum check-out");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/packages/${id}/hotel`, formData);
      toast.success("Hotel berhasil ditambahkan");
      navigate(`${basePath}/${id}`);
    } catch (error) {
      console.error("Error adding hotel:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan hotel");
      setSubmitting(false);
    }
  };

  return (
    <LayoutComponent title="Tambah Hotel Paket">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${theme.primary} shadow-sm`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Tambah Hotel
            </h2>
            <p className="text-sm text-gray-500">
              Tambahkan hotel untuk paket perjalanan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hotel <span className="text-red-500">*</span>
              </label>
              <select
                name="hotel_id"
                value={formData.hotel_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              >
                <option value="">Pilih Hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal Check-in <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="check_in_date"
                value={formData.check_in_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal Check-out <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="check_out_date"
                value={formData.check_out_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={() => navigate(`${basePath}/${id}`)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={submitting}
            >
              {showBackIcon && <FaArrowLeft />}
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-2 rounded-lg bg-${theme.primary} px-4 py-2 text-white hover:bg-${theme.primaryHover} disabled:opacity-50`}
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  {showSaveIcon && <FaSave />}
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </LayoutComponent>
  );
};

export default AddPackageHotelBase;
