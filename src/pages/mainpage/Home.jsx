import { Card, CardBlog } from "../../components/ui/Card";
import { useEffect, useRef, useState } from "react";
import { LayoutHome } from "../../components/layout/Layout";
import logo from "../../assets/logo-remove-bg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "swiper/css/pagination";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStar,
  FaUsers,
  FaShieldAlt,
  FaHeart,
  FaPiggyBank,
  FaArrowRight,
  FaQuoteLeft,
  FaPlane,
} from "react-icons/fa";

const useInView = (options) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, options);

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, visible];
};

const HeroSection = () => {
  const [containerRef, containerVisible] = useInView({ threshold: 0.2 });
  const [jadwalOptions, setJadwalOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [jadwalFilter, setJadwalFilter] = useState(null);
  const [cityFilter, setCityFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const upcoming = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const from = `${year}-${month}-01`;
      const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();
      const to = `${year}-${month}-${lastDay}`;
      const label = `${months[date.getMonth()]} ${year}`;
      upcoming.push({ label, value: { from, to } });
    }
    setJadwalOptions(upcoming);

    const fetchCities = async () => {
      try {
        const res = await api.get("/packages");
        const data = res.data?.data || [];
        const cities = [
          ...new Set(data.map((pkg) => pkg.departure_city).filter(Boolean)),
        ];
        setCityOptions(cities);
      } catch (err) {
        console.error("Gagal mengambil kota:", err);
      }
    };

    fetchCities();
  }, []);

  const handleSearch = () => {
    const state = {};

    if (priceFilter) {
      if (priceFilter === "under30") state.max_price = 30000000;
      if (priceFilter === "under50") state.max_price = 50000000;
      if (priceFilter === "under70") state.max_price = 70000000;
    }

    if (jadwalFilter) {
      state.departure_date_from = jadwalFilter.value.from;
      state.departure_date_to = jadwalFilter.value.to;
    }

    if (cityFilter) {
      state.departure_city = cityFilter;
    }

    navigate("/produk", { state });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 transform rounded-full bg-white"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24 transform rounded-full bg-green-300"></div>
      </div>

      <div className="relative m-auto max-w-[1200px]">
        <div
          ref={containerRef}
          className={`px-4 py-12 transition-all duration-1000 ease-out ${
            containerVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          {/* Search Filter Section */}
          <div className="mb-8">
            <div className="mx-auto max-w-5xl rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
              <div className="mb-6 text-center">
                <h3 className="mb-2 text-2xl font-bold text-white">
                  Temukan Paket Umrah Ideal Anda
                </h3>
                <p className="text-green-100">
                  Gunakan filter di bawah untuk menemukan paket yang sesuai
                  dengan kebutuhan dan budget Anda
                </p>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {/* Price Filter */}
                <div className="relative">
                  <label className="mb-3 flex items-center text-sm font-semibold text-white">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                      <FaMoneyBillWave className="text-white" size={14} />
                    </div>
                    Rentang Harga
                  </label>
                  <select
                    className="w-full rounded-xl border-2 border-white/30 bg-white/10 p-4 text-white transition-all duration-200 hover:border-white/50 focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/20"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="" className="text-gray-800">
                      Pilih rentang harga
                    </option>
                    <option value="under30" className="text-gray-800">
                      Di bawah 30 Juta
                    </option>
                    <option value="under50" className="text-gray-800">
                      Di bawah 50 Juta
                    </option>
                    <option value="under70" className="text-gray-800">
                      Di bawah 70 Juta
                    </option>
                  </select>
                </div>

                {/* Schedule Filter */}
                <div className="relative">
                  <label className="mb-3 flex items-center text-sm font-semibold text-white">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                      <FaCalendarAlt className="text-white" size={14} />
                    </div>
                    Jadwal Keberangkatan
                  </label>
                  <select
                    className="w-full rounded-xl border-2 border-white/30 bg-white/10 p-4 text-white transition-all duration-200 hover:border-white/50 focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/20"
                    value={jadwalFilter?.label || ""}
                    onChange={(e) => {
                      const selected = jadwalOptions.find(
                        (opt) => opt.label === e.target.value,
                      );
                      setJadwalFilter(selected);
                    }}
                  >
                    <option value="" className="text-gray-800">
                      Pilih bulan keberangkatan
                    </option>
                    {jadwalOptions.map((item) => (
                      <option
                        key={item.label}
                        value={item.label}
                        className="text-gray-800"
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div className="relative">
                  <label className="mb-3 flex items-center text-sm font-semibold text-white">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                      <FaMapMarkerAlt className="text-white" size={14} />
                    </div>
                    Kota Keberangkatan
                  </label>
                  <select
                    className="w-full rounded-xl border-2 border-white/30 bg-white/10 p-4 text-white transition-all duration-200 hover:border-white/50 focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/20"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    <option value="" className="text-gray-800">
                      Pilih kota keberangkatan
                    </option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city} className="text-gray-800">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button
                    className="flex w-full transform items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 font-semibold text-green-700 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-xl"
                    onClick={handleSearch}
                  >
                    <FaSearch size={16} />
                    Cari Paket
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Content */}
          <div className="grid grid-cols-1 items-center lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                  🕌 Paket Terlaris 2024
                </span>
                <h2 className="mb-4 text-3xl leading-tight font-bold text-white lg:text-4xl">
                  Umrah Premium
                  <br />
                  Hotel Bintang 5
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-green-100">
                  Nikmati pengalaman umrah tak terlupakan dengan fasilitas
                  premium. Hotel mewah dekat Masjidil Haram, makanan Indonesia,
                  dan bimbingan spiritual terbaik.
                </p>
              </div>

              {/* Features List */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <FaShieldAlt className="text-white" size={14} />
                  </div>
                  <span className="text-sm text-white">
                    Berizin Resmi Kemenag
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <FaStar className="text-white" size={14} />
                  </div>
                  <span className="text-sm text-white">Hotel Bintang 5</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <FaUsers className="text-white" size={14} />
                  </div>
                  <span className="text-sm text-white">
                    Pembimbing Berpengalaman
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <FaPlane className="text-white" size={14} />
                  </div>
                  <span className="text-sm text-white">
                    Maskapai Terpercaya
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/produk")}
                  className="flex transform items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-green-700 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  Lihat Paket Umrah
                  <FaArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate("/tabungan")}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-white hover:text-green-700"
                >
                  <FaPiggyBank size={16} />
                  Tabungan Haji
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 lg:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Masjidil Haram"
                className="h-full w-full object-cover lg:rounded-l-3xl"
              />

              {/* Floating Stats Card */}
              <div className="absolute right-6 bottom-6 left-6 rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm lg:right-6 lg:left-auto lg:w-64">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">2,500+</p>
                    <p className="text-xs text-gray-600">Jamaah Dilayani</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">4.9</p>
                    <p className="text-xs text-gray-600">Rating Kepuasan</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={12} />
                  ))}
                  <span className="ml-2 text-xs text-gray-600">
                    dari 1,200+ ulasan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [textRef, textVisible] = useInView({ threshold: 0.2 });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await api.get("/packages/featured");
      setProducts(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      <div className="m-auto max-w-[1064px]">
        <div className="px-4 py-20">
          <div className="mb-16 text-center">
            <h2
              ref={textRef}
              className={`mb-4 text-3xl font-bold text-gray-900 transition-all duration-1000 ease-out lg:text-4xl ${
                textVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              Paket Umrah Pilihan
            </h2>
            <p
              className={`mx-auto max-w-2xl text-lg text-gray-600 transition-all delay-200 duration-1000 ease-out ${
                textVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              Pilihan paket umrah terbaik dengan fasilitas premium dan harga
              terjangkau
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
              <div key={product.id || index}>
                <Card product={product} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/produk")}
              className="transform rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
            >
              Lihat Semua Paket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [leftRef, leftVisible] = useInView({ threshold: 0.2 });
  const [rightRef, rightVisible] = useInView({ threshold: 0.2 });

  const testimonials = [
    {
      name: "Siti Fatimah",
      role: "Ibu Rumah Tangga",
      location: "Jakarta",
      review:
        "Alhamdulillah, pengalaman umrah bersama GoUmrah sangat berkesan. Pembimbingnya sabar dan ramah, hotel dekat dengan Masjidil Haram jadi mudah untuk shalat. Makanannya juga sesuai lidah Indonesia. Terima kasih GoUmrah!",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616c96e9948?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2 minggu yang lalu",
    },
    {
      name: "Ahmad Fauzi",
      role: "Wiraswasta",
      location: "Bandung",
      review:
        "Sudah 3 kali ikut umrah, baru kali ini merasa benar-benar tenang dan fokus ibadah. Pelayanannya detail banget, dari airport sampai hotel semua diurus. Guide-nya juga menguasai sejarah tempat-tempat suci. Recommended!",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "1 bulan yang lalu",
    },
    {
      name: "Hj. Mariam Sari",
      role: "Pensiunan PNS",
      location: "Surabaya",
      review:
        "Di usia 65 tahun, saya khawatir tidak kuat perjalanan panjang. Tapi tim GoUmrah sangat perhatian dengan kondisi jamaah senior. Ada kursi roda saat tawaf, makanan khusus, dan pendampingan 24 jam. Benar-benar merasa dijaga.",
      image:
        "https://images.unsplash.com/photo-1559027385-f4e11d9985a7?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "3 minggu yang lalu",
    },
    {
      name: "Dr. Budi Santoso",
      role: "Dokter",
      location: "Yogyakarta",
      review:
        "Sebagai dokter, saya cukup kritis dengan standar kebersihan dan kesehatan. GoUmrah memenuhi ekspektasi saya. Busnya bersih, hotel bintang 5 dekat Haram, dan ada medical kit lengkap. Istri yang awalnya ragu jadi tenang.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "1 bulan yang lalu",
    },
    {
      name: "Nur Aini",
      role: "Guru",
      location: "Medan",
      review:
        "Pertama kali umrah dan sempat nervous. Tapi dari briefing sampai pulang, semua dijelaskan dengan detail. Manasik umrahnya juga lengkap, jadi pas di sana sudah paham. Yang paling berkesan, bisa shalat tahajud di Masjid Nabawi dengan khusyuk.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2 bulan yang lalu",
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        size={14}
      />
    ));
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white mix-blend-multiply blur-3xl filter"></div>
        <div className="absolute right-10 bottom-20 h-72 w-72 rounded-full bg-green-300 mix-blend-multiply blur-3xl filter"></div>
      </div>

      <div className="relative m-auto max-w-[1064px]">
        <div className="px-4 py-20">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Left Section */}
            <div
              ref={leftRef}
              className={`text-white transition-all duration-1000 ease-out ${
                leftVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="mb-6">
                <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                  💬 Testimoni Jamaah
                </span>
                <h2 className="mb-6 text-3xl leading-tight font-bold lg:text-4xl">
                  Cerita Jamaah yang Telah Merasakan Pengalaman Bersama Kami
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-green-100">
                  Setiap perjalanan suci yang kami layani adalah amanah yang
                  kami jaga dengan sepenuh hati. Inilah testimoni nyata dari
                  jamaah yang telah mempercayakan ibadah umrah mereka kepada
                  GoUmrah.
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center lg:text-left">
                  <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                    <FaUsers className="text-green-200" size={24} />
                    <span className="text-3xl font-bold lg:text-4xl">
                      2,500+
                    </span>
                  </div>
                  <p className="text-green-200">Jamaah Dilayani</p>
                </div>
                <div className="text-center lg:text-left">
                  <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                    <FaStar className="text-yellow-400" size={24} />
                    <span className="text-3xl font-bold lg:text-4xl">4.9</span>
                  </div>
                  <p className="text-green-200">Rating Kepuasan</p>
                </div>
              </div>
            </div>

            {/* Right Section - Testimonial Slider */}
            <div
              ref={rightRef}
              className={`transition-all duration-1000 ease-out ${
                rightVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              <div className="relative">
                <Swiper
                  effect="cards"
                  grabCursor={true}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  modules={[EffectCards, Navigation, Pagination, Autoplay]}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  pagination={{
                    clickable: true,
                    bulletActiveClass:
                      "swiper-pagination-bullet-active !bg-white",
                    bulletClass: "swiper-pagination-bullet !bg-white/40",
                  }}
                  className="mx-auto h-96 w-full max-w-sm"
                >
                  {testimonials.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex gap-1">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.date}
                          </span>
                        </div>

                        <div className="mb-4 flex-1">
                          <FaQuoteLeft
                            className="mb-3 text-green-600"
                            size={20}
                          />
                          <p className="text-sm leading-relaxed text-gray-700">
                            {item.review}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">{item.role}</p>
                            <p className="text-xs text-gray-500">
                              {item.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    ref={prevRef}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-200 hover:bg-white/30"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <button
                    ref={nextRef}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-200 hover:bg-white/30"
                  >
                    <FaChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogSection = () => {
  const [content, setContent] = useState([]);
  const [textRef, textVisible] = useInView({ threshold: 0.2 });
  const cards = Array.from({ length: 4 }, (_, i) =>
    useInView({ threshold: 0.2 }),
  );

  const cardRefs = cards.map(([ref]) => ref);
  const cardVisibles = cards.map(([_, visible]) => visible);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs/featured");
      setContent(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="m-auto max-w-[1064px]">
        <div className="px-4 py-20">
          <div className="mb-16 text-center">
            <h2
              ref={textRef}
              className={`mb-4 text-3xl font-bold text-gray-900 transition-all duration-1000 ease-out lg:text-4xl ${
                textVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              Berita & Informasi
            </h2>
            <p
              className={`mx-auto max-w-2xl text-lg text-gray-600 transition-all delay-200 duration-1000 ease-out ${
                textVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              Dapatkan informasi terbaru seputar ibadah haji dan umrah
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {content.slice(0, 4).map((blog, index) => (
              <div
                key={index}
                ref={cardRefs[index]}
                className={`transform transition-all duration-700 ease-out ${
                  cardVisibles[index]
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-8 scale-95 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="h-full">
                  <CardBlog content={blog} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/blog")}
              className="transform rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
            >
              Baca Artikel Lainnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabunganSection = () => {
  const [leftRef, leftVisible] = useInView({ threshold: 0.2 });
  const [rightRef, rightVisible] = useInView({ threshold: 0.2 });
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-green-600 mix-blend-multiply blur-xl filter"></div>
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-green-400 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="relative m-auto max-w-[1064px]">
        <div className="px-4 py-20">
          <section className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Left Section */}
            <div
              ref={leftRef}
              className={`transition-all duration-1000 ease-out ${
                leftVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="mb-6">
                <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-600">
                  💰 Tabungan Haji & Umrah
                </span>
                <h2 className="mb-6 text-3xl leading-tight font-bold text-gray-900 lg:text-4xl">
                  Mulai Tabungan Haji & Umrah Anda Hari Ini
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-gray-600">
                  Mulailah perjalanan suci Anda bersama Tabungan Haji kami,
                  solusi keuangan syariah yang dirancang untuk membantu Anda
                  mewujudkan impian ke Tanah Suci dengan cara yang mudah dan
                  berkah.
                </p>
              </div>

              {/* Features */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <FaPiggyBank className="text-green-600" size={16} />
                  </div>
                  <p className="text-gray-700">
                    Setoran mulai dari 100 ribu rupiah
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <FaShieldAlt className="text-green-600" size={16} />
                  </div>
                  <p className="text-gray-700">
                    Sistem keuangan syariah yang aman
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <FaHeart className="text-green-600" size={16} />
                  </div>
                  <p className="text-gray-700">
                    Pendampingan spiritual hingga keberangkatan
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/tabungan")}
                className="flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
              >
                Mulai Menabung Sekarang
                <FaArrowRight size={16} />
              </button>
            </div>

            {/* Right Section - Card */}
            <div
              ref={rightRef}
              className={`flex justify-center transition-all duration-1000 ease-out lg:justify-end ${
                rightVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 transform rounded-full bg-white"></div>
                  <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 transform rounded-full bg-green-300"></div>
                </div>

                <div className="relative">
                  <div className="mb-8 flex items-center">
                    <img
                      src={logo}
                      alt="GoUmrah"
                      className="h-8 brightness-0 invert filter"
                    />
                  </div>

                  <div className="text-white">
                    <h3 className="mb-4 text-2xl leading-tight font-bold lg:text-3xl">
                      Wujudkan Impian
                      <br />
                      Ke Tanah Suci
                    </h3>
                    <p className="mb-8 leading-relaxed text-green-100">
                      Dengan tabungan haji, Anda lebih dekat selangkah menuju
                      Baitullah. Mulai perjalanan spiritual Anda hari ini.
                    </p>

                    {/* Stats */}
                    <div className="mb-8 grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                        <p className="mb-1 text-2xl font-bold">5,000+</p>
                        <p className="text-sm text-green-200">Nasabah Aktif</p>
                      </div>
                      <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                        <p className="mb-1 text-2xl font-bold">3.2%</p>
                        <p className="text-sm text-green-200">
                          Bagi Hasil/Tahun
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/tabungan")}
                      className="w-full transform rounded-xl bg-yellow-400 py-4 font-semibold text-gray-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-yellow-500"
                    >
                      Selengkapnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const Home = () => {
  return (
    <LayoutHome>
      <HeroSection />
      <FeaturedProducts />
      <TestimonialSection />
      <BlogSection />
      <TabunganSection />
    </LayoutHome>
  );
};
