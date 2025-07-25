import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaSave, FaArrowLeft } from "react-icons/fa";

const PackageCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/package-categories/${id}`);
      setFormData({
        name: response.data.data.name,
      });
    } catch (error) {
      console.error("Error fetching package category:", error);
      toast.error("Gagal memuat data kategori");
      navigate("/admin/kategori-produk");
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

    // Cegah submit ganda
    if (submitting) return;

    // Validasi
    if (!formData.name.trim()) {
      toast.error("Nama kategori harus diisi");
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/package-categories/${id}`, formData);
      } else {
        await api.post("/package-categories", formData);
      }

      // Navigate tanpa toast di sini - biarkan PackageCategory.jsx yang handle
      navigate("/admin/kategori-produk", {
        state: {
          successMessage: `Kategori berhasil ${isEditMode ? "diperbarui" : "dibuat"}`,
        },
      });
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
      setSubmitting(false); // Reset hanya jika error
    }
    // Jangan reset submitting di sini jika berhasil, karena komponen akan unmount
  };

  return (
    <AdminLayout
      title={isEditMode ? "Edit Kategori Paket" : "Tambah Kategori Paket"}
    >
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditMode
                ? "Perbarui informasi kategori paket"
                : "Tambahkan kategori baru untuk paket perjalanan"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Umroh, Haji, Wisata, dll"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/kategori-produk")}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.name.trim()}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>{isEditMode ? "Simpan" : "Simpan"}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default PackageCategoryForm;
