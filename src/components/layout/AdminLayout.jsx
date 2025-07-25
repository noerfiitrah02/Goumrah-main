import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/nobg.png";
import {
  FaUsers,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaChevronDown,
  FaUserCircle,
  FaHotel,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBoxes,
  FaBlog,
  FaPlane,
  FaBuilding,
  FaCogs,
  FaPen,
  FaFolderOpen,
  FaShoppingBag,
  FaTags,
} from "react-icons/fa";

const AdminLayout = ({ children, title = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const menuRefs = useRef({});

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleDropdown = (key) => {
    const isOpening = !openDropdowns[key];

    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    if (sidebarOpen && isOpening) {
      // Gunakan timeout untuk menunggu dropdown terbuka sebelum scroll
      setTimeout(() => {
        menuRefs.current[key]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 300); // Sesuaikan dengan durasi transisi
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "Pengguna",
      icon: <FaUsers className="h-5 w-5" />,
      path: "/admin/user",
    },
    {
      title: "Travel Agen",
      icon: <FaBuilding className="h-5 w-5" />,
      path: "/admin/travel",
    },
    {
      title: "Produk",
      icon: <FaShoppingBag className="h-5 w-5" />,
      isDropdown: true,
      key: "produk",
      children: [
        {
          title: "Produk",
          icon: <FaBoxes className="h-4 w-4" />,
          path: "/admin/produk",
        },
        {
          title: "Kategori Produk",
          icon: <FaFolderOpen className="h-4 w-4" />,
          path: "/admin/kategori-produk",
        },
      ],
    },
    {
      title: "Blog",
      icon: <FaBlog className="h-5 w-5" />,
      isDropdown: true,
      key: "blog",
      children: [
        {
          title: "Blog",
          icon: <FaPen className="h-4 w-4" />,
          path: "/admin/blog-posts",
        },
        {
          title: "Kategori Blog",
          icon: <FaFolderOpen className="h-4 w-4" />,
          path: "/admin/kategori-blog",
        },
        {
          title: "Tags Blog",
          icon: <FaTags className="h-4 w-4" />,
          path: "/admin/blog-tags",
        },
      ],
    },
    {
      title: "Pemesanan",
      icon: <FaCalendarAlt className="h-5 w-5" />,
      path: "/admin/pemesanan",
    },
    {
      title: "Master Data",
      icon: <FaCogs className="h-5 w-5" />,
      isDropdown: true,
      key: "master",
      children: [
        {
          title: "Hotel",
          icon: <FaHotel className="h-4 w-4" />,
          path: "/admin/hotel",
        },
        {
          title: "Airline",
          icon: <FaPlane className="h-4 w-4" />,
          path: "/admin/airline",
        },
        {
          title: "Bank",
          icon: <FaMoneyBillWave className="h-4 w-4" />,
          path: "/admin/bank",
        },
      ],
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isDropdownActive = (children) => {
    return children.some((child) => isActive(child.path));
  };

  // Efek untuk membuka dropdown yang aktif secara otomatis saat halaman berubah
  useEffect(() => {
    // Cari item dropdown yang memiliki anak yang aktif
    const activeDropdown = menuItems.find(
      (item) => item.isDropdown && isDropdownActive(item.children),
    );

    // Atur state dropdown yang terbuka. Jika ada dropdown yang aktif, buka. Jika tidak, tutup semua.
    const newOpenState = {};
    if (activeDropdown) {
      newOpenState[activeDropdown.key] = true;
    }
    setOpenDropdowns(newOpenState); // Atur state untuk membuka dropdown

    // Setelah state diatur, scroll ke dropdown yang aktif
    if (activeDropdown) {
      // Timeout untuk memberi waktu pada DOM untuk update sebelum scroll
      setTimeout(() => {
        menuRefs.current[activeDropdown.key]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 150); // Delay singkat untuk memastikan render selesai
    }
  }, [location.pathname]); // Dijalankan setiap kali path URL berubah

  const renderMenuItem = (item, index) => {
    if (item.isDropdown) {
      const isOpen = openDropdowns[item.key];
      const isDropdownItemActive = isDropdownActive(item.children);

      return (
        <li key={index} ref={(el) => (menuRefs.current[item.key] = el)}>
          <button
            className={`group w-full transition-all duration-200 ${
              isDropdownItemActive
                ? "bg-green-50 font-medium text-green-600"
                : "text-gray-600 hover:bg-green-50 hover:text-green-600"
            } ${
              sidebarOpen ? "justify-between px-4" : "justify-center px-2"
            } flex items-center rounded-xl py-2.5`}
            onClick={() => (sidebarOpen ? toggleDropdown(item.key) : null)}
          >
            <div className="flex items-center">
              <div
                className={`${
                  isDropdownItemActive
                    ? "text-green-600"
                    : "text-gray-500 group-hover:text-green-600"
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
                    ? "text-green-600"
                    : "text-gray-400 group-hover:text-green-600"
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
                            ? "bg-green-50 font-medium text-green-600"
                            : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                        } flex items-center justify-start rounded-lg px-3 py-2`}
                        onClick={() => navigate(child.path)}
                      >
                        <div
                          className={`${
                            childActive
                              ? "text-green-600"
                              : "text-gray-500 group-hover:text-green-600"
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

    // Regular menu item
    const active = isActive(item.path);
    return (
      <li key={index}>
        <button
          className={`group w-full transition-all duration-200 ${
            active
              ? "bg-green-50 font-medium text-green-600"
              : "text-gray-600 hover:bg-green-50 hover:text-green-600"
          } ${
            sidebarOpen ? "justify-start px-4" : "justify-center px-2"
          } flex items-center rounded-xl py-2.5`}
          onClick={() => navigate(item.path)}
        >
          <div
            className={`${
              active
                ? "text-green-600"
                : "text-gray-500 group-hover:text-green-600"
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
      {/* Sidebar - Desktop */}
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
            ) : (
              <p></p>
            )}
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

          {/* Sidebar Menu */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1.5 px-3">
              {menuItems.map((item, index) => renderMenuItem(item, index))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-100 p-4">
            <div
              className={`flex items-center ${
                sidebarOpen ? "mb-4 px-2" : "justify-center"
              }`}
            >
              {sidebarOpen && (
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {user?.name || "Admin"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.email || "admin@goumrah.net"}
                  </span>
                </div>
              )}
              <button
                className={`rounded-full border border-gray-200 ${
                  sidebarOpen ? "p-2" : "p-2"
                }`}
              >
                <FaUserCircle className="h-6 w-6 text-gray-600" />
              </button>
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

      <div
        className={`flex flex-1 flex-col ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } transition-all duration-300`}
      >
        {/* Header */}
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-sm">
                <span className="text-sm font-medium">
                  {(user?.name || "Admin").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-800">
                  {user?.name || "Admin"}
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {mobileMenuOpen && (
            <div
              className="bg-opacity-50 fixed inset-0 z-10 bg-black lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}
          <div className="container mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} GoUmrah. Hak Cipta Dilindungi.</p>
        </footer>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Logout
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Apakah Anda yakin ingin keluar dari akun Anda?
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
