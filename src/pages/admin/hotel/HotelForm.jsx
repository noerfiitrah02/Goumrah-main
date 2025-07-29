import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaHotel, FaSave, FaArrowLeft } from "react-icons/fa";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const HotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    stars: "",
    description: "",
    facility: "",
    distance_to_haram: "",
    distance_to_nabawi: "",
    map_url: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchHotel();
    }
  }, [id]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hotels/${id}`);
      const hotel = response.data.data;
      setFormData({
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        stars: hotel.stars,
        description: hotel.description,
        facility: hotel.facility,
        distance_to_haram:
          hotel.distance_to_haram != null
            ? Math.round(hotel.distance_to_haram)
            : "",
        distance_to_nabawi:
          hotel.distance_to_nabawi != null
            ? Math.round(hotel.distance_to_nabawi)
            : "",
        map_url: hotel.map_url,
      });
    } catch (error) {
      console.error("Error fetching hotel:", error);
      toast.error("Gagal memuat data hotel");
      navigate("/admin/hotel");
    } finally {
      setLoading(false);
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
    setSubmitting(true);

    const dataToSend = {
      ...formData,
      stars: formData.stars ? parseInt(formData.stars) : null,
      distance_to_haram: formData.distance_to_haram
        ? parseFloat(formData.distance_to_haram)
        : null,
      distance_to_nabawi: formData.distance_to_nabawi
        ? parseFloat(formData.distance_to_nabawi)
        : null,
    };

    try {
      if (isEditMode) {
        await api.put(`/hotels/${id}`, dataToSend);
      } else {
        await api.post("/hotels", dataToSend);
      }

      navigate("/admin/hotel", {
        state: {
          successMessage: `Hotel berhasil ${isEditMode ? "diperbarui" : "dibuat"}`,
        },
      });
    } catch (error) {
      console.error("Error submitting hotel:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title={isEditMode ? "Edit Hotel" : "Tambah Hotel"}>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
            <FaHotel className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Edit Hotel" : "Tambah Hotel Baru"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditMode
                ? "Perbarui informasi hotel"
                : "Tambahkan hotel baru untuk paket perjalanan"}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Hotel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kota <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                >
                  <option value="">Pilih Kota</option>
                  <option value="Mekkah">Mekkah</option>
                  <option value="Madinah">Madinah</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bintang <span className="text-red-500">*</span>
                </label>
                <select
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                >
                  <option value="">Pilih Rating Bintang</option>
                  <option value="1">1 Bintang</option>
                  <option value="2">2 Bintang</option>
                  <option value="3">3 Bintang</option>
                  <option value="4">4 Bintang</option>
                  <option value="5">5 Bintang</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Jarak ke Masjidil Haram (meter)
                </label>
                <input
                  type="number"
                  name="distance_to_haram"
                  value={formData.distance_to_haram}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Jarak ke Masjid Nabawi (meter)
                </label>
                <input
                  type="number"
                  name="distance_to_nabawi"
                  value={formData.distance_to_nabawi}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Fasilitas (pisahkan dengan koma)
                </label>
                <textarea
                  name="facility"
                  value={formData.facility}
                  onChange={handleChange}
                  rows="2"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  placeholder="Contoh: WiFi, AC, Sarapan, Kolam Renang"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  URL Peta (Google Maps)
                </label>
                <input
                  type="url"
                  name="map_url"
                  value={formData.map_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/hotel")}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default HotelForm;
