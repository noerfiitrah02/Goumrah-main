import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import api from "../../utils/api";

const AddPackageItinerary = ({
  LayoutComponent,
  theme,
  basePath,
  showBackIcon = false,
  showSaveIcon = false,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    day: "",
    title: "",
    description: "",
    location: "",
  });

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

    if (!formData.day || isNaN(formData.day)) {
      toast.error("Hari harus berupa angka");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Judul itinerary harus diisi");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/packages/${id}/itinerary`, formData);
      toast.success("Itinerary berhasil ditambahkan");
      navigate(`${basePath}/${id}`);
    } catch (error) {
      console.error("Error adding itinerary:", error);
      toast.error(
        error.response?.data?.message || "Gagal menambahkan itinerary",
      );
      setSubmitting(false);
    }
  };

  return (
    <LayoutComponent title="Tambah Itinerary Paket">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Tambah Itinerary
            </h2>
            <p className="text-sm text-gray-500">
              Tambahkan itinerary untuk paket perjalanan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hari <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
                placeholder="Contoh: 1, 2, 3, dst"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Tiba di Madinah"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Lokasi (Opsional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Contoh: Madinah, Arab Saudi"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsi kegiatan pada hari ini"
                className="h-32 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
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

export default AddPackageItinerary;
