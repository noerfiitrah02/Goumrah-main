import { FaX, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Check, X } from "lucide-react";
import logoImage from "../../../assets/logo.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/common/ConfirmationModal";

const RegistrationTravel = () => {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    travel_name: "",
    company_name: "",
    sk_number: "",
    address: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    let cleaned = input.replace(/[^0-9+]/g, "");

    if (!cleaned.startsWith("+62")) {
      cleaned = "+62" + cleaned.replace(/^\+?[0-9]*/, "");
    }

    if (cleaned.length > 15) {
      cleaned = cleaned.substring(0, 15);
    }

    setFormData({ ...formData, phone_number: cleaned });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const number = phoneNumber.substring(3);
    if (number.length < 8 || number.length > 12) {
      return {
        isValid: false,
        message: "Nomor telepon harus 8-12 digit setelah +62",
      };
    }
    return { isValid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!logoFile) {
      toast.error("Logo travel wajib diunggah");
      setIsLoading(false);
      return;
    }

    const phoneValidation = validatePhoneNumber(formData.phone_number);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.message);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error("Password dan konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "phone_number") {
          data.append(key, formData[key].replace(/\D/g, ""));
        } else if (key !== "confirm_password") {
          data.append(key, formData[key]);
        }
      });

      if (logoFile) {
        data.append("logo", logoFile);
      }

      const response = await axios.post(
        "http://localhost:5000/api/travel/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registrasi gagal";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
    navigate("/daftar");
  };

  const handleCancelCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="m-auto flex min-h-screen max-w-[1064px] flex-col px-4">
      {/* Header */}
      <div className="mt-10 mb-8 flex flex-row items-center justify-between gap-4">
        <div className="flex">
          <img src={logoImage} className="h-11" alt="Logo GoUmrah" />
        </div>
        <div>
          <FaX
            size={18}
            className="cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
            onClick={handleClose}
          />
        </div>
      </div>

      <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex w-full flex-col py-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Registrasi Travel Agent
          </h2>

          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="rounded-xl border border-gray-200 bg-gray-50/50">
              <div className="m-6 space-y-6">
                {/* Logo Upload Section */}
                <div className="flex items-start gap-6 max-md:flex-col">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex aspect-square w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-sm font-medium text-gray-500 transition-colors hover:border-gray-400">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Logo Preview"
                          className="h-full w-full rounded-lg object-contain"
                        />
                      ) : (
                        <span>Logo</span>
                      )}
                    </div>
                    <p className="text-center text-xs text-gray-500">
                      Max 2MB
                      <br />
                      JPG, PNG
                    </p>
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Logo Travel *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="logo-upload"
                        name="logo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                      >
                        {logoFile ? logoFile.name : "Pilih File Logo"}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Nama Travel */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Nama Travel *
                    </label>
                    <input
                      type="text"
                      name="travel_name"
                      value={formData.travel_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                      placeholder="Masukkan nama travel"
                      required
                    />
                  </div>

                  {/* Nama Perusahaan */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                      placeholder="Masukkan nama perusahaan"
                    />
                  </div>

                  {/* Nomor SK */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Nomor SK *
                    </label>
                    <input
                      type="text"
                      name="sk_number"
                      value={formData.sk_number}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                      placeholder="Masukkan nomor SK"
                      required
                    />
                  </div>

                  {/* Nomor HP */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Nomor HP *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number || "+62"}
                      onChange={handlePhoneChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                      placeholder="+628123456789"
                      required
                    />
                    {formData.phone_number &&
                      formData.phone_number.length > 3 && (
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          {validatePhoneNumber(formData.phone_number)
                            .isValid ? (
                            <>
                              <Check size={12} className="text-green-500" />
                              <span className="text-green-600">
                                Nomor telepon valid
                              </span>
                            </>
                          ) : (
                            <>
                              <X size={12} className="text-red-500" />
                              <span className="text-red-600">
                                {
                                  validatePhoneNumber(formData.phone_number)
                                    .message
                                }
                              </span>
                            </>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Alamat Kantor */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Alamat Kantor *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                      placeholder="Masukkan alamat lengkap kantor"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                      placeholder="Masukkan email"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                        placeholder="Masukkan password"
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Konfirmasi Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                        placeholder="Konfirmasi password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 focus:ring-primary rounded-lg px-8 py-3 text-sm font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelCancel}
        onConfirm={handleConfirmCancel}
        title="Konfirmasi Pembatalan"
        message="Apakah Anda yakin ingin membatalkan registrasi?"
        confirmText="Ya, Batalkan"
        cancelText="Batal"
      />
    </div>
  );
};

export default RegistrationTravel;
