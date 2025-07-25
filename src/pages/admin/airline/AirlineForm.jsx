import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaPlane, FaSave, FaArrowLeft } from "react-icons/fa";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const AirlineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isEditMode) {
      fetchAirline();
    }
  }, [id]);

  const fetchAirline = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/airlines/${id}`);
      const airline = response.data.data;
      setFormData({
        name: airline.name,
        logo: null,
      });
      if (airline.logo) {
        setPreviewLogo(`${$BASE_URL}/${airline.logo}`);
      }
    } catch (error) {
      console.error("Error fetching airline:", error);
      toast.error("Gagal memuat data airline");
      navigate("/admin/airline");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cegah submit ganda
    if (submitting) return;

    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    if (formData.logo) {
      formPayload.append("logo", formData.logo);
    }

    try {
      if (isEditMode) {
        await api.put(`/airlines/${id}`, formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/airlines", formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Navigate tanpa toast di sini - biarkan Airline.jsx yang handle
      navigate("/admin/airline", {
        state: {
          successMessage: `Airline berhasil ${isEditMode ? "diperbarui" : "dibuat"}`,
        },
      });
    } catch (error) {
      console.error("Error submitting airline:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
      setSubmitting(false); // Reset hanya jika error
    }
    // Jangan reset submitting di sini jika berhasil, karena komponen akan unmount
  };

  return (
    <AdminLayout title={isEditMode ? "Edit Airline" : "Tambah Airline"}>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
            <FaPlane className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Edit Maskapai" : "Tambah Maskapai Baru"}
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Maskapai
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Logo Maskapai
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border border-gray-300">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt="Preview Logo"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <FaPlane className="text-xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: JPG, PNG, JPEG (Maks: 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/airline")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AirlineForm;
