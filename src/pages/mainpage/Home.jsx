import { Card, CardBlog } from "../../components/ui/Card";
import { useEffect, useRef, useState } from "react";
import { LayoutHome } from "../../components/layout/Layout";
import logo from "../../assets/logo-remove-bg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

const UmrahSection = () => {
  const [textRef, textVisible] = useInView({ threshold: 0.2 });
  const [cardRef, cardVisible] = useInView({ threshold: 0.2 });

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
        const res = await axios.get("http://localhost:5000/api/packages");
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
    <div className="m-auto max-w-[1064px]">
      <div className="px-4 py-15">
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2">
          {/* KIRI: TEKS */}
          <div
            ref={textRef}
            className={`transition-all duration-1200 ease-out ${
              textVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <h2 className="mb-4 font-bold max-lg:text-2xl lg:text-3xl">
              Goumrah - Pilihan Terbaik
            </h2>
            <p className="mb-4 text-gray-700 max-lg:text-lg lg:text-xl">
              Percayakan perjalanan suci Anda kepada GoUmrah — perjalanan umrah
              terpercaya, mengutamakan kenyamanan, bimbingan spiritual, dan
              pelayanan terbaik.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-gray-700 max-lg:text-lg lg:text-xl">
              <li>Pelayanan Ramah Dan Amanah</li>
              <li>Program Umrah Sesuai Sunnah</li>
              <li>Fasilitas Premium Dan Nyaman</li>
            </ul>
          </div>

          {/* KANAN: CARD */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className={`transition-all delay-100 duration-1200 ease-out ${
                cardVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              } bg-gradient-secondary h-96 max-w-xs rounded-lg p-6 shadow-lg`}
            >
              <div className="mb-2 flex items-center">
                <img
                  src={logo}
                  alt="GoUmrah"
                  className="h-6 max-lg:h-5 max-md:h-4.5 max-sm:h-4"
                />
              </div>
              <h3 className="mb-6 text-center text-white max-lg:text-xl lg:text-2xl">
                Cari Paket Umrah
              </h3>

              <div className="space-y-6 px-2">
                {/* TARIF */}
                <select
                  className="w-full rounded-md bg-white p-1.5 text-gray-700"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="">Tarif/biaya</option>
                  <option value="under30">Di bawah 30jt</option>
                  <option value="under50">Di bawah 50jt</option>
                  <option value="under70">Di bawah 70jt</option>
                </select>

                {/* JADWAL */}
                <select
                  className="w-full rounded-md bg-white p-1.5 text-gray-700"
                  value={jadwalFilter?.label || ""}
                  onChange={(e) => {
                    const selected = jadwalOptions.find(
                      (opt) => opt.label === e.target.value,
                    );
                    setJadwalFilter(selected);
                  }}
                >
                  <option value="">Jadwal Keberangkatan</option>
                  {jadwalOptions.map((item) => (
                    <option key={item.label} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>

                {/* KOTA */}
                <select
                  className="w-full rounded-md bg-white p-1.5 text-gray-700"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="">Kota Keberangkatan</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                {/* BUTTON */}
                <button
                  className="w-full rounded-md bg-yellow-400 py-2 font-semibold text-black hover:bg-yellow-500"
                  onClick={handleSearch}
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const GridProductsCard = () => {
  const [breakpoint, setBreakpoint] = useState("mobile");
  const [products, setProducts] = useState([]);
  const [textRef, textVisible] = useInView({ threshold: 0.2 });
  const cards = Array.from({ length: 4 }, (_, i) =>
    useInView({ threshold: 0.2 }),
  );

  // Ambil ref dan visible-nya
  const cardRefs = cards.map(([ref]) => ref);
  const cardVisibles = cards.map(([_, visible]) => visible);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/packages/featured",
      );
      setProducts(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateSize = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setBreakpoint("desktop");
    } else if (width >= 768) {
      setBreakpoint("tablet");
    } else {
      setBreakpoint("mobile");
    }
  };

  useEffect(() => {
    fetchProducts();
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  let displayedCards = [];
  if (breakpoint === "desktop") {
    displayedCards = products.slice(0, 4);
  } else if (breakpoint === "tablet") {
    displayedCards = products.slice(0, 3);
  } else {
    displayedCards = products.slice(0, 4);
  }

  return (
    <div className="m-auto max-w-[1064px]">
      <div className="px-4 py-15">
        <div className="flex flex-col gap-10">
          <h2
            ref={textRef}
            className={`font-bold transition-all duration-1000 ease-out max-lg:text-2xl lg:text-3xl ${
              textVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            Rekomendasi Produk
          </h2>

          <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedCards.map((product, index) => {
              return (
                <div
                  key={index}
                  ref={cardRefs[index]}
                  className={`w-full transform opacity-0 transition-all duration-700 ease-out ${
                    cardVisibles[index]
                      ? "translate-x-0 opacity-100 max-sm:scale-100"
                      : "-translate-x-8 max-sm:scale-95"
                  } `}
                >
                  <Card product={product} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridBlogsCard = () => {
  const [breakpoint, setBreakpoint] = useState("mobile");
  const [content, setContent] = useState([]);
  const [textRef, textVisible] = useInView({ threshold: 0.2 });

  // Buat array refs untuk setiap card
  const cards = Array.from({ length: 4 }, (_, i) =>
    useInView({ threshold: 0.2 }),
  );

  // Ambil ref dan visible-nya
  const cardRefs = cards.map(([ref]) => ref);
  const cardVisibles = cards.map(([_, visible]) => visible);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs");
      setContent(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateSize = () => {
    const width = window.innerWidth;
    console.log("Lebar layar: ", width);
    if (width >= 1024) {
      setBreakpoint("desktop");
    } else if (width >= 768) {
      setBreakpoint("tablet");
    } else {
      setBreakpoint("mobile");
    }
  };

  useEffect(() => {
    fetchProducts();
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  let displayedCards = [];
  if (breakpoint === "desktop") {
    displayedCards = content.slice(0, 4);
  } else if (breakpoint === "tablet") {
    displayedCards = content.slice(0, 3);
  } else {
    displayedCards = content.slice(0, 4);
  }

  return (
    <div className="m-auto max-w-[1064px]">
      <div className="px-4 py-15">
        <div className="flex flex-col gap-10">
          <h2
            ref={textRef}
            className={`font-bold transition-all duration-1000 ease-out max-lg:text-2xl lg:text-3xl ${
              textVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            Berita & Informasi
          </h2>
          <div className="grid auto-rows-fr grid-cols-1 place-items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedCards.map((content, index) => {
              return (
                <div
                  key={index}
                  ref={cardRefs[index]}
                  className={`h-full w-full transform opacity-0 transition-all duration-700 ease-out ${
                    cardVisibles[index]
                      ? "translate-x-0 opacity-100 max-sm:scale-100"
                      : "-translate-x-8 max-sm:scale-95"
                  }`}
                >
                  <div className="h-full">
                    <CardBlog content={content} />
                  </div>
                </div>
              );
            })}
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

  function applySlideOpacity(swiper) {
    const activeIndex = swiper.activeIndex;
    swiper.slides.forEach((slide, index) => {
      const absDistance = Math.abs(index - activeIndex);
      slide.style.opacity =
        absDistance === 0 ? "1" : absDistance <= 2 ? "0.75" : "0";
    });
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-yellow-400 ${i < rating ? "fill-current" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className="m-auto max-w-[1064px]">
        <div className="px-4 py-15">
          <div className="flex flex-col gap-8 text-white md:flex-row">
            {/* Left Section with animation */}
            <div
              ref={leftRef}
              className={`space-y-4 transition-all duration-1000 ease-out md:w-1/2 ${
                leftVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <h2 className="font-bold max-lg:text-2xl lg:text-3xl">
                Cerita Jamaah yang Telah Merasakan Pengalaman Bersama Kami
              </h2>
              <p className="leading-relaxed max-lg:text-lg lg:text-xl">
                Setiap perjalanan suci yang kami layani adalah amanah yang kami
                jaga dengan sepenuh hati. Inilah testimoni nyata dari jamaah
                yang telah mempercayakan ibadah umrah mereka kepada GoUmrah.
              </p>
              <div className="mt-10 flex gap-20">
                <div>
                  <p className="max-lg:2xl: font-bold lg:text-3xl">2,500+</p>
                  <p className="max-lg:text-sm lg:text-lg">Jamaah Dilayani</p>
                </div>
                <div>
                  <p className="max-lg:2xl: font-bold lg:text-3xl">4.9</p>
                  <p className="max-lg:text-sm lg:text-lg">Rating Kepuasan</p>
                </div>
              </div>
            </div>

            {/* Right Section with Swiper + animation */}
            <div
              ref={rightRef}
              className={`flex flex-col items-center transition-all duration-1000 ease-out md:w-1/2 ${
                rightVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              <Swiper
                effect="cards"
                grabCursor={true}
                modules={[EffectCards, Navigation, Pagination]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                pagination={{ clickable: true }}
                onSwiper={(swiper) => applySlideOpacity(swiper)}
                onSlideChange={(swiper) => applySlideOpacity(swiper)}
                className="my-swiper h-96 w-full max-w-80"
              >
                {testimonials.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex h-full flex-col justify-between rounded-lg bg-white p-6 text-gray-800 shadow-lg">
                      <div className="flex-1">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex">{renderStars(item.rating)}</div>
                          <span className="text-xs text-gray-500">
                            {item.date}
                          </span>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700">
                          "{item.review}"
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-4 border-t pt-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.role}</p>
                          <p className="text-xs text-gray-400">
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation Buttons */}
              <div className="mt-4 flex gap-4">
                <button
                  ref={prevRef}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft />
                </button>
                <button
                  ref={nextRef}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                  aria-label="Next testimonial"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabunganSection = () => {
  const [leftRef, leftVisible] = useInView({ threshold: 0.2 });
  const [rightRef, rightVisible] = useInView({ threshold: 0.2 });

  return (
    <div className="m-auto max-w-[1064px]">
      <div className="px-4 py-15">
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2">
          {/* Left Section */}
          <div
            ref={leftRef}
            className={`transition-all duration-1000 ease-out ${
              leftVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <h2 className="mb-4 font-bold max-lg:text-2xl lg:text-3xl">
              Tabungan Umrah & Haji
            </h2>
            <p className="mb-4 text-gray-700 max-lg:text-lg lg:text-xl">
              Mulailah perjalanan suci Anda bersama Tabungan Haji kami, solusi
              keuangan syariah yang dirancang untuk membantu Anda mewujudkan
              impian ke Tanah Suci. Dengan sistem setoran ringan, perencanaan
              transparan, dan pendampingan spiritual, kami hadir sebagai sahabat
              setia dalam setiap langkah menuju Baitullah, dengan aman, nyaman,
              dan penuh keberkahan.
            </p>
            <p className="list-disc text-gray-700 max-lg:text-lg lg:text-xl">
              Mulai Tabungan Hajimu Sekarang!
            </p>
          </div>

          {/* Right Section */}
          <div
            ref={rightRef}
            className={`flex justify-center transition-all duration-1000 ease-out ${
              rightVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="bg-gradient-secondary h-96 rounded-lg p-6 shadow-lg md:w-full lg:w-9/12">
              <div className="mb-8 flex items-center">
                <img
                  src={logo}
                  alt="GoUmrah"
                  className="h-6 max-lg:h-5 max-md:h-4.5 max-sm:h-4"
                />
              </div>
              <div className="px-2">
                <h2 className="mb-4 text-3xl text-white">
                  Wujudkan Impian <br />
                  Ke Tanah Suci
                </h2>
                <h2 className="mb-12 text-lg text-white">
                  Dengan tabungan haji, kamu lebih dekat selangkah menuju
                  Baitullah.
                </h2>
                <button className="w-full rounded-md bg-yellow-400 py-2 font-semibold text-black hover:bg-yellow-500">
                  Selengkapnya
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const Home = () => {
  return (
    <>
      <LayoutHome>
        <UmrahSection></UmrahSection>

        <GridProductsCard />
        <TestimonialSection></TestimonialSection>

        <GridBlogsCard />

        <TabunganSection></TabunganSection>
      </LayoutHome>
    </>
  );
};
