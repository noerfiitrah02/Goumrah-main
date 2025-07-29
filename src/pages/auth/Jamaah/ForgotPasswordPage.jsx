import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../utils/api";

// Komponen indikator password yang disederhanakan
const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  const isValid = hasMinLength && hasLetter && hasNumber;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2 text-xs">
        {hasMinLength ? (
          <Check size={12} className="text-green-500" />
        ) : (
          <X size={12} className="text-red-500" />
        )}
        <span className={hasMinLength ? "text-green-600" : "text-gray-500"}>
          Minimal 8 karakter
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {hasLetter ? (
          <Check size={12} className="text-green-500" />
        ) : (
          <X size={12} className="text-red-500" />
        )}
        <span className={hasLetter ? "text-green-600" : "text-gray-500"}>
          Mengandung huruf
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {hasNumber ? (
          <Check size={12} className="text-green-500" />
        ) : (
          <X size={12} className="text-red-500" />
        )}
        <span className={hasNumber ? "text-green-600" : "text-gray-500"}>
          Mengandung angka
        </span>
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validasi password yang disederhanakan
  const isPasswordValid = (password) => {
    return (
      password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password)
    );
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });

      setStep(2);
      toast.success("Kode OTP telah dikirim ke email Anda");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Gagal mengirim OTP. Silakan coba lagi.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Semua field wajib diisi");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      toast.error(
        "Password harus minimal 8 karakter, mengandung huruf dan angka",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Gagal mengubah password. Silakan coba lagi.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cek apakah form valid untuk step 2
  const isStep2FormValid =
    otp.length === 6 &&
    isPasswordValid(newPassword) &&
    newPassword === confirmPassword;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? "Lupa Password" : "Reset Password"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email terdaftar
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className={`flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none ${
                    email && !isLoading
                      ? "bg-green-600 hover:bg-green-700"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Mengirim...</span>
                    </div>
                  ) : (
                    "Kirim Kode OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP + New Password */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masukkan 6 digit kode OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength="6"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-center tracking-widest placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setOtp(value);
                    }}
                    placeholder="_ _ _ _ _ _"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Cek email Anda untuk kode OTP. Kode berlaku selama 10 menit.
                </p>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Baru
                </label>
                <div className="relative mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <PasswordStrengthIndicator password={newPassword} />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Konfirmasi Password Baru
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Masukkan ulang password baru"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {newPassword === confirmPassword ? (
                      <>
                        <Check size={12} className="text-green-500" />
                        <span className="text-green-600">Password cocok</span>
                      </>
                    ) : (
                      <>
                        <X size={12} className="text-red-500" />
                        <span className="text-red-600">
                          Password tidak cocok
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-gray-500"
                >
                  Kembali
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !isStep2FormValid}
                  className={`rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none ${
                    isStep2FormValid && !isLoading
                      ? "bg-green-600 hover:bg-green-700"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Kembali ke halaman login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
