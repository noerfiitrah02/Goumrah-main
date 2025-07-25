import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

// Komponen indikator password yang disederhanakan (sama dengan ForgotPasswordPage)
const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

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

const Step3PhonePassword = ({
  email,
  phone,
  setPhone,
  password,
  setPassword,
  tempToken,
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Validasi password yang disederhanakan (sama dengan ForgotPasswordPage)
  const isPasswordValid = (pwd) => {
    return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /\d/.test(pwd);
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

    setPhone(cleaned);
    setError("");
  };

  const handleRegister = async () => {
    // Validasi nomor telepon
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.message);
      return;
    }

    if (!password) {
      toast.error("Password diperlukan");
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error(
        "Password harus minimal 8 karakter, mengandung huruf dan angka",
      );
      return;
    }

    if (!confirmPassword) {
      toast.error("Konfirmasi password diperlukan");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/auth/register/step3",
        {
          password,
          phone_number: phone.replace(/\D/g, ""),
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        },
      );
      toast.success("Silakan lengkapi profil Anda!");
      onNext(response.data.step4Token);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    phone.length >= 12 &&
    isPasswordValid(password) &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-center gap-2">
            <X size={16} className="flex-shrink-0 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-300 p-4 text-sm text-gray-800">
        <p className="font-medium text-green-600">{email}</p>
        <p className="text-xs text-gray-500">Email telah dikonfirmasi</p>
      </div>

      <div className="rounded-lg border border-gray-300">
        <div className="m-6 space-y-4">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Masukkan nomor telepon Anda
            </label>
            <input
              type="tel"
              className="w-full rounded-md border border-gray-300 px-4 py-2 transition-colors outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="+628123456789"
              value={phone || "+62"}
              onChange={handlePhoneChange}
            />
            {phone && phone.length > 3 && (
              <div className="flex items-center gap-2 text-xs">
                {validatePhoneNumber(phone).isValid ? (
                  <>
                    <Check size={12} className="text-green-500" />
                    <span className="text-green-600">Nomor telepon valid</span>
                  </>
                ) : (
                  <>
                    <X size={12} className="text-red-500" />
                    <span className="text-red-600">
                      {validatePhoneNumber(phone).message}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Buat password yang kuat
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 transition-colors outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <PasswordStrengthIndicator password={password} />
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 transition-colors outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan ulang password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && (
              <div className="flex items-center gap-2 text-xs">
                {password === confirmPassword ? (
                  <>
                    <Check size={12} className="text-green-500" />
                    <span className="text-green-600">Password cocok</span>
                  </>
                ) : (
                  <>
                    <X size={12} className="text-red-500" />
                    <span className="text-red-600">Password tidak cocok</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleRegister}
        disabled={isLoading || !isFormValid}
        className={`w-full rounded-md px-4 py-3 font-medium text-white transition-colors ${
          isFormValid && !isLoading
            ? "bg-green-600 hover:bg-green-700"
            : "cursor-not-allowed bg-gray-400"
        }`}
      >
        {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
      </button>

      {/* Security Tips - Disederhanakan */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <h4 className="mb-2 text-sm font-medium text-blue-800">
          Tips Keamanan Password:
        </h4>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>• Gunakan kombinasi huruf dan angka</li>
          <li>• Minimal 8 karakter</li>
          <li>• Hindari informasi pribadi</li>
          <li>• Jangan gunakan password yang sama untuk akun lain</li>
        </ul>
      </div>
    </div>
  );
};

export default Step3PhonePassword;
