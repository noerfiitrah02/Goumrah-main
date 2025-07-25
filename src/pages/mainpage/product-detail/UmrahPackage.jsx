import { useNavigate, useParams } from "react-router-dom";
import image from "../../../assets/makkah-1.png";
import { formatRupiah } from "./utils";

function UmrahPackage({ data }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleOrder = (id) => {
    navigate(`/produk/order/${id}`);
  };

  const renderImage = (i) =>
    data?.images?.[i]?.image_path
      ? `http://localhost:5000/${data.images[i].image_path}`
      : image;

  return (
    <div className="grid grid-cols-1 gap-8 pb-16 md:grid-cols-2">
      <div className="flex gap-4 max-lg:flex-col-reverse lg:flex-row">
        <div className="md:flex-com scrollbar-none flex gap-2 overflow-scroll lg:flex-row">
          <div className="flex gap-2 max-lg:flex-row lg:flex-col">
            {[0, 1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={renderImage(i)}
                alt={`thumb${i}`}
                className={`aspect-square w-16 rounded-lg ${
                  i >= 3 ? "lg:hidden" : ""
                }`}
              />
            ))}
          </div>
           <div className="flex gap-2 max-lg:hidden md:flex-row lg:flex-col">
            {[1, 2].map((i) => (
              <img
                key={i}
                src={renderImage(i)}
                alt={`thumb${i}`}
                className="aspect-square w-16 rounded-lg"
              />
            ))}
          </div>
        </div>
        <div>
          <img
            src={renderImage(0)}
            alt="Ka'bah"
            className="aspect-square h-full w-full rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div
          className={`flex gap-2 text-sm font-semibold ${
            data?.remaining_quota ? "text-primary" : "text-red-700"
          }`}
        >
          <p>Availability:</p>
          <p>{data?.remaining_quota ? "In stock" : "Out of stock"}</p>
        </div>

        <h2 className="font-bold max-lg:text-2xl lg:text-3xl">
          {data?.name || "Paket Umroh Makkah"}
        </h2>

        <div className="flex items-center space-x-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => {
              const stars = parseFloat(data?.hotels[0]?.hotel?.stars) || 0;
              return <span key={i}>{i < Math.floor(stars) ? "★" : "☆"}</span>;
            })}
          </div>
          <p className="text-sm text-gray-600">
            ({data?.hotels[0]?.hotel?.stars || 0} Bintang Hotel)
          </p>
        </div>

        <p className="font-bold text-gray-800 max-lg:text-xl lg:text-2xl">
          {formatRupiah(data?.price_quadraple)}
          <span className="text-sm font-normal">/orang</span>
        </p>

        <div className="mb-4 text-sm leading-relaxed text-gray-700">
          {data?.includes && (
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Harga Termasuk:</span>{" "}
                {Array.isArray(data.includes)
                  ? data.includes.join(" | ")
                  : JSON.parse(data.includes || "[]").join(" | ")}
              </div>
              <div>
                <span className="font-semibold">Harga Tidak Termasuk:</span>{" "}
                {Array.isArray(data.excludes)
                  ? data.excludes.join(", ")
                  : JSON.parse(data.excludes || "[]").join(", ")}
              </div>
              <div>
                <span className="font-semibold">Sisa Kuota:</span>{" "}
                {data?.remaining_quota} dari {data?.quota} jamaah
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => handleOrder(id)}
          className="bg-primary rounded-full px-4 py-2 font-semibold text-white"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}

export default UmrahPackage;
