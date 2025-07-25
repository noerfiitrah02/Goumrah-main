import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import api from "../../utils/api";

const AddPackageFlight = ({
  LayoutComponent,
  theme,
  basePath,
  showBackIcon = false,
  showSaveIcon = false,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({
    airline_id: "",
    flight_number: "",
    departure_airport: "",
    departure_datetime: "",
    arrival_airport: "",
    arrival_datetime: "",
    flight_type: "departure",
  });

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const response = await api.get("/airlines");
      setAirlines(response.data.data);
    } catch (error) {
      console.error("Error fetching airlines:", error);
      toast.error("Gagal memuat data airline");
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

    if (
      new Date(formData.departure_datetime) >=
      new Date(formData.arrival_datetime)
    ) {
      toast.error("Waktu keberangkatan harus sebelum waktu kedatangan");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/packages/${id}/flight`, formData);
      toast.success("Penerbangan berhasil ditambahkan");
      navigate(`${basePath}/${id}`);
    } catch (error) {
      console.error("Error adding flight:", error);
      toast.error(
        error.response?.data?.message || "Gagal menambahkan penerbangan",
      );
      setSubmitting(false);
    }
  };

  return (
    <LayoutComponent title="Tambah Penerbangan Paket">
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Tambah Penerbangan
            </h2>
            <p className="text-sm text-gray-500">
              Tambahkan jadwal penerbangan untuk paket perjalanan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Maskapai <span className="text-red-500">*</span>
              </label>
              <select
                name="airline_id"
                value={formData.airline_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              >
                <option value="">Pilih Maskapai</option>
                {airlines.map((airline) => (
                  <option key={airline.id} value={airline.id}>
                    {airline.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nomor Penerbangan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="flight_number"
                value={formData.flight_number}
                onChange={handleChange}
                placeholder="Contoh: GA-123"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipe Penerbangan <span className="text-red-500">*</span>
              </label>
              <select
                name="flight_type"
                value={formData.flight_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              >
                <option value="departure">Keberangkatan</option>
                <option value="return">Pulang</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Bandara Keberangkatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="departure_airport"
                value={formData.departure_airport}
                onChange={handleChange}
                placeholder="Contoh: Soekarno-Hatta (CGK)"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Waktu Keberangkatan <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="departure_datetime"
                value={formData.departure_datetime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Bandara Kedatangan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="arrival_airport"
                value={formData.arrival_airport}
                onChange={handleChange}
                placeholder="Contoh: King Abdulaziz (JED)"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Waktu Kedatangan <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="arrival_datetime"
                value={formData.arrival_datetime}
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

export default AddPackageFlight;
