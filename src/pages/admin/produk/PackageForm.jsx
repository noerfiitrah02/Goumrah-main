import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    duration: "",
    price_double: "",
    price_tripple: "",
    price_quadraple: "",
    quota: "",
    departure_date: "",
    return_date: "",
    departure_city: "",
    includes: "",
    excludes: "",
    terms_conditions: "",
    featured_image: null,
    previewImage: null,
  });

  // Function to format price to Indonesian Rupiah
  const formatIDR = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const parseIDR = (formattedPrice) => {
    if (!formattedPrice) return "";
    return formattedPrice.replace(/[^\d]/g, "");
  };

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPackage();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/package-categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Gagal memuat data kategori");
    }
  };

  const parseJsonArray = (jsonString, fallback = []) => {
    try {
      if (typeof jsonString === "string") {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : fallback;
      }
      return Array.isArray(jsonString) ? jsonString : fallback;
    } catch (error) {
      console.error("Failed to parse JSON array:", error);
      return fallback;
    }
  };

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/packages/${id}`);
      const packageData = response.data.data;

      // Convert arrays to newline-separated strings for display
      const includesArray = parseJsonArray(packageData.includes);
      const excludesArray = parseJsonArray(packageData.excludes);

      setFormData({
        category_id: packageData.category_id,
        name: packageData.name,
        duration: packageData.duration,
        price_double: packageData.price_double,
        price_tripple: packageData.price_tripple,
        price_quadraple: packageData.price_quadraple,
        quota: packageData.quota,
        departure_date: packageData.departure_date.split("T")[0],
        return_date: packageData.return_date.split("T")[0],
        departure_city: packageData.departure_city,
        includes: includesArray.join("\n"),
        excludes: excludesArray.join("\n"),
        terms_conditions: packageData.terms_conditions,
        featured_image: null,
        previewImage: packageData.featured_image,
      });
    } catch (error) {
      console.error("Error fetching package:", error);
      toast.error("Gagal memuat data paket");
      navigate("/admin/produk");
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

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        featured_image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  // Fixed handler for includes and excludes textarea
  const handleArrayTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    // Validasi
    if (!formData.category_id) {
      toast.error("Kategori harus dipilih");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Nama paket harus diisi");
      return;
    }

    if (new Date(formData.departure_date) >= new Date(formData.return_date)) {
      toast.error("Tanggal keberangkatan harus sebelum tanggal pulang");
      return;
    }

    setSubmitting(true);

    try {
      // Convert text to array before submitting
      const includesArray = formData.includes
        .split("\n")
        .filter((item) => item.trim() !== "");
      const excludesArray = formData.excludes
        .split("\n")
        .filter((item) => item.trim() !== "");

      const formDataToSend = new FormData();
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("price_double", formData.price_double);
      formDataToSend.append("price_tripple", formData.price_tripple);
      formDataToSend.append("price_quadraple", formData.price_quadraple);
      formDataToSend.append("quota", formData.quota);
      formDataToSend.append("departure_date", formData.departure_date);
      formDataToSend.append("return_date", formData.return_date);
      formDataToSend.append("departure_city", formData.departure_city);
      formDataToSend.append("includes", JSON.stringify(includesArray));
      formDataToSend.append("excludes", JSON.stringify(excludesArray));
      formDataToSend.append("terms_conditions", formData.terms_conditions);

      if (formData.featured_image) {
        formDataToSend.append("featured_image", formData.featured_image);
      }

      if (isEditMode) {
        await api.put(`/packages/${id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/packages", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      if (isEditMode) {
        toast.success("Paket berhasil diperbarui");
      } else {
        toast.success("Paket berhasil ditambahkan");
      }
      navigate("/admin/produk");
    } catch (error) {
      console.error("Error submitting package:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title={isEditMode ? "Edit Paket" : "Tambah Paket"}>
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
              {isEditMode ? "Edit Paket" : "Tambah Paket Baru"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditMode
                ? "Perbarui informasi paket perjalanan"
                : "Tambahkan paket perjalanan baru"}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Paket <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Paket Umroh Reguler 12 Hari"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Durasi (hari) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Contoh: 12"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kota Keberangkatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="departure_city"
                  value={formData.departure_city}
                  onChange={handleChange}
                  placeholder="Contoh: Jakarta, Surabaya, dll"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Harga Double <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price_double"
                  value={formatIDR(formData.price_double)}
                  onChange={handlePriceChange}
                  placeholder="Contoh: Rp 35.000.000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Harga Triple
                </label>
                <input
                  type="text"
                  name="price_tripple"
                  value={formatIDR(formData.price_tripple)}
                  onChange={handlePriceChange}
                  placeholder="Contoh: Rp 33.000.000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Harga Quadruple
                </label>
                <input
                  type="text"
                  name="price_quadraple"
                  value={formatIDR(formData.price_quadraple)}
                  onChange={handlePriceChange}
                  placeholder="Contoh: Rp 30.000.000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kuota <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quota"
                  value={formData.quota}
                  onChange={handleChange}
                  placeholder="Contoh: 30"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tanggal Keberangkatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="departure_date"
                  value={formData.departure_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tanggal Pulang <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="return_date"
                  value={formData.return_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Gambar Utama <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="featured_image"
                      name="featured_image"
                      onChange={handleFileChange}
                      className="absolute h-full w-full cursor-pointer opacity-0"
                      accept="image/*"
                      disabled={submitting}
                    />
                    <label
                      htmlFor="featured_image"
                      className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400"
                    >
                      {formData.previewImage ? (
                        <img
                          src={
                            formData.featured_image
                              ? formData.previewImage
                              : `${$BASE_URL}/${formData.previewImage}`
                          }
                          alt="Preview"
                          className="h-full w-full rounded-lg object-cover"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              e.target.src,
                            );
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <svg
                            className="mx-auto h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="mt-2 block text-xs text-gray-500">
                            Upload Gambar
                          </span>
                        </div>
                      )}
                      {formData.previewImage && (
                        <div
                          className="text-center"
                          style={{ display: "none" }}
                        >
                          <svg
                            className="mx-auto h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="mt-2 block text-xs text-gray-500">
                            Gambar tidak dapat dimuat
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Format: JPG, PNG, JPEG</p>
                    <p>Ukuran maksimal: 2MB</p>
                    {!isEditMode && <p>Gambar wajib diupload</p>}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Termasuk dalam paket
                </label>
                <textarea
                  name="includes"
                  value={formData.includes}
                  onChange={handleArrayTextChange}
                  placeholder="Masukkan item yang termasuk dalam paket, pisahkan dengan enter
Contoh:
Tiket pesawat PP
Hotel bintang 4
Makan 3x sehari
Visa dan asuransi"
                  className="h-32 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  disabled={submitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Pisahkan setiap item dengan menekan Enter. Setiap baris akan
                  menjadi item terpisah.
                </p>
              </div>

              {/* Fixed Excludes Section */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tidak termasuk dalam paket
                </label>
                <textarea
                  name="excludes"
                  value={formData.excludes}
                  onChange={handleArrayTextChange}
                  placeholder="Masukkan item yang tidak termasuk dalam paket, pisahkan dengan enter
Contoh:
Laundry
Telepon dan internet
Tips guide
Belanja pribadi"
                  className="h-32 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  disabled={submitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Pisahkan setiap item dengan menekan Enter. Setiap baris akan
                  menjadi item terpisah.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Syarat & Ketentuan
                </label>
                <ReactQuill
                  value={formData.terms_conditions}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      terms_conditions: value,
                    }))
                  }
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  className="h-64"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/produk")}
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
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>Simpan</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default PackageForm;
