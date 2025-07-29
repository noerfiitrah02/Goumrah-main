// Product.jsx
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Layout } from "../../../components/layout/Layout";
import ReactSlider from "react-slider";
import api from "../../../utils/api";
import FloatingFilterButton from "./Filter";
import GridCardWrapper from "./GridCardWrapper";
import { useLocation } from "react-router-dom";

const getLastDayOfMonth = (year, month) => new Date(year, month, 0).getDate();

const Product = () => {
  const [price, setPrice] = useState([20000000, 100000000]);
  const [categoryId, setCategoryId] = useState(null);
  const [departureCity, setDepartureCity] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const [availableAllCategories, setAvailableAllCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { state } = useLocation();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const months = [
    { label: "Januari", value: 1 },
    { label: "Februari", value: 2 },
    { label: "Maret", value: 3 },
    { label: "April", value: 4 },
    { label: "Mei", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "Agustus", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Desember", value: 12 },
  ];

  const futureMonths = months
    .filter((m) => m.value >= currentMonth)
    .map((m) => ({
      ...m,
      year: currentYear,
      id: `${currentYear}-${String(m.value).padStart(2, "0")}`,
    }));

  const sortedMonths = selectedMonths.sort();
  const departureDateFrom = sortedMonths.length
    ? `${sortedMonths[0]}-01`
    : null;
  const departureDateTo = sortedMonths.length
    ? (() => {
        const [year, month] = sortedMonths[sortedMonths.length - 1].split("-");
        const lastDay = getLastDayOfMonth(parseInt(year), parseInt(month));
        return `${year}-${month}-${lastDay}`;
      })()
    : null;

  const handleDepartureCityChange = (city) => {
    setDepartureCity((prev) =>
      prev.includes(city)
        ? prev.filter((item) => item !== city)
        : [...prev, city],
    );
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  const resetFilter = () => {
    setPrice([20000000, 100000000]);
    setCategoryId(null);
    setDepartureCity([]);
    setSelectedMonths([]);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/package-categories");
        setAvailableCategories(res.data.data); // asumsi response: [{ id: 1, name: "Haji" }, ...]
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get("/packages/featured");
        setRecommendedProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (state) {
      if (state.departure_city) {
        setDepartureCity([state.departure_city]);
      }
      if (state.departure_date_from && state.departure_date_to) {
        const from = new Date(state.departure_date_from);
        const to = new Date(state.departure_date_to);
        const months = [];

        const current = new Date(from);

        while (current <= to) {
          const id = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
          months.push(id);
          current.setMonth(current.getMonth() + 1);
        }

        setSelectedMonths(months);
      }
      if (state.max_price) {
        const price = [100000000, state.max_price];
        setPrice(price);
      }
    }
  }, [state]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get("/packages");
        const products = response.data.data;

        // Ekstrak semua kota unik
        const cities = [
          ...new Set(products.map((item) => item.departure_city)),
        ];
        setAvailableAllCategories(products);
        setAvailableCities(cities.filter(Boolean));
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };

    fetch();
  }, []);

  return (
    <Layout page={"Produk"}>
      <FloatingFilterButton
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        departureCity={departureCity}
        setDepartureCity={setDepartureCity}
        selectedMonths={selectedMonths}
        setSelectedMonths={setSelectedMonths}
        price={price}
        setPrice={setPrice}
        resetFilter={resetFilter}
        availableCities={availableCities}
      />

      <div className="grid grid-cols-4 max-lg:grid-cols-3">
        <div className="col-span-1 w-full space-y-6 pe-8 text-sm text-gray-800 max-lg:hidden">
          {/* Search */}
          <div className="flex">
            <input
              type="text"
              placeholder="   Search..."
              className="w-full rounded-tl-lg rounded-bl-lg border border-gray-300"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="bg-gradient cursor-pointer rounded-tr-lg rounded-br-lg px-4 py-3"
              onClick={() => setSearchQuery(searchInput)}
            >
              <FaSearch color="white" stroke="1" />
            </button>
          </div>

          {/* Category */}
          <div>
            <h3 className="mb-2 font-semibold">Kategori</h3>
            <ul className="space-y-1 font-medium">
              {[
                {
                  id: null,
                  label: `Semua (${availableAllCategories.length})`,
                  activeLabel: "...Semua",
                },
                ...availableCategories.map((cat) => ({
                  id: cat.id,
                  label: `${cat.name} (${availableAllCategories.filter((p) => p.category_id === cat.id).length})`,
                  activeLabel: `...${cat.name}`,
                })),
              ].map((item) => {
                const isActive = categoryId === item.id;
                return (
                  <li key={item.id ?? "all"}>
                    <button
                      onClick={() => setCategoryId(item.id)}
                      className={isActive ? "text-primary" : "text-gray-700"}
                    >
                      {isActive && item.activeLabel
                        ? item.activeLabel
                        : item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Departure City */}
          <div>
            <h3 className="mb-2 font-semibold">Kota Keberangkatan</h3>
            <div className="space-y-1">
              {availableCities.map((city) => (
                <div key={city} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={city}
                    value={city}
                    checked={departureCity.includes(city)}
                    onChange={() => handleDepartureCityChange(city)}
                    className="accent-primary"
                  />
                  <label htmlFor={city}>{city}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Month */}
          <div>
            <h3 className="mb-2 font-semibold">Bulan Keberangkatan</h3>
            <div className="space-y-1">
              {futureMonths.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={m.id}
                    checked={selectedMonths.includes(m.id)}
                    onChange={() =>
                      setSelectedMonths((prev) =>
                        prev.includes(m.id)
                          ? prev.filter((item) => item !== m.id)
                          : [...prev, m.id],
                      )
                    }
                    className="accent-primary"
                  />
                  <label htmlFor={m.id}>
                    {m.label} {m.year}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="mb-2 font-semibold">Filter by Price</h3>
            <p>
              Rp.{price[0].toLocaleString()} - Rp.{price[1].toLocaleString()}
            </p>
            <ReactSlider
              className="h-2 w-full rounded bg-gray-200"
              thumbClassName="w-4 h-4 bg-gradient rounded-full cursor-pointer"
              trackClassName=" h-2 rounded"
              min={20000000}
              max={100000000}
              step={1000000}
              value={price}
              onChange={(newPrice) => setPrice(newPrice)}
              pearling
              minDistance={5000000}
            />
          </div>

          {/* Product Popular */}
          <div>
            <h3 className="mb-2 font-semibold">Product Popular</h3>
            <div className="space-y-4">
              {recommendedProducts.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <img
                    src={`${$BASE_URL}/${item.featured_image}`}
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <h4 className="line-clamp-1 text-sm font-medium">
                      {item.name}
                    </h4>
                    <p className="text-primary font-semibold">
                      {formatRupiah(item.price_quadraple)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Filter */}
          <button
            onClick={resetFilter}
            className="mt-2 w-full cursor-pointer rounded-sm bg-red-600 py-1 text-sm font-medium text-white"
          >
            ↺ Reset Filter
          </button>
        </div>

        {/* Grid Wrapper */}
        <div className="col-span-3">
          <GridCardWrapper
            priceRange={price}
            categoryId={categoryId}
            departureCity={departureCity}
            departureDateFrom={departureDateFrom}
            departureDateTo={departureDateTo}
            searchQuery={searchQuery}
            searchInput={searchInput}
            setSearchQuery={setSearchQuery}
            setSearchInput={setSearchInput}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Product;
