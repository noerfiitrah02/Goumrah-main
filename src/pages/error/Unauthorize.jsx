import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const homePath = user?.role === "travel_agent" ? "/travel/dashboard" : "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="mb-8">
        <h1 className="text-8xl font-bold text-red-500 md:text-9xl">403</h1>
        <h2 className="mt-2 text-3xl font-semibold text-gray-800 md:text-4xl">
          Akses Ditolak
        </h2>
        <p className="mt-4 text-base text-gray-600 md:text-lg">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
        >
          <FaArrowLeft />
          Kembali
        </button>
        <Link
          to={homePath}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        >
          <FaHome />
          {user?.role === "travel_agent" ? "Ke Dashboard" : "Ke Beranda"}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
