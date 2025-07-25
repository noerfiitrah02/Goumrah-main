import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";

const TravelAgentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    travel_name: "",
    company_name: "",
    sk_number: "",
    phone_number: "",
    address: "",
    email: "",
    password: "",
    logo: null,
    logoPreview: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (id) {
      fetchAgent();
    }
  }, [id]);

  const fetchAgent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/travel/${id}`);
      const agent = response.data.data;
      setFormData({
        travel_name: agent.travel_name,
        company_name: agent.company_name,
        sk_number: agent.sk_number,
        phone_number: agent.phone_number,
        address: agent.address,
        email: agent.email,
        logo: agent.logo,
        logoPreview: agent.logo ? `${BASE_URL}/${agent.logo}` : null,
        // Password tidak diambil dari API untuk alasan keamanan
        password: "",
      });
    } catch (error) {
      console.error("Error fetching travel agent:", error);
      toast.error("Gagal memuat data agen perjalanan");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format file tidak didukung. Gunakan JPG atau PNG.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo: file,
          logoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.travel_name.trim()) {
      toast.error("Nama travel wajib diisi");
      return false;
    }
    if (!formData.sk_number.trim()) {
      toast.error("Nomor SK wajib diisi");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email wajib diisi");
      return false;
    }
    if (!formData.phone_number.trim()) {
      toast.error("Nomor telepon wajib diisi");
      return false;
    }

    // Validasi password hanya untuk create baru
    if (!id) {
      if (!formData.password) {
        toast.error("Password wajib diisi");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password minimal 6 karakter");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("travel_name", formData.travel_name);
      formDataToSend.append("company_name", formData.company_name);
      formDataToSend.append("sk_number", formData.sk_number);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("email", formData.email);

      // Hanya tambahkan password jika create baru
      if (!id) {
        formDataToSend.append("password", formData.password);
      }

      if (formData.logo && typeof formData.logo !== "string") {
        formDataToSend.append("logo", formData.logo);
      }

      if (id) {
        await api.put(`/travel/${id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/travel", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/admin/travel", {
        state: {
          successMessage: id
            ? "Travel agent berhasil diperbarui"
            : "Travel agent berhasil ditambahkan",
        },
      });
    } catch (error) {
      console.error("Error saving travel agent:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          Object.values(errors).forEach((errorMessages) => {
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach((msg) => toast.error(msg));
            } else {
              toast.error(errorMessages);
            }
          });
        } else {
          toast.error("Data yang dimasukkan tidak valid");
        }
      } else {
        toast.error(
          id
            ? "Gagal memperbarui agen perjalanan"
            : "Gagal menambahkan agen perjalanan",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? "Edit Travel Agent" : "Tambah Travel Agent"}>
      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Travel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="travel_name"
                value={formData.travel_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Perusahaan
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nomor SK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sk_number"
                value={formData.sk_number}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Nomor telepon harus diawali dengan 62
              </p>
            </div>

            {!id && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-green-500 focus:outline-none"
                      required={!id}
                      disabled={loading}
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Minimal 6 karakter
                  </p>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                rows="3"
                disabled={loading}
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Logo
              </label>
              <div className="flex items-center gap-4">
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                    className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-gray-300 bg-gray-200">
                    <span className="text-xs text-gray-500">No logo</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: JPG, PNG. Maksimal 5MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/travel")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              )}
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TravelAgentForm;
