import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

const Step4PersonalData = ({ authToken, onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    nik: "",
    birth_date: "",
    birth_place: "",
    is_using_bank_financing: false,
    bank_id: "",
  });

  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const selectedBank = formData.bank_id
    ? banks.find((bank) => bank.id.toString() === formData.bank_id)
    : null;

  // Fetch list bank dari API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await api.get("/banks");
        setBanks(response.data.data);
      } catch (err) {
        console.error("Gagal mengambil data bank:", err);
      }
    };

    fetchBanks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    const requiredFields = ["name", "nik", "birth_place", "birth_date"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("Harap lengkapi semua data");
      return false;
    }
    if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      toast.error("NIK harus terdiri dari 16 digit angka");
      return false;
    }
    if (formData.is_using_bank_financing && !formData.bank_id) {
      toast.error("Harap pilih bank jika menggunakan pembiayaan bank");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Format data sebelum dikirim
      const payload = {
        ...formData,
        birth_date: new Date(formData.birth_date).toISOString().split("T")[0],
      };

      await api.put(`/auth/complete-profile`, payload, {
        headers: {
          Authorization: `Bearer ${authToken} `,
        },
      });
      localStorage.setItem("authToken", authToken);
      setSuccess(true);

      setTimeout(() => {
        onComplete();
        navigate("/login", {
          state: {
            registrationSuccess: true,
          },
          replace: true,
        });
      }, 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Gagal menyimpan data. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-6 py-8 text-center">
        <div className="mb-4 text-2xl font-bold text-green-600">
          Profil Berhasil Dilengkapi!
        </div>
        <p className="text-gray-600">
          Anda akan diarahkan ke halaman login dalam beberapa detik...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="mb-6 text-gray-600">
          Mohon lengkapi data diri Anda sesuai dengan dokumen resmi
          (KTP/Passport)
        </p>

        {error && (
          <div className="mb-6 border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Data Pribadi */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Data Pribadi</h3>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-green-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama sesuai KTP"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nomor KTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nik"
                  maxLength="16"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-green-500"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="16 digit NIK"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tempat Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="birth_place"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-green-500"
                  value={formData.birth_place}
                  onChange={handleChange}
                  placeholder="Kota kelahiran"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birth_date"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-green-500"
                value={formData.birth_date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Alamat Lengkap
              </label>
              <textarea
                name="address"
                rows="3"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-green-500"
                value={formData.address}
                onChange={handleChange}
                placeholder="Alamat sesuai KTP"
              ></textarea>
            </div>
          </div>

          {/* Section Pembiayaan */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Pilihan Pembiayaan</h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="is_using_bank_financing"
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                  checked={!formData.is_using_bank_financing}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      is_using_bank_financing: false,
                      bank_id: "",
                    }))
                  }
                />
                <span className="text-gray-700">Pembiayaan Mandiri</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="is_using_bank_financing"
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                  checked={formData.is_using_bank_financing}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      is_using_bank_financing: true,
                    }))
                  }
                />
                <span className="text-gray-700">Pembiayaan Bank</span>
              </label>
            </div>

            {formData.is_using_bank_financing && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Pilih Bank <span className="text-red-500">*</span>
                </label>
                <select
                  name="bank_id"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-green-500"
                  value={formData.bank_id}
                  onChange={handleChange}
                  required={formData.is_using_bank_financing}
                >
                  <option value="">-- Pilih Bank --</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bank_name}
                    </option>
                  ))}
                </select>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      * Catatan: Untuk pembiayaan kami hanya bekerja sama dengan{" "}
                      {banks.length} bank
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    {selectedBank ? (
                      <img
                        key={selectedBank.id}
                        src={`${$BASE_URL}/${selectedBank.logo}`}
                        alt={selectedBank.bank_name}
                        className="h-8 w-16 object-contain"
                      />
                    ) : (
                      banks.map((bank) => (
                        <img
                          key={bank.id}
                          src={`${$BASE_URL}/${bank.logo}`}
                          alt={bank.bank_name}
                          className="h-8 w-16 object-contain"
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>

      <div className="border-l-4 border-blue-400 bg-blue-50 p-4 text-blue-700">
        <p className="font-medium">Perhatian:</p>
        <ul className="mt-1 list-inside list-disc text-sm">
          <li>Pastikan data yang Anda isi sesuai dengan dokumen resmi</li>
          <li>Data yang sudah disimpan tidak dapat diubah</li>
        </ul>
      </div>
    </div>
  );
};

export default Step4PersonalData;
