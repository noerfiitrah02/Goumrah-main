import { Layout } from "../../components/layout/Layout";
import {
  FaEnvelope,
  FaWhatsappSquare,
  FaPhone,
  FaClock,
  FaHeadset,
  FaComments,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FloatingWhatsApp } from "../../components/ui/FloatingWhatsApp";

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export function FormWhatsApp() {
  const [nama, setNama] = useState("");
  const [paket, setPaket] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jenisKonsultasi, setJenisKonsultasi] = useState("");
  const [error, setError] = useState("");

  const packages = [
    { value: "", label: "Pilih Paket Umrah" },
    { value: "Ekonomi", label: "Paket Ekonomi - Mulai 25 Juta" },
    { value: "Reguler", label: "Paket Reguler - Mulai 35 Juta" },
    { value: "VIP", label: "Paket VIP - Mulai 50 Juta" },
    { value: "Premium", label: "Paket Premium - Mulai 70 Juta" },
  ];

  const konsultasiTypes = [
    { value: "", label: "Pilih Jenis Konsultasi" },
    { value: "Informasi Paket", label: "Informasi Paket & Harga" },
    { value: "Jadwal Keberangkatan", label: "Jadwal Keberangkatan" },
    { value: "Syarat & Ketentuan", label: "Syarat & Ketentuan" },
    { value: "Konsultasi Ibadah", label: "Konsultasi Ibadah" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  const handleKirim = () => {
    if (!nama || !jenisKonsultasi) {
      setError("Nama dan jenis konsultasi harus diisi!");
      return;
    }
    setError("");
    const noWa = "6285603623523";
    let pesan = `Halo GoUmrah! Saya ${nama}, ingin ${jenisKonsultasi.toLowerCase()}`;

    if (paket) {
      pesan += ` untuk ${paket}`;
    }
    if (tanggal) {
      pesan += ` dengan keberangkatan ${tanggal}`;
    }
    pesan += ". Mohon informasi lebih lanjut. Terima kasih!";

    const url = `https://wa.me/${noWa}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      className="mx-auto max-w-md space-y-4 rounded-lg border border-green-100 bg-white p-6 shadow-lg"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Konsultasi Gratis via WhatsApp
        </h3>
        <p className="text-sm text-gray-600">
          Dapatkan informasi lengkap tentang paket umrah terbaik
        </p>
      </div>

      {error && (
        <motion.p
          className="rounded bg-red-50 p-2 text-sm text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      <input
        type="text"
        placeholder="Nama Lengkap *"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none"
        aria-label="Nama lengkap"
      />

      <select
        value={jenisKonsultasi}
        onChange={(e) => setJenisKonsultasi(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none"
        aria-label="Jenis konsultasi"
      >
        {konsultasiTypes.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.value === ""}
          >
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={paket}
        onChange={(e) => setPaket(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none"
        aria-label="Pilih paket umrah"
      >
        {packages.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.value === ""}
          >
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none"
        aria-label="Tanggal keberangkatan"
        min={new Date().toISOString().split("T")[0]}
      />

      <button
        onClick={handleKirim}
        className="w-full transform rounded-full bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-lg active:scale-95"
        aria-label="Kirim pesan via WhatsApp"
      >
        <FaWhatsappSquare className="mr-2 inline" />
        Chat via WhatsApp
      </button>

      <p className="text-center text-xs text-gray-500">
        Respon dalam 5 menit • Konsultasi 100% Gratis
      </p>
    </motion.div>
  );
}

// FAQ Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-gray-200 pb-4"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <button
        className="flex w-full items-center justify-between py-2 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span className="text-xl font-bold text-green-600">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="mt-2 text-gray-600">{answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export const Kontak = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const faqs = [
    {
      question: "Apa saja dokumen yang diperlukan untuk mendaftar umrah?",
      answer:
        "Dokumen yang diperlukan: KTP asli, KK, paspor (minimal 6 bulan), pas foto 4x6 berlatar putih, surat keterangan sehat, dan surat mahram (untuk wanita).",
    },
    {
      question: "Berapa lama proses pengurusan visa umrah?",
      answer:
        "Proses pengurusan visa umrah biasanya memakan waktu 7-14 hari kerja, tergantung kondisi dan kelengkapan dokumen yang diserahkan.",
    },
    {
      question: "Apakah ada kebijakan pembatalan dan refund?",
      answer:
        "Ya, kami memiliki kebijakan pembatalan yang fleksibel. Untuk detail lengkap mengenai syarat dan ketentuan refund, silakan hubungi customer service kami.",
    },
    {
      question: "Bagaimana sistem pembayaran untuk paket umrah?",
      answer:
        "Kami menyediakan sistem pembayaran yang fleksibel mulai dari cash, cicilan 0%, hingga pembayaran bertahap. Konsultasikan dengan tim kami untuk pilihan yang sesuai.",
    },
  ];

  return (
    <Layout page="Kontak">
      <div className="container mx-auto px-4 py-8" ref={contentRef}>
        {/* Hero Section */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text font-serif text-4xl font-bold text-transparent md:text-5xl">
            Wujudkan Impian Umrah Anda Bersama GoUmrah
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Tim profesional kami siap membantu Anda merencanakan perjalanan
            spiritual yang berkesan. Dengan pengalaman lebih dari 10 tahun, kami
            berkomitmen memberikan pelayanan terbaik untuk setiap jamaah.
          </p>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-green-100 bg-white p-6 shadow-lg"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="rounded-full bg-green-100 p-3">
              <FaWhatsappSquare className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">+62 856 0362 3523</p>
            <p className="text-center text-sm text-gray-600">
              Chat langsung dengan tim kami
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-green-100 bg-white p-6 shadow-lg"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="rounded-full bg-green-100 p-3">
              <FaEnvelope className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">goumrah@gmail.com</p>
            <p className="text-center text-sm text-gray-600">
              Email untuk informasi detail
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-green-100 bg-white p-6 shadow-lg"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="rounded-full bg-green-100 p-3">
              <FaPhone className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">+62 21 5265235</p>
            <p className="text-center text-sm text-gray-600">
              Hubungi via telepon
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-green-100 bg-white p-6 shadow-lg"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="rounded-full bg-green-100 p-3">
              <FaComments className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Dukungan Jamaah</p>
            <p className="text-center text-sm text-gray-600">
              Siap membantu setiap pertanyaan
            </p>
          </motion.div>
        </motion.div>

        {/* WhatsApp Form and Office Info */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FormWhatsApp />

          <motion.div
            className="space-y-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Office Address */}
            <div className="rounded-lg border border-green-100 bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <FaLocationDot className="mr-2 text-green-600" />
                Alamat Kantor
              </h3>
              <p className="mb-3 text-gray-700">
                Jl. Gatot Subroto No. 58, Kuningan, Jakarta Selatan 12950
                Indonesia
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-6">
              <h3 className="mb-4 flex items-center text-xl font-semibold text-red-900">
                <FaHeadset className="mr-2 text-red-600" />
                Hotline Darurat
              </h3>
              <p className="text-lg font-semibold text-red-800">
                +62 812 8765 4321
              </p>
              <p className="text-sm text-red-700">
                Khusus untuk jamaah yang sedang di Tanah Suci
                <br />
                <span className="font-medium">Tersedia 24/7</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          className="mb-12 h-[450px] overflow-hidden rounded-xl shadow-lg"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <iframe
            title="Lokasi Kantor GoUmrah"
            src="https://maps.app.goo.gl/BeTkxTUrXBdQGheJ8"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mb-12 rounded-lg border border-green-100 bg-white p-8 shadow-lg"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="mb-8 flex items-center justify-center text-center text-3xl font-semibold text-gray-900">
            <FaComments className="mr-3 text-green-600" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="rounded-lg bg-gradient-to-r from-green-600 to-green-800 p-8 text-center text-white shadow-lg"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="mb-4 text-2xl font-bold">
            Siap Memulai Perjalanan Spiritual Anda?
          </h3>
          <p className="mb-6 text-lg opacity-90">
            Dapatkan konsultasi gratis dan penawaran terbaik untuk paket umrah
            Anda
          </p>
          <button
            onClick={() => {
              const noWa = "6285603623523";
              const pesan =
                "Halo GoUmrah! Saya ingin konsultasi tentang paket umrah/haji. Mohon informasi lebih lanjut.";
              const url = `https://wa.me/${noWa}?text=${encodeURIComponent(pesan)}`;
              window.open(url, "_blank");
            }}
            className="rounded-full bg-white px-8 py-3 font-semibold text-green-600 shadow-lg transition-colors hover:bg-gray-100"
          >
            Konsultasi Gratis Sekarang
          </button>
        </motion.div>
      </div>
      <FloatingWhatsApp />
    </Layout>
  );
};
