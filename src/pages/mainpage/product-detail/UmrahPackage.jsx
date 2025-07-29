import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaUserFriends,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { formatRupiah } from "./utils";

const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UmrahPackage({ data }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  const handleOrder = (id) => {
    navigate(`/produk/order/${id}`);
  };

  const renderImage = (i) => {
    if (!data?.images?.[i]?.image_path) return "/placeholder-hotel.jpg";
    return `${$BASE_URL}/${data.images[i].image_path}`;
  };

  const changeMainImage = (index) => {
    if (index === mainImage) return;
    setLoadingImage(true);
    setMainImage(index);
  };

  const packageHighlights = [
    {
      icon: <FaStar className="text-yellow-500" />,
      text: `Hotel Bintang ${data?.hotels[0]?.hotel?.stars || 0}`,
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <FaUserFriends className="text-blue-500" />,
      text: `Kuota: ${data?.remaining_quota || 0}/${data?.quota || 0}`,
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <FaCalendarAlt className="text-emerald-500" />,
      text: `${data?.duration || 0} Hari`,
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <FaMapMarkerAlt className="text-rose-500" />,
      text: data?.hotels[0]?.hotel?.city || "Makkah & Madinah",
      color: "bg-blue-50 border-blue-200",
    },
  ];

  const formatPrices = () => {
    const priceTypes = [
      {
        name: "1 Kamar 4 Orang",
        value: data?.price_quadraple,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 border-emerald-200",
      },
      {
        name: "1 Kamar 3 Orang",
        value: data?.price_tripple,
        color: "text-emerald-600",
        bgColor: "bg-blue-50 border-blue-200",
      },
      {
        name: "1 Kamar 2 Orang",
        value: data?.price_double,
        color: "text-emerald-600",
        bgColor: "bg-purple-50 border-purple-200",
      },
    ].filter(
      (price) =>
        price.value !== null && price.value !== undefined && price.value > 0,
    );

    if (priceTypes.length === 0) return null;

    return (
      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {priceTypes.map((price, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg ${price.bgColor}`}
            >
              <div className="relative">
                <div className="mb-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${price.color} bg-white/80`}
                  >
                    {price.name}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${price.color}`}>
                    {formatRupiah(price.value)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderThumbnails = () => {
    if (!data?.images || data.images.length === 0) {
      return (
        <div className="flex items-center justify-center">
          <button
            onClick={() => changeMainImage(0)}
            className={`aspect-square h-20 w-20 overflow-hidden rounded-xl transition-all duration-300 ${
              mainImage === 0
                ? "ring-primary ring-2 ring-offset-2"
                : "hover:scale-105 hover:shadow-md"
            }`}
          >
            <img
              src="/placeholder-hotel.jpg"
              alt="Placeholder"
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      );
    }

    const maxVisibleThumbnails = 5;
    const totalImages = data.images.length;

    const visibleImages = data.images.slice(
      startIndex,
      startIndex + maxVisibleThumbnails,
    );
    const canScrollLeft = startIndex > 0;
    const canScrollRight = startIndex + maxVisibleThumbnails < totalImages;

    const scrollLeft = () => {
      if (canScrollLeft) {
        setStartIndex(Math.max(0, startIndex - 1));
      }
    };

    const scrollRight = () => {
      if (canScrollRight) {
        setStartIndex(
          Math.min(totalImages - maxVisibleThumbnails, startIndex + 1),
        );
      }
    };

    return (
      <div className="flex items-center gap-3">
        {/* Left Arrow */}
        {totalImages > maxVisibleThumbnails && (
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`flex-shrink-0 rounded-full p-2 transition-all duration-300 ${
              canScrollLeft
                ? "hover:text-primary bg-white text-gray-700 shadow-md hover:shadow-lg"
                : "cursor-not-allowed bg-gray-100 text-gray-300"
            }`}
          >
            <IoIosArrowForward className="rotate-180" size={16} />
          </button>
        )}

        {/* Thumbnails */}
        <div className="flex gap-3 overflow-hidden">
          {visibleImages.map((img, i) => {
            const actualIndex = startIndex + i;
            return (
              <div
                key={actualIndex}
                className="flex flex-col items-center space-y-2"
              >
                <button
                  onClick={() => changeMainImage(actualIndex)}
                  className={`aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                    mainImage === actualIndex
                      ? "ring-primary scale-105 ring-2 ring-offset-2"
                      : "hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <img
                    src={`${$BASE_URL}/${img.image_path}`}
                    alt={img.caption || `Thumbnail ${actualIndex + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-hotel.jpg";
                    }}
                  />
                </button>
                {/* Thumbnail Caption */}
                {img.caption && (
                  <p
                    className="mt-4 max-w-20 truncate text-center text-xs text-gray-600"
                    title={img.caption}
                  >
                    {img.caption}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        {totalImages > maxVisibleThumbnails && (
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`flex-shrink-0 rounded-full p-2 transition-all duration-300 ${
              canScrollRight
                ? "hover:text-primary bg-white text-gray-700 shadow-md hover:shadow-lg"
                : "cursor-not-allowed bg-gray-100 text-gray-300"
            }`}
          >
            <IoIosArrowForward size={16} />
          </button>
        )}
      </div>
    );
  };

  if (!data) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-10">
        {/* Image Gallery - 4/10 */}
        <div className="space-y-6 lg:col-span-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
            {loadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <LoadingSpinner size="small" />
              </div>
            )}
            <img
              src={renderImage(mainImage)}
              alt="Main package"
              className={`h-full w-full object-cover transition-all duration-500 ${
                loadingImage ? "scale-110 opacity-0" : "scale-100 opacity-100"
              }`}
              onLoad={() => setLoadingImage(false)}
              onError={() => setLoadingImage(false)}
            />

            {/* Image overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Image counter */}
            {data?.images && data.images.length > 0 && (
              <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                {mainImage + 1} / {data.images.length}
              </div>
            )}

            {/* Image Caption */}
            {data?.images && data.images[mainImage]?.caption && (
              <div className="absolute right-20 bottom-3 left-4 rounded-lg bg-black/60 px-3 py-2 text-sm text-white backdrop-blur-sm">
                {data.images[mainImage].caption}
              </div>
            )}
          </div>

          <div className="flex justify-center">{renderThumbnails()}</div>
        </div>

        {/* Package Details - 6/10 */}
        <div className="space-y-8 lg:col-span-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                data?.remaining_quota
                  ? "border border-emerald-200 bg-emerald-100 text-emerald-800"
                  : "border border-rose-200 bg-rose-100 text-rose-800"
              }`}
            >
              <div
                className={`mr-2 h-2 w-2 rounded-full ${
                  data?.remaining_quota ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              {data?.remaining_quota ? "Tersedia" : "Habis"}
            </span>
          </div>

          {/* Title and Rating */}
          <div className="space-y-4">
            <h1 className="font-lora text-3xl leading-tight font-bold text-gray-900 lg:text-4xl">
              {data?.name || "Paket Umroh"}
            </h1>

            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="text-lg">
                    {i < Math.floor(data?.hotels[0]?.hotel?.stars || 0)
                      ? "★"
                      : "☆"}
                  </span>
                ))}
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
                {data?.hotels[0]?.hotel?.stars || 0} Bintang
              </span>
            </div>
          </div>

          {/* Package Highlights */}
          <div className="grid grid-cols-2 gap-4">
            {packageHighlights.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${item.color}`}
              >
                <div className="flex-shrink-0 text-lg">{item.icon}</div>
                <span className="text-sm font-medium text-gray-700">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Prices */}
          {formatPrices()}

          {/* Booking Button */}
          <div className="pt-4">
            <button
              onClick={() => handleOrder(id)}
              disabled={!data?.remaining_quota}
              className={`group relative w-full overflow-hidden rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ${
                data?.remaining_quota
                  ? "bg-primary hover:bg-primary-dark hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000 group-hover:translate-x-[100%]" />
              <span className="relative flex items-center justify-center gap-2">
                {data?.remaining_quota ? "Pesan Sekarang" : "Kuota Habis"}
                {data?.remaining_quota && (
                  <IoIosArrowForward className="transform transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UmrahPackage;
