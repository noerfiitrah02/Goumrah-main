import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logoImage from "../../assets/nobg.png";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const registrationSuccess = location.state?.registrationSuccess;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login berhasil! Selamat datang.");
      // Redirect berdasarkan role
      const role = result.data.data.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "travel_agent") navigate("/travel/dashboard");
      else navigate("/");
    } else {
      toast.error(result.message || "Login gagal. Silakan coba lagi.");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto cursor-pointer"
          src={logoImage}
          alt="Your Company"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {/* Pesan sukses registrasi */}
          {registrationSuccess && (
            <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              Registrasi berhasil! Silakan login.
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm transition-colors focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm transition-colors focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={
                    isPasswordVisible
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Lupa Password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={[
                  "flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none",
                  isLoading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-green-600 hover:bg-green-700",
                ].join(" ")}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Masuk...</span>
                  </div>
                ) : (
                  "Masuk"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Belum Punya Akun?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/daftar/jamaah")}
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
              >
                Daftar Jamaah
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
