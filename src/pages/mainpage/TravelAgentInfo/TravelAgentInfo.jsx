import { useParams } from "react-router-dom";
import logoImage from "../../../assets/logo.png";
import { FooterSecond } from "../../../components/common/Footer";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Card } from "../../../components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

const TravelAgentInfo = () => {
  const [agent, setAgent] = useState([]);
  const [products, setProducts] = useState([]);
  const { id } = useParams();

  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fecth = async () => {
      try {
        const res = await api.get(`/travel/info/${id}`);
        const res2 = await api.get(`/packages/travel/${id}`);
        setAgent(res.data.data);
        setProducts(res2.data.data);
      } catch (err) {}
    };
    fecth();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-[1064px] px-4 py-4">
          <img src={logoImage} className="h-10" alt="Logo GoUmrah" />
        </div>
      </header>

      <main className="mx-auto max-w-[1064px] space-y-8 px-4 py-6">
        {/* Card 1: Info Travel Agent */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Logo & Nama */}
            <div className="flex items-center gap-4">
              <img
                src={`${$BASE_URL}/${agent.logo}`}
                alt={agent.travel_name}
                className="h-20 w-20 rounded-full border object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {agent.travel_name}
                </h2>
                <p className="text-sm text-gray-500">{}</p>
              </div>
            </div>

            {/* Tombol */}
            <div className="flex gap-2">
              <button className="rounded-full border px-4 py-1 text-sm font-medium hover:bg-gray-100">
                Ikuti
              </button>
              <button className="bg-primary rounded-full border px-4 py-1 text-sm font-medium text-white">
                Chat
              </button>
            </div>
          </div>

          {/* Info Detail */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600 md:grid-cols-3">
            <p>
              <span className="font-semibold text-gray-800">Produk:</span> {}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Pengikut:</span> {}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Penilaian:</span> ⭐{" "}
              {}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Bergabung:</span> {}
            </p>
            <p>
              <span className="font-semibold text-gray-800">No. HP:</span>{" "}
              {agent.phone_number}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Alamat:</span>{" "}
              {agent.address}
            </p>
          </div>
        </div>

        {/* Card 2: Daftar Produk */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Paket dari Travel Ini
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {products.map((product, i) => (
                <motion.div
                  key={product.id || i}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <FooterSecond />
    </div>
  );
};

export default TravelAgentInfo;
