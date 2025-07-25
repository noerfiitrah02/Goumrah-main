import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
    nik: "",
    birth_date: "",
    birth_place: "",
    is_using_bank_financing: false,
    bank_id: "",
    role: "user",
    status: "pending",
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
    fetchBanks();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await api.get("/banks");
      setBanks(response.data.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Gagal memuat data bank");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email wajib diisi");
      return false;
    }
    if (!id && !formData.password.trim()) {
      toast.error("Password wajib diisi");
      return false;
    }
    if (formData.is_using_bank_financing && !formData.bank_id) {
      toast.error("Bank wajib dipilih jika menggunakan pembiayaan bank");
      return false;
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

      const submitData = { ...formData };
      if (id && !submitData.password) {
        delete submitData.password;
      }

      if (id) {
        await api.put(`/users/${id}`, submitData);
      } else {
        await api.post("/users", submitData);
      }

      navigate("/admin/user", {
        state: {
          successMessage: id
            ? "Pengguna berhasil diperbarui"
            : "Pengguna berhasil ditambahkan",
        },
      });
    } catch (error) {
      console.error("Error saving user:", error);

      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 422) {
        // Handle validation errors
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
      } else if (error.response?.status === 409) {
        toast.error("Email sudah digunakan oleh pengguna lain");
      } else {
        toast.error(
          id ? "Gagal memperbarui pengguna" : "Gagal menambahkan pengguna",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? "Edit Pengguna" : "Tambah Pengguna"}>
      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                disabled={!!id || loading}
              />
            </div>

            {!id && (
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-green-500 focus:outline-none"
                    required
                    minLength="6"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nomor Telepon
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Nomor telepon harus diawali dengan 62
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                rows="2"
                disabled={loading}
              ></textarea>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                NIK
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                maxLength="16"
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tempat Lahir
              </label>
              <input
                type="text"
                name="birth_place"
                value={formData.birth_place}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                required
                disabled={loading}
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_using_bank_financing"
                  checked={formData.is_using_bank_financing}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled={loading}
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Menggunakan Pembiayaan Bank
                </label>
              </div>
            </div>

            {formData.is_using_bank_financing && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bank <span className="text-red-500">*</span>
                </label>
                <select
                  name="bank_id"
                  value={formData.bank_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                  required={formData.is_using_bank_financing}
                  disabled={loading}
                >
                  <option value="">Pilih Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bank_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/user")}
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

export default UserForm;
