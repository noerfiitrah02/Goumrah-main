import { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaHotel,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaFileContract,
  FaPlaneArrival,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaExpand,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { BiTrip } from "react-icons/bi";

function UmrahTabs({ data }) {
  const [activeTab, setActiveTab] = useState("description");
  const [showAllItinerary, setShowAllItinerary] = useState(false);

  const tabs = [
    {
      key: "description",
      label: "Fasilitas",
      icon: <FaInfoCircle className="mr-2" />,
    },
    { key: "itinerary", label: "Itinerary", icon: <BiTrip className="mr-2" /> },
    {
      key: "flight",
      label: "Penerbangan",
      icon: <FaPlaneDeparture className="mr-2" />,
    },
    { key: "hotel", label: "Hotel", icon: <FaHotel className="mr-2" /> },
    {
      key: "terms",
      label: "Syarat & Ketentuan",
      icon: <FaFileContract className="mr-2" />,
    },
  ];

  // Hotel Image Carousel Component
  const HotelImageCarousel = ({ images, hotelName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const nextImage = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
      return (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
          <FaHotel className="text-gray-400" size={48} />
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <div className="group/img relative aspect-video overflow-hidden rounded-xl shadow-md">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${images[0].image_path}`}
            alt={images[0].caption || hotelName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300";
            }}
          />
        </div>
      );
    }

    return (
      <>
        <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${images[currentIndex].image_path}`}
            alt={images[currentIndex].caption || hotelName}
            className="h-full w-full object-cover transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300";
            }}
          />

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
          >
            <FaChevronLeft size={12} />
          </button>

          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
          >
            <FaChevronRight size={12} />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
          >
            <FaExpand size={12} />
          </button>

          {/* Image Counter */}
          <div className="absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {currentIndex + 1}/{images.length}
          </div>

          {/* Image Caption */}
          {images[currentIndex].caption && (
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-sm font-medium text-white">
                {images[currentIndex].caption}
              </p>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  idx === currentIndex
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${img.image_path}`}
                  alt={img.caption || `Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/64x64";
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${images[currentIndex].image_path}`}
                alt={images[currentIndex].caption || hotelName}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderIncludesExcludes = () => {
    const includes = Array.isArray(data?.includes)
      ? data.includes
      : JSON.parse(data?.includes || "[]");

    const excludes = Array.isArray(data?.excludes)
      ? data.excludes
      : JSON.parse(data?.excludes || "[]");

    return (
      <div className="space-y-8">
        {/* Grid Layout for Desktop */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Included Facilities */}
          <div className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-green-50 to-green-100/50 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="bg-primary flex items-center rounded-t-2xl px-6 py-4 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <FaCheckCircle size={20} />
              </div>
              <h3 className="ml-3 text-xl font-bold">Fasilitas Termasuk</h3>
            </div>
            <div className="p-6">
              {includes.length > 0 ? (
                <ul className="space-y-4">
                  {includes.map((item, idx) => (
                    <li key={`inc-${idx}`} className="group flex items-start">
                      <div className="mt-1 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-sm transition-transform group-hover:scale-110">
                        <FaCheck size={12} />
                      </div>
                      <span className="leading-relaxed text-gray-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-emerald-600 italic">
                  Tidak ada fasilitas termasuk yang tersedia
                </p>
              )}
            </div>
          </div>

          {/* Excluded Facilities */}
          <div className="group rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center rounded-t-2xl bg-rose-500 px-6 py-4 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <FaTimesCircle size={20} />
              </div>
              <h3 className="ml-3 text-xl font-bold">
                Fasilitas Tidak Termasuk
              </h3>
            </div>
            <div className="p-6">
              {excludes.length > 0 ? (
                <ul className="space-y-4">
                  {excludes.map((item, idx) => (
                    <li key={`exc-${idx}`} className="group flex items-start">
                      <div className="mt-1 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition-transform group-hover:scale-110">
                        <FaTimes size={12} />
                      </div>
                      <span className="leading-relaxed text-gray-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-rose-600 italic">
                  Tidak ada fasilitas tidak termasuk yang tersedia
                </p>
              )}
            </div>
          </div>
        </div>

        {includes.length === 0 && excludes.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 text-center shadow-lg">
            <div className="mb-2 flex items-center justify-center">
              <FaInfoCircle className="mr-2 text-amber-500" size={24} />
              <span className="text-lg font-semibold text-amber-800">
                Informasi Tidak Tersedia
              </span>
            </div>
            <p className="text-amber-700">
              Tidak ada informasi fasilitas yang tersedia saat ini
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderItinerary = () => {
    const sortedItineraries = [...(data?.itineraries || [])].sort(
      (a, b) => a.day - b.day,
    );

    if (sortedItineraries.length === 0) {
      return (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow-lg">
          <BiTrip className="mx-auto mb-4 text-blue-400" size={48} />
          <p className="text-lg font-medium text-blue-600">
            Tidak ada informasi itinerary tersedia
          </p>
        </div>
      );
    }

    const displayedItineraries = showAllItinerary
      ? sortedItineraries
      : sortedItineraries.slice(0, 5);

    return (
      <div className="space-y-6">
        {/* Itinerary Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" size={16} />
              <span className="text-sm font-semibold text-blue-800">
                Total {sortedItineraries.length} Hari
              </span>
            </div>
          </div>
          {sortedItineraries.length > 5 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2">
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-amber-600" size={16} />
                <span className="text-sm font-semibold text-amber-800">
                  {showAllItinerary
                    ? "Menampilkan Semua"
                    : `Menampilkan 5 dari ${sortedItineraries.length}`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="from-primary to-primary/30 absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b"></div>

          {displayedItineraries.map((item, index) => (
            <div key={index} className="relative mb-8 last:mb-0">
              <div className="flex items-start">
                {/* Timeline dot */}
                <div className="bg-primary relative z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-4 ring-white">
                  <span className="text-sm font-bold text-white">
                    {item.day}
                  </span>
                </div>

                {/* Content card */}
                <div className="ml-6 flex-1">
                  <div className="group hover:border-primary/30 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="group-hover:text-primary text-xl font-bold text-gray-900 transition-colors">
                        Hari ke-{item.day}: {item.title}
                      </h3>
                      {item.location && (
                        <div className="mt-2 flex items-center md:mt-0">
                          <div className="flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm text-rose-600">
                            <FaMapMarkerAlt className="mr-1" />
                            {item.location}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {sortedItineraries.length > 5 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAllItinerary(!showAllItinerary)}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
            >
              {showAllItinerary ? (
                <>
                  <FaChevronUp size={16} />
                  Tampilkan Lebih Sedikit
                </>
              ) : (
                <>
                  <FaChevronDown size={16} />
                  Lihat Semua Itinerary ({sortedItineraries.length - 5} lainnya)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const FlightCard = ({ flight }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="group hover:border-primary/30 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Flight Header */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!imageError && flight.airline?.logo ? (
                <div className="flex-shrink-0">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/${flight.airline.logo}`}
                    alt={flight.airline.name}
                    className="h-12 w-12 rounded-lg bg-white object-contain p-2 shadow-sm"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm">
                  <FaPlaneDeparture className="text-blue-600" size={20} />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {flight.airline?.name}
                </h3>
                <p className="text-sm text-gray-600">{flight.flight_number}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm">
                {flight.flight_type === "departure"
                  ? "Keberangkatan"
                  : "Kepulangan"}
              </div>
            </div>
          </div>
        </div>

        {/* Flight Route */}
        <div className="px-6 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-gray-900">
                {flight.departure_airport}
              </div>
              <div className="text-sm text-gray-500">Keberangkatan</div>
            </div>

            <div className="flex items-center px-4">
              <div className="h-0.5 w-12 bg-gray-300"></div>
              <div className="mx-3 rounded-full bg-blue-100 p-2">
                <FaPlaneDeparture className="text-blue-600" size={16} />
              </div>
              <div className="h-0.5 w-12 bg-gray-300"></div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-gray-900">
                {flight.arrival_airport}
              </div>
              <div className="text-sm text-gray-500">Tiba</div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-3 flex items-center">
                <div className="mr-3 rounded-full bg-emerald-100 p-2">
                  <FaPlaneDeparture className="text-emerald-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">
                    Keberangkatan
                  </p>
                  <p className="text-sm text-emerald-600">
                    {flight.departure_airport}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-emerald-600" size={12} />
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(flight.departure_datetime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-emerald-600" size={12} />
                  <p className="text-lg font-bold text-emerald-700">
                    {formatTime(flight.departure_datetime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="mb-3 flex items-center">
                <div className="mr-3 rounded-full bg-blue-100 p-2">
                  <FaPlaneArrival className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Kedatangan</p>
                  <p className="text-sm text-blue-600">
                    {flight.arrival_airport}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" size={12} />
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(flight.arrival_datetime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-blue-600" size={12} />
                  <p className="text-lg font-bold text-blue-700">
                    {formatTime(flight.arrival_datetime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fungsi helper untuk format tanggal/waktu
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFlights = () => {
    // Pisahkan penerbangan berdasarkan type
    const departureFlights =
      data?.flights?.filter((flight) => flight.flight_type === "departure") ||
      [];
    const returnFlights =
      data?.flights?.filter((flight) => flight.flight_type === "return") || [];

    if (!departureFlights.length && !returnFlights.length) {
      return (
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center shadow-lg">
          <FaPlaneDeparture className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg font-medium text-gray-600">
            Tidak ada informasi penerbangan tersedia
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Departure Flights */}
        {departureFlights.length > 0 && (
          <div>
            <div className="mb-4 flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                <FaPlaneDeparture className="text-white" size={16} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Penerbangan Keberangkatan
              </h3>
            </div>
            <div className="space-y-4">
              {departureFlights.map((flight, i) => (
                <FlightCard key={`departure-${i}`} flight={flight} />
              ))}
            </div>
          </div>
        )}

        {/* Return Flights */}
        {returnFlights.length > 0 && (
          <div>
            <div className="mb-4 flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                <FaPlaneArrival className="text-white" size={16} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Penerbangan Kepulangan
              </h3>
            </div>
            <div className="space-y-4">
              {returnFlights.map((flight, i) => (
                <FlightCard key={`return-${i}`} flight={flight} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHotels = () => (
    <div className="space-y-8">
      {data?.hotels?.map((item, i) => (
        <div
          key={i}
          className="group hover:border-primary/30 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Hotel Images Gallery */}
            <div className="w-full p-6 lg:w-2/5">
              <HotelImageCarousel
                images={item.hotel?.images || []}
                hotelName={item.hotel?.name || "Hotel"}
              />
            </div>

            {/* Hotel Info */}
            <div className="flex-1 p-6">
              <div className="mb-4 flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="group-hover:text-primary mb-2 text-2xl font-bold text-gray-900 transition-colors">
                    {item.hotel?.name}
                  </h3>
                  <div className="mb-3 flex items-center">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, starIdx) => (
                        <FaStar
                          key={starIdx}
                          className={`h-4 w-4 ${
                            starIdx < item.hotel?.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      ({item.hotel?.stars} Bintang)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="bg-primary/10 text-primary border-primary/20 rounded-full border px-4 py-2 text-sm font-semibold">
                    {item.check_in_date} - {item.check_out_date}
                  </div>
                </div>
              </div>

              <p className="mb-4 leading-relaxed text-gray-600">
                {item.hotel?.address}
              </p>

              {item.hotel?.facility && (
                <div className="mb-6">
                  <h4 className="mb-3 flex items-center font-semibold text-gray-900">
                    <FaCheckCircle className="mr-2 text-emerald-500" />
                    Fasilitas Hotel
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.hotel.facility.split(",").map((facility, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        {facility.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.hotel?.map_url && (
                <a
                  href={item.hotel.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
                >
                  <FaMapMarkerAlt />
                  Lihat di Maps
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {(!data?.hotels || data.hotels.length === 0) && (
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center shadow-lg">
          <FaHotel className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg font-medium text-gray-600">
            Tidak ada informasi hotel tersedia
          </p>
        </div>
      )}
    </div>
  );

  const tabContent = {
    description: renderIncludesExcludes(),
    itinerary: renderItinerary(),
    flight: renderFlights(),
    hotel: renderHotels(),
    terms: (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="from-primary to-primary-dark bg-gradient-to-r px-6 py-4">
          <h3 className="flex items-center text-xl font-bold text-white">
            <FaFileContract className="mr-3" />
            Syarat dan Ketentuan
          </h3>
        </div>
        <div className="p-6">
          {data?.terms_conditions ? (
            <div
              className="prose prose-gray max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.terms_conditions }}
            />
          ) : (
            <div className="py-8 text-center">
              <FaFileContract
                className="mx-auto mb-4 text-gray-400"
                size={48}
              />
              <p className="text-lg font-medium text-gray-600">
                Tidak ada syarat dan ketentuan yang tersedia
              </p>
            </div>
          )}
        </div>
      </div>
    ),
  };

  return (
    <div className="mt-8">
      {/* Modern Tab Navigation */}
      <div className="relative">
        <div className="scrollbar-hide flex overflow-x-auto rounded-t-2xl border-b border-gray-200 bg-white shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`group relative flex items-center px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.key
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <div
                className={`transition-transform duration-300 ${
                  activeTab === tab.key ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                {tab.icon}
              </div>
              <span className="ml-2">{tab.label}</span>

              {/* Active tab indicator */}
              {activeTab === tab.key && (
                <div className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] rounded-b-2xl bg-gray-50 p-8">
        <div className="animate-fadeIn">{tabContent[activeTab]}</div>
      </div>
    </div>
  );
}

export default UmrahTabs;
