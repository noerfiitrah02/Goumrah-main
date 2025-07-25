import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import ConfirmationModal from "../common/ConfirmationModal";

export function Burgerbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <Menu as="div" className="relative">
        <div>
          <MenuButton className="bg-gradient rounded-full p-2 transition-transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:outline-none lg:hidden">
            <RxHamburgerMenu size={20} color="white" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
        >
          <div className="py-2">
            {/* User Authentication Section */}
            {isAuthenticated ? (
              <>
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <MenuItem>
                  <Link
                    to="/profil"
                    className={`block px-4 py-3 text-sm transition-colors ${
                      isActive("/profil")
                        ? "bg-green-50 font-medium text-green-700"
                        : "text-gray-700 data-focus:bg-green-50 data-focus:text-green-700"
                    }`}
                  >
                    Profil Saya
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    to="/keranjang"
                    className={`block px-4 py-3 text-sm transition-colors ${
                      isActive("/keranjang")
                        ? "bg-green-50 font-medium text-green-700"
                        : "text-gray-700 data-focus:bg-green-50 data-focus:text-green-700"
                    }`}
                  >
                    Keranjang
                  </Link>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem>
                  <Link
                    to="/daftar"
                    className={`block px-4 py-3 text-sm font-medium transition-colors ${
                      isActive("/daftar")
                        ? "bg-green-50 text-green-700"
                        : "text-green-600 data-focus:bg-green-50 data-focus:text-green-700"
                    }`}
                  >
                    Daftar
                  </Link>
                </MenuItem>

                <div className="my-1 border-b border-gray-100"></div>
              </>
            )}

            {/* Navigation Links */}
            <MenuItem>
              <Link
                to="/"
                className={`block px-4 py-3 text-sm transition-colors ${
                  isActive("/")
                    ? "bg-green-50 font-medium text-green-700"
                    : "text-gray-700 data-focus:bg-green-50 data-focus:text-green-700"
                }`}
              >
                Beranda
              </Link>
            </MenuItem>

            <MenuItem>
              <Link
                to="/produk"
                className={`block px-4 py-3 text-sm transition-colors ${
                  isActive("/produk")
                    ? "bg-green-50 font-medium text-green-700"
                    : "text-gray-700 data-focus:bg-green-50 data-focus:text-green-700"
                }`}
              >
                Produk
              </Link>
            </MenuItem>

            <MenuItem>
              <Link
                to="/tabungan"
                className={`block px-4 py-3 text-sm transition-colors ${
                  isActive("/tabungan")
                    ? "bg-green-50 font-medium text-green-700"
                    : "text-gray-700 data-focus:bg-green-50 data-focus:text-green-700"
                }`}
              >
                Tabungan Umrah & Haji
              </Link>
            </MenuItem>

            <MenuItem>
              <Link
                to="/blog"
                className={`block px-4 py-3 text-sm transition-colors ${
                  isActive("/blog")
                    ? "bg-green-50 font-medium text-green-700"
                    : "text-gray-700 data-focus:bg-green-50 data-focus:text-green-700"
                }`}
              >
                Blog
              </Link>
            </MenuItem>

            <MenuItem>
              <Link
                to="/kontak"
                className={`block px-4 py-3 text-sm transition-colors ${
                  isActive("/kontak")
                    ? "bg-green-50 font-medium text-green-700"
                    : "text-gray-700 data-focus:bg-green-50 data-focus:text-green-700"
                }`}
              >
                Kontak
              </Link>
            </MenuItem>

            {/* Logout Section for Authenticated Users */}
            {isAuthenticated && (
              <>
                <div className="my-1 border-t border-gray-100"></div>
                <MenuItem>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full px-4 py-3 text-left text-sm text-red-600 transition-colors data-focus:bg-red-50 data-focus:text-red-700"
                  >
                    Keluar
                  </button>
                </MenuItem>
              </>
            )}
          </div>
        </MenuItems>
      </Menu>

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
