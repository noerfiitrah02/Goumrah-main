import React, { useState } from "react";
import jamaahImage from "../../assets/jamaah.png";
import logoImage from "../../assets/nobg.png";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { RxHamburgerMenu } from "react-icons/rx";

const ToRegistration = () => {
  const [activeTab, setActiveTab] = useState("Daftar Jamaah");
  const navigate = useNavigate();

  const TravelContent = () => (
    <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
      <div className="mt-4 w-full text-center lg:mt-0 lg:basis-1/2 lg:text-left">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Kelola Jamaah Haji & Umrah <br className="max-md:hidden" />
          Lebih Mudah Dan Efisien
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Nikmati kemudahan mengelola jamaah haji dan umrah dengan sistem
          manajemen modern yang cepat, aman. Data tersimpan rapi, proses
          terpantau jelas, dan layanan Anda jadi semakin profesional.
        </p>
        <div className="flex w-full justify-center gap-4 lg:justify-start">
          <button
            onClick={() => navigate("/daftar/travel")}
            className="rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-green-700"
          >
            Daftar Travel
          </button>
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg border-2 border-green-600 bg-white px-6 py-3 text-lg font-medium text-green-600 shadow-md transition-colors hover:bg-green-50"
          >
            Masuk Travel
          </button>
        </div>
      </div>
      <div className="mt-8 flex w-full justify-center lg:basis-1/2">
        <div className="flex aspect-square w-2/4 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 shadow-lg">
          <span className="text-gray-400">Travel Dashboard Preview</span>
        </div>
      </div>
    </div>
  );

  const JamaahContent = () => (
    <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
      <div className="mt-4 w-full text-center lg:mt-0 lg:basis-1/2 lg:text-left">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Daftar Haji & Umrah jadi <br className="max-md:hidden" />
          Lebih Mudah Dan Nyaman
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Nikmati kemudahan pendaftaran haji dan umrah dengan sistem modern yang
          cepat, dan aman. Data Anda terkelola dengan rapi, dan layanan terbaik
          siap menyertai setiap langkah Anda.
        </p>
        <div className="flex w-full justify-center gap-4 lg:justify-start">
          <button
            onClick={() => navigate("/daftar/jamaah")}
            className="rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-green-700"
          >
            Daftar
          </button>
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg border-2 border-green-600 bg-white px-6 py-3 text-lg font-medium text-green-600 shadow-md transition-colors hover:bg-green-50"
          >
            Masuk
          </button>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-center lg:basis-1/2">
        <img
          src={jamaahImage}
          alt="Jamaah Umrah"
          className="aspect-square h-auto w-2/4 rounded-xl object-cover shadow-lg max-lg:w-4/5"
        />
      </div>
    </div>
  );

  const tabs = [
    { name: "Beranda" },
    { name: "Daftar Travel", content: <TravelContent /> },
    { name: "Daftar Jamaah", content: <JamaahContent /> },
  ];

  function BurgerbarToRegister() {
    return (
      <Menu as="div" className="relative md:hidden">
        <MenuButton className="inline-flex items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-700 focus:outline-none">
          <RxHamburgerMenu size={22} />
        </MenuButton>

        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="py-1">
            {tabs.map((tab) => (
              <MenuItem key={tab.name}>
                {({ focus }) => (
                  <button
                    onClick={() =>
                      tab.name === "Beranda"
                        ? navigate("/")
                        : setActiveTab(tab.name)
                    }
                    className={`${
                      focus ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block w-full px-4 py-2 text-left text-sm`}
                  >
                    {tab.name}
                  </button>
                )}
              </MenuItem>
            ))}
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => navigate("/login")}
                  className={`${
                    focus ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } block w-full px-4 py-2 text-left text-sm`}
                >
                  Masuk
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="m-auto flex min-h-screen max-w-11/12 flex-col px-4">
        {/* Header */}
        <div className="mt-10 mb-8 flex flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logoImage}
              className="h-11 cursor-pointer"
              alt="Logo GoUmrah"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Tabs + Masuk */}
          <div className="hidden items-center gap-2 md:flex">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() =>
                  tab.name === "Beranda"
                    ? navigate("/")
                    : setActiveTab(tab.name)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.name
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
            >
              Masuk
            </button>
          </div>

          {/* Mobile Burger Menu */}
          <BurgerbarToRegister />
        </div>

        {/* Main Content */}
        <div className="w-full rounded-lg bg-white p-6 shadow-sm">
          <div className="mx-auto flex w-full items-center justify-center py-8">
            {tabs.find((tab) => tab.name === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToRegistration;
