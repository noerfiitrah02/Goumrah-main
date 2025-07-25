import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="mb-8">
        <h1 className="text-8xl font-bold text-green-600 md:text-9xl">404</h1>
        <h2 className="mt-2 text-3xl font-semibold text-gray-800 md:text-4xl">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-4 text-base text-gray-600 md:text-lg">
          Maaf, halaman yang Anda cari tidak ada.
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
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
        >
          <FaHome />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
