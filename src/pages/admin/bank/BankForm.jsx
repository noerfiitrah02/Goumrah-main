import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaUniversity } from "react-icons/fa";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const BankForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [formData, setFormData] = useState({
    bank_name: "",
    logo: null,
  });
  const loadingTimerRef = useRef(null);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isEditMode) {
      fetchBank();
    }

    // Cleanup timer saat komponen di-unmount
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [id]);

  const fetchBank = async () => {
    // Tunda penampilan loader selama 300ms
    loadingTimerRef.current = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      const response = await api.get(`/banks/${id}`);
      const bank = response.data.data;
      setFormData({
        bank_name: bank.bank_name,
        logo: null,
      });
      if (bank.logo) setPreviewLogo(`${$BASE_URL}/${bank.logo}`);
    } catch (error) {
      console.error("Error fetching bank:", error);
      toast.error("Gagal memuat data bank");
      navigate("/admin/bank");
    } finally {
      // Hentikan timer dan sembunyikan loader
      clearTimeout(loadingTimerRef.current);
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
      // Validasi ukuran file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format file harus JPG, PNG, atau JPEG");
        return;
      }

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

    // Validasi
    if (!formData.bank_name.trim()) {
      toast.error("Nama bank harus diisi");
      return;
    }

    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("bank_name", formData.bank_name.trim());
    if (formData.logo) {
      formPayload.append("logo", formData.logo);
    }

    try {
      if (isEditMode) {
        await api.put(`/banks/${id}`, formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/banks", formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Navigate tanpa toast di sini - biarkan Bank.jsx yang handle
      navigate("/admin/bank", {
        state: {
          successMessage: `Bank berhasil ${isEditMode ? "diperbarui" : "dibuat"}`,
        },
      });
    } catch (error) {
      console.error("Error submitting bank:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
      setSubmitting(false); // Reset hanya jika error
    }
    // Jangan reset submitting di sini jika berhasil, karena komponen akan unmount
  };

  return (
    <AdminLayout title={isEditMode ? "Edit Bank" : "Tambah Bank"}>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
            <FaUniversity className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Edit Bank" : "Tambah Bank Baru"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditMode
                ? "Perbarui informasi bank"
                : "Tambahkan bank baru untuk pembayaran"}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Bank <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                placeholder="Contoh: Bank Mandiri"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Logo Bank
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt="Preview Logo"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <FaUniversity className="text-xl" />
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
                    Format: JPG, PNG, JPEG (Maks: 5MB). Logo akan ditampilkan
                    dengan ukuran persegi.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/bank")}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={submitting}
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.bank_name.trim()}
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

export default BankForm;
