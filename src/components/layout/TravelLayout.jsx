import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationModal from "../common/ConfirmationModal";
import logo from "../../assets/nobg.png";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaChevronDown,
  FaFileInvoiceDollar,
  FaCog,
  FaShoppingBag,
  FaTachometerAlt,
} from "react-icons/fa";

const TravelLayout = ({ children, title = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt className="h-5 w-5" />,
      path: "/travel/dashboard",
    },
    {
      title: "Produk",
      icon: <FaShoppingBag className="h-5 w-5" />,
      path: "/travel/produk",
    },
    {
      title: "Pemesanan",
      icon: <FaFileInvoiceDollar className="h-5 w-5" />,
      path: "/travel/orders",
    },
    {
      title: "Profil Travel",
      icon: <FaCog className="h-5 w-5" />,
      path: "/travel/profile",
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isDropdownActive = (children) => {
    return children.some((child) => isActive(child.path));
  };

  const renderMenuItem = (item, index) => {
    if (item.isDropdown) {
      const isOpen = openDropdowns[item.key];
      const isDropdownItemActive = isDropdownActive(item.children);

      return (
        <li key={index}>
          <button
            className={`group w-full transition-all duration-200 ${
              isDropdownItemActive
                ? "bg-blue-50 font-medium text-blue-600"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            } ${
              sidebarOpen ? "justify-between px-4" : "justify-center px-2"
            } flex items-center rounded-xl py-2.5`}
            onClick={() => (sidebarOpen ? toggleDropdown(item.key) : null)}
          >
            <div className="flex items-center">
              <div
                className={`${
                  isDropdownItemActive
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
              >
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="ml-3 truncate font-medium">{item.title}</span>
              )}
            </div>
            {sidebarOpen && (
              <FaChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                } ${
                  isDropdownItemActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-blue-600"
                }`}
              />
            )}
            {!sidebarOpen && (
              <span className="absolute left-full z-50 ml-6 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.title}
              </span>
            )}
          </button>

          {sidebarOpen && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                {item.children.map((child, childIndex) => {
                  const childActive = isActive(child.path);
                  return (
                    <li key={childIndex}>
                      <button
                        className={`group w-full transition-all duration-200 ${
                          childActive
                            ? "bg-blue-50 font-medium text-blue-600"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        } flex items-center justify-start rounded-lg px-3 py-2`}
                        onClick={() => navigate(child.path)}
                      >
                        <div
                          className={`${
                            childActive
                              ? "text-blue-600"
                              : "text-gray-500 group-hover:text-blue-600"
                          }`}
                        >
                          {child.icon}
                        </div>
                        <span className="ml-3 truncate text-sm font-medium">
                          {child.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </li>
      );
    }

    const active = isActive(item.path);
    return (
      <li key={index}>
        <button
          className={`group w-full transition-all duration-200 ${
            active
              ? "bg-blue-50 font-medium text-blue-600"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          } ${
            sidebarOpen ? "justify-start px-4" : "justify-center px-2"
          } flex items-center rounded-xl py-2.5`}
          onClick={() => navigate(item.path)}
        >
          <div
            className={`${
              active
                ? "text-blue-600"
                : "text-gray-500 group-hover:text-blue-600"
            }`}
          >
            {item.icon}
          </div>
          {sidebarOpen && (
            <span className="ml-3 truncate font-medium">{item.title}</span>
          )}
          {!sidebarOpen && (
            <span className="absolute left-full z-50 ml-6 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.title}
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 z-20 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        } ${mobileMenuOpen ? "left-0" : "-left-64 lg:left-0"}`}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex h-16 items-center justify-between border-b border-gray-100 ${
              sidebarOpen ? "px-6" : "justify-center px-2"
            }`}
          >
            {sidebarOpen ? (
              <div className="flex items-center">
                <img src={logo} alt="GoUmrah Logo" className="h-10" />
              </div>
            ) : null}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:flex"
            >
              <FaChevronRight
                className={`h-5 w-5 transform transition-transform ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1.5 px-3">
              {menuItems.map((item, index) => renderMenuItem(item, index))}
            </ul>
          </nav>

          <div className="border-t border-gray-100 p-4">
            <div
              className={`flex items-center ${
                sidebarOpen ? "mb-4 px-2" : "justify-center"
              }`}
            >
              {sidebarOpen && (
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              )}
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                {user?.travelAgent?.logo ? (
                  <img
                    src={`${$BASE_URL}/${user.travelAgent.logo}`}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="h-full w-full text-gray-400" />
                )}
              </div>
            </div>
            <button
              className={`group flex w-full items-center rounded-xl py-2.5 text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${
                sidebarOpen ? "justify-start px-4" : "justify-center px-2"
              }`}
              onClick={handleLogoutClick}
            >
              <FaSignOutAlt className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3 font-medium">Keluar</span>}
              {!sidebarOpen && (
                <span className="absolute left-full z-50 ml-6 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Keluar
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-h-screen w-full flex-col">
        {/* Push content based on sidebar width */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            sidebarOpen ? "lg:pl-64" : "lg:pl-20"
          }`}
        >
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:px-6">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <FaBars className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200 shadow-sm">
                  {user?.travelAgent.logo ? (
                    <img
                      src={`${$BASE_URL}/${user.travelAgent.logo}`}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                      <span className="text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6">
            {mobileMenuOpen && (
              <div
                className="bg-opacity-50 fixed inset-0 z-10 bg-black lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              ></div>
            )}
            <div className="mx-auto w-full max-w-none">{children}</div>
          </main>

          <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} GoUmrah. Hak Cipta Dilindungi.</p>
          </footer>
        </div>
      </div>

      {/* Confirmation Modal untuk Logout */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        isConfirming={isLoggingOut}
      />
    </div>
  );
};

export default TravelLayout;
