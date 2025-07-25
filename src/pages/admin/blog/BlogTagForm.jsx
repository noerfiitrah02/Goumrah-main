import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const BlogTagForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchTag();
    }
  }, [slug]);

  const fetchTag = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/tags/${slug}`);
      setFormData({
        name: response.data.data.name,
        slug: response.data.data.slug,
      });
    } catch (error) {
      console.error("Error fetching blog tag:", error);
      toast.error("Gagal memuat data tag");
      navigate("/admin/tag-blog");
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
      toast.error("Nama tag harus diisi");
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/blogs/tags/${slug}`, formData);
      } else {
        await api.post("/blogs/tags", formData);
      }

      // Navigate tanpa toast di sini - biarkan BlogTag.jsx yang handle
      navigate("/admin/blog-tags", {
        state: {
          successMessage: `Tag berhasil ${isEditMode ? "diperbarui" : "dibuat"}`,
        },
      });
    } catch (error) {
      console.error("Error submitting tag:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
      setSubmitting(false); // Reset hanya jika error
    }
    // Jangan reset submitting di sini jika berhasil, karena komponen akan unmount
  };

  return (
    <AdminLayout title={isEditMode ? "Edit Tag Blog" : "Tambah Tag Blog"}>
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Edit Tag" : "Tambah Tag Baru"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditMode
                ? "Perbarui informasi tag blog"
                : "Tambahkan tag baru untuk blog"}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Tag <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Wisata, Haji, Umroh, dll"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/blog-tags")}
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

export default BlogTagForm;
