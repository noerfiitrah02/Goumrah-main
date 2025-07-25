import { useState } from "react";
import ReactSlider from "react-slider";

const FloatingFilterButton = ({
  categoryId,
  setCategoryId,
  departureCity,
  setDepartureCity,
  selectedMonths,
  setSelectedMonths,
  price,
  setPrice,
  resetFilter,
  availableCities,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  // Local state untuk penyimpanan sementara
  const [tempCategoryId, setTempCategoryId] = useState(categoryId);
  const [tempDepartureCity, setTempDepartureCity] = useState(departureCity);
  const [tempSelectedMonths, setTempSelectedMonths] = useState(selectedMonths);
  const [tempPrice, setTempPrice] = useState(price);

  const handleDepartureCityChange = (city) => {
    setTempDepartureCity((prev) =>
      prev.includes(city)
        ? prev.filter((item) => item !== city)
        : [...prev, city],
    );
  };

  const applyFilter = () => {
    setCategoryId(tempCategoryId);
    setDepartureCity(tempDepartureCity);
    setSelectedMonths(tempSelectedMonths);
    setPrice(tempPrice);
    setIsFilterOpen(false);
  };

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

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform lg:hidden">
      <button
        onClick={toggleFilter}
        className="text-primary flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg"
      >
        Filter
      </button>

      {isFilterOpen && (
        <div className="absolute bottom-20 left-1/2 max-h-[80vh] w-[80vw] -translate-x-1/2 transform overflow-y-auto rounded-lg bg-white p-4 shadow-xl">
          <div className="space-y-4 text-sm text-gray-800">
            {/* Category */}
            <div>
              <h3 className="mb-1 font-semibold">Kategori</h3>
              <div className="space-y-1">
                {[
                  { id: null, label: "Semua" },
                  { id: 1, label: "Haji" },
                  { id: 2, label: "Umroh" },
                ].map((item) => (
                  <label key={item.id ?? "all"} className="flex items-center">
                    <input
                      type="radio"
                      checked={tempCategoryId === item.id}
                      onChange={() => setTempCategoryId(item.id)}
                      className="accent-primary mr-2"
                      name="category"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Departure City */}
            <div>
              <h3 className="mb-1 font-semibold">Kota Keberangkatan</h3>
              {availableCities.map((city) => (
                <label key={city} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempDepartureCity.includes(city)}
                    onChange={() => handleDepartureCityChange(city)}
                    className="accent-primary mr-2"
                  />
                  {city}
                </label>
              ))}
            </div>

            {/* Departure Month */}
            <div>
              <h3 className="mb-1 font-semibold">Bulan Keberangkatan</h3>
              {futureMonths.map((m) => (
                <label key={m.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempSelectedMonths.includes(m.id)}
                    onChange={() =>
                      setTempSelectedMonths((prev) =>
                        prev.includes(m.id)
                          ? prev.filter((item) => item !== m.id)
                          : [...prev, m.id],
                      )
                    }
                    className="accent-primary mr-2"
                  />
                  {m.label} {m.year}
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="mb-1 font-semibold">Harga</h3>
              <p>
                Rp.{tempPrice[0].toLocaleString()} - Rp.
                {tempPrice[1].toLocaleString()}
              </p>
              <ReactSlider
                className="mt-2 h-2 w-full rounded bg-gray-200"
                thumbClassName="w-4 h-4 bg-gradient rounded-full cursor-pointer"
                trackClassName="h-2 rounded"
                min={20000000}
                max={100000000}
                step={1000000}
                value={tempPrice}
                onChange={(newPrice) => {
                  setTempPrice(newPrice);
                  console.log(newPrice);
                 }}
                pearling
                minDistance={5000000}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => {
                  resetFilter();
                  setTempCategoryId(null);
                  setTempDepartureCity([]);
                  setTempSelectedMonths([]);
                  setTempPrice([20000000, 100000000]);
                  setIsFilterOpen(false);
                }}
                className="text-sm text-red-600 underline"
              >
                Reset
              </button>

              <button
                onClick={applyFilter}
                className="bg-primary rounded px-4 py-1 text-sm text-white"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingFilterButton;
