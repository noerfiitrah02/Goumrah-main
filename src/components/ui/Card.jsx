import { FaEye } from "react-icons/fa";
import { MdDateRange, MdOutlineLocationOn } from "react-icons/md";
import { RiHotelLine } from "react-icons/ri";
import imageDummy from "/blog.png";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export const Card = ({ product }) => {
  const navigate = useNavigate();
  const handleProductDetail = (id) => {
    if (id) {
      navigate(`/produk/detail/${id}`);
    }
  };

  return (
    <div className="flex h-full w-full max-w-xs flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="relative m-2 aspect-square overflow-hidden rounded-lg">
        <div className="bg-gradient absolute top-0 left-0 rounded-br-xl p-1 px-2 text-sm font-medium text-white/50">
          {product.category_id == 1 ? "Umrah" : "Haji"}
        </div>
        <div className="h-auto w-auto transition-transform duration-500 group-hover:scale-110">
          <img
            src={`${$BASE_URL}/${product.featured_image}`}
            className="h-full w-full transition-transform duration-500 group-hover:scale-110"
            alt=""
          />
        </div>
        <div className="text-primary absolute right-0 bottom-0 rounded-tl-xl bg-white p-1 px-2 text-sm font-medium">
          {formatRupiah(product.price_quadraple)}
        </div>
      </div>

      {/* Body */}
      <div className="w-full flex-grow space-y-2 p-4 text-sm text-gray-700">
        <h3 className="line-clamp-1 text-xl font-semibold text-gray-900">
          {product.name}
        </h3>

        <ul className="space-y-1 text-gray-700">
          <li className="flex items-center gap-2">
            <MdDateRange />
            <p>Keberangkatan:</p>
            <p>
              <strong>
                {dayjs(product.departure_date).format("D MMM YY")}
              </strong>
            </p>
          </li>

          <li className="flex items-center gap-2">
            <RiHotelLine />
            <p> Kelas Hotel:</p>

            <span className="text-yellow-500">
              {Array.from({ length: 5 }, (_, i) => {
                const stars = parseFloat(product?.hotels[0]?.hotel?.stars);
                const fullStars = Math.floor(stars);
                const hasHalf = stars - fullStars >= 0.5;

                if (i < fullStars) return <span key={i}>★</span>;
                return <span key={i}>☆</span>;
              })}
            </span>
          </li>

          <li className="flex items-center gap-2">
            <MdOutlineLocationOn /> Berangkat dari:{" "}
            <strong>{product.departure_city}</strong>
          </li>
        </ul>
      </div>

      {/* Button */}
      <div className="px-4 py-3">
        <button
          onClick={() => {
            handleProductDetail(product.id);
          }}
          className="bg-primary w-full rounded-full py-2 font-semibold text-white transition hover:bg-green-700"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export const CardBlog = ({ content, categorySlug, postSlug, index = 0 }) => {
  const navigate = useNavigate();
  const {
    title,
    excerpt,
    published_at,
    author,
    category,
    featured_image,
    views,
    tags,
  } = content;

  const imageUrl = featured_image
    ? `${$BASE_URL}/${featured_image}`
    : imageDummy;
  const formattedDate = dayjs(published_at).format("D MMMM YYYY");

  const handleViewDetail = () => {
    navigate(`/blog/${categorySlug}/${postSlug}`);
  };

  return (
    <div className="flex h-full max-w-xs flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div
        className="group relative m-2 h-48 cursor-pointer overflow-hidden rounded-lg"
        onClick={handleViewDetail}
      >
        <div className="absolute top-0 left-0 z-10 rounded-br-lg bg-green-600 px-3 py-1 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {category?.name || "Umrah"}
        </div>
        <div className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-bl-lg bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <FaEye />
          <span>{views || 0}</span>
        </div>
        <div className="h-full w-full overflow-hidden">
          <img
            src={imageUrl}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={title}
            onError={(e) => {
              e.target.src = imageDummy;
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col space-y-2 p-4 text-sm text-gray-700">
        <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
          {title}
        </h3>
        <p className="line-clamp-3 text-gray-600">{excerpt}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">
            {author?.name || "Anonim"}
          </span>
          <span className="text-gray-400">{formattedDate}</span>
        </div>
      </div>

      {/* Button */}
      <div className="px-3 py-4">
        <button
          onClick={handleViewDetail}
          className="bg-primary w-full rounded-full py-2 font-semibold text-white transition hover:bg-green-700"
        >
          Baca Selengkapnya
        </button>
      </div>
    </div>
  );
};
