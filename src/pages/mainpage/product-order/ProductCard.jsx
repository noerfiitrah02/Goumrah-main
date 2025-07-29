import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaRegClock,
  FaTimes,
  FaHotel,
  FaListUl,
  FaTimesCircle,
  FaInfoCircle,
  FaSuitcase,
  FaPlane,
  FaCalendarAlt,
} from "react-icons/fa";

const ProductCard = ({ productData, roomPrice, showDetail, setShowDetail }) => {
  let includes = [];

  try {
    const rawIncludes = productData?.includes;

    if (typeof rawIncludes === "string" && rawIncludes.trim()) {
      includes = JSON.parse(rawIncludes);
    } else if (Array.isArray(rawIncludes)) {
      includes = rawIncludes;
    }
  } catch (err) {
    console.error("Failed to parse 'includes':", err);
  }
  let excludes = [];

  try {
    const rawIncludes = productData?.includes;
    if (typeof rawIncludes === "string" && rawIncludes.trim()) {
      includes = JSON.parse(rawIncludes);
    } else if (Array.isArray(rawIncludes)) {
      includes = rawIncludes;
    }
  } catch (err) {
    console.error("Gagal parsing 'includes':", err);
  }

  let flight = productData?.flights?.[0];
  let hotel = productData?.hotels?.[0]?.hotel;
  let itinerary = productData?.itineraries?.[0];

  return (
    <div className="w-full max-w-[300px]">
      {/* Kartu Paket */}
      <div className="relative overflow-hidden rounded-xl bg-white">
        {/* Label Kategori */}
        <div className="bg-primary absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white shadow">
          {productData?.category_id === 2 ? "Haji" : "Umrah"}
        </div>

        {/* Gambar */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={
              productData?.featured_image
                ? `${import.meta.env.VITE_API_URL}/${productData.featured_image}`
                : "/image.png"
            }
            alt={productData?.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="mt-2 flex flex-col space-y-3 px-2 pb-3">
          <h3 className="line-clamp-1 text-xl font-semibold text-gray-800">
            {productData?.name || "Produk Umrah"}
          </h3>
          <hr className="text-gray-200" />
          <div>
            <p className="text-sm">harga mulai dari:</p>
            <p className="text-primary text-xl font-bold">
              Rp {roomPrice.toLocaleString("id-ID")}
            </p>
          </div>

          <button
            onClick={() => setShowDetail(true)}
            className="text-primary mt-2 text-sm font-medium underline transition hover:opacity-80"
          >
            Lihat Detail Paket
          </button>
        </div>
      </div>

      {/* Modal Detail Paket */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowDetail(false)}
              className="hover:text-primary absolute top-4 right-4 text-gray-500 transition"
              aria-label="Tutup"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
              <FaSuitcase /> Detail Paket: {productData?.name}
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              {/* Durasi dan Tanggal */}
              <div className="flex items-center gap-2">
                <FaRegClock />
                <span>{productData.duration} Hari</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>
                  Berangkat:{" "}
                  {new Date(productData.departure_date).toLocaleDateString(
                    "id-ID",
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>
                  Pulang:{" "}
                  {new Date(productData.return_date).toLocaleDateString(
                    "id-ID",
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>Kota Keberangkatan: {productData.departure_city}</span>
              </div>

              {/* Info Pesawat */}
              {flight && (
                <div className="mt-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <FaPlane /> Penerbangan
                  </h4>
                  <div className="ml-2 flex flex-col gap-1">
                    <span>Maskapai: {flight.airline.name}</span>
                    <span>Nomor Penerbangan: {flight.flight_number}</span>
                    <span>
                      Bandara: {flight.departure_airport} →{" "}
                      {flight.arrival_airport}
                    </span>
                    <span>
                      Waktu:{" "}
                      {new Date(flight.departure_datetime).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Info Hotel */}
              {hotel && (
                <div className="mt-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <FaHotel /> Hotel
                  </h4>
                  <div className="ml-2 flex flex-col gap-1">
                    <span>Nama: {hotel.name}</span>
                    <span>Bintang: {hotel.stars}</span>
                    <span>Lokasi: {hotel.city}</span>
                    <span>Fasilitas: {hotel.facility}</span>
                    <span>Jarak ke Haram: {hotel.distance_to_haram} m</span>
                  </div>
                </div>
              )}

              {/* Fasilitas */}
              <div className="mt-4">
                <h4 className="mb-1 flex items-center gap-2 font-semibold">
                  <FaCheckCircle className="text-green-600" /> Termasuk:
                </h4>
                <ul className="ml-6 list-disc">
                  {includes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-1 flex items-center gap-2 font-semibold">
                  <FaTimesCircle className="text-red-600" /> Tidak Termasuk:
                </h4>
                <ul className="ml-6 list-disc">
                  {excludes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Itinerary */}
              {itinerary && (
                <div className="mt-4">
                  <h4 className="mb-1 flex items-center gap-2 font-semibold">
                    <FaListUl /> Itinerary Hari {itinerary.day}
                  </h4>
                  <p className="font-medium">{itinerary.title}</p>
                  <p>{itinerary.description}</p>
                </div>
              )}

              {/* Syarat dan Ketentuan */}
              <div className="mt-4">
                <h4 className="mb-1 flex items-center gap-2 font-semibold">
                  <FaInfoCircle /> Syarat & Ketentuan
                </h4>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: productData.terms_conditions,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
