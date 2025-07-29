import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import logo from "../../assets/logo.png";
import { IoBagOutline } from "react-icons/io5";
import { Burgerbar } from "../ui/Burgerbar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const getFirstName = (fullName) => {
    if (!fullName) return "Pengguna";
    return fullName.split(" ")[0];
  };

  const isActive = (path) => location.pathname === path;

  // Function to determine dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user?.role) return "/dashboard";

    switch (user.role.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "travel_agent":
        return "/travel-agent/dashboard";
      default:
        return "/dashboard";
    }
  };

  // Function to determine if user is admin or travel agent
  const isAdminOrAgent = () => {
    if (!user?.role) return false;
    return ["admin", "travel_agent"].includes(user.role.toLowerCase());
  };

  return (
    <>
      <header className="w-full max-w-[1064px] basis-full max-sm:mt-5 sm:mt-5 md:mt-6 lg:mt-7">
        {/* Top Bar */}
        <div className="justify-center max-sm:hidden sm:hidden md:flex">
          <div className="bg-gradient mx-[44px] flex w-full max-w-[986px] items-center justify-between rounded-t-full px-4 py-2 text-sm text-white">
            <div className="ms-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaEnvelope size={12} />
                <span className="text-xs">info@goumrah.net</span>
              </div>
              <div className="items-center gap-1 sm:hidden md:hidden lg:flex">
                <HiLocationMarker size={12} />
                <span className="text-xs">Indonesia</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="items-center gap-1 sm:hidden md:hidden lg:flex">
                <FaPhoneAlt size={12} />
                <span className="text-xs">+62 123-5000</span>
              </div>
              <div className="me-4 flex items-center gap-3">
                <FaTwitter size={12} className="cursor-pointer" />
                <FaFacebookF size={12} className="cursor-pointer" />
                <FaInstagram size={14} className="cursor-pointer" />
                <FaYoutube size={14} className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="relative z-10 flex items-center justify-between rounded-t-[10px] rounded-b-4xl bg-white px-8 py-3 shadow-md md:rounded-b-[46px] md:py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="GoUmrah" className="h-8" />
          </div>

          {/* Nav Links */}
          <nav className="flex gap-6 text-sm font-medium text-gray-700 max-sm:hidden sm:hidden lg:flex">
            <Link
              to="/"
              className={`transition-colors duration-200 hover:text-green-600 ${
                isActive("/")
                  ? "border-b-2 border-green-600 pb-1 font-semibold text-green-600"
                  : "hover:text-green-600"
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/produk"
              className={`transition-colors duration-200 hover:text-green-600 ${
                isActive("/produk")
                  ? "border-b-2 border-green-600 pb-1 font-semibold text-green-600"
                  : "hover:text-green-600"
              }`}
            >
              Produk
            </Link>
            <Link
              to="/tabungan"
              className={`transition-colors duration-200 hover:text-green-600 ${
                isActive("/tabungan")
                  ? "border-b-2 border-green-600 pb-1 font-semibold text-green-600"
                  : "hover:text-green-600"
              }`}
            >
              Tabungan Haji & Umrah
            </Link>
            <Link
              to="/blog"
              className={`transition-colors duration-200 hover:text-green-600 ${
                isActive("/blog")
                  ? "border-b-2 border-green-600 pb-1 font-semibold text-green-600"
                  : "hover:text-green-600"
              }`}
            >
              Blog
            </Link>
            <Link
              to="/kontak"
              className={`transition-colors duration-200 hover:text-green-600 ${
                isActive("/kontak")
                  ? "border-b-2 border-green-600 pb-1 font-semibold text-green-600"
                  : "hover:text-green-600"
              }`}
            >
              Kontak
            </Link>
          </nav>

          {/* CTA + User */}
          <div className="flex items-center gap-1">
            {/* Cart/Dashboard Icon - Only show if user is logged in */}
            {isAuthenticated && (
              <>
                {isAdminOrAgent() ? (
                  /* Dashboard Button for Admin/Travel Agent */
                  <Link
                    to={getDashboardRoute()}
                    className="hidden items-center rounded-full px-2 py-2 text-gray-700 transition-colors duration-200 hover:text-green-600 sm:flex"
                    title="Dashboard"
                  >
                    <MdDashboard size={20} />
                  </Link>
                ) : (
                  /* Cart Icon for Regular Users */
                  <Link
                    to="/keranjang"
                    className="hidden items-center rounded-full px-2 py-2 text-gray-700 transition-colors duration-200 hover:text-green-600 sm:flex"
                    title="Keranjang"
                  >
                    <IoBagOutline size={20} />
                  </Link>
                )}
              </>
            )}

            {/* User Section */}
            {isAuthenticated ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-gradient flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-opacity duration-200 hover:opacity-90"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <span className="text-xs font-bold">
                      {getFirstName(user?.name)?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  {getFirstName(user?.name)}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.role && (
                        <p className="mt-1 text-xs text-blue-600 capitalize">
                          {user.role.replace("_", " ")}
                        </p>
                      )}
                    </div>

                    {/* Dashboard Link in Dropdown for Admin/Travel Agent */}
                    {isAdminOrAgent() && (
                      <Link
                        to={getDashboardRoute()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/daftar"
                className="bg-gradient hidden rounded-2xl px-3 py-1 text-sm text-white transition-opacity duration-200 hover:opacity-90 sm:hidden lg:flex"
              >
                Daftar
              </Link>
            )}

            <Burgerbar />
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Ya, Keluar"
      />
    </>
  );
}
