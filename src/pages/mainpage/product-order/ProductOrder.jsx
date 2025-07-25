import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import logoImage from "../../../assets/logo.png";
import api from "../../../utils/api";
import ProductCard from "./productCard";
import JamaahForm from "./JamaahForm";
import TotalPrice from "./TotalPrice";
import { FooterSecond } from "../../../components/common/Footer";
import { useAuth } from "../../../contexts/AuthContext";

const ProductOrder = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState("quad");
  const [productData, setProductData] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [isProfileUsedList, setIsProfileUsedList] = useState([false]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user } = useAuth();

  const defaultJamaah = {
    namaLengkap: "",
    nomorKTP: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    kota: "",
    kodePos: "",
    jenisKelamin: "",
    pekerjaan: "",
    kontakDaruratNomor: "",
    kontakDaruratNama: "",
    hubunganDarurat: "",
  };

  const [jamaahList, setJamaahList] = useState([{ ...defaultJamaah }]);

  const getProfileData = () => ({
    namaLengkap: user?.name || "",
    nomorKTP: user?.nik || "",
    tempatLahir: user?.birth_place || "",
    tanggalLahir: user?.birth_date || "",
    alamat: user?.address || "",
    kota: "",
    kodePos: "",
    jenisKelamin: "L",
    pekerjaan: "",
    kontakDaruratNama: "",
    kontakDaruratNomor: "",
    hubunganDarurat: "",
  });

  const handleToggleProfileUsed = (index) => {
    const willUseProfile = !isProfileUsedList[index];
    const profile = getProfileData();

    setIsProfileUsedList((prev) => {
      const updated = [...prev];
      updated[index] = willUseProfile;
      return updated;
    });

    setJamaahList((prev) => {
      const updated = [...prev];
      updated[index] = willUseProfile
        ? { ...updated[index], ...profile }
        : { ...defaultJamaah };
      return updated;
    });
  };

  const handleTambahJamaah = () => {
    setJamaahList((prev) => [...prev, { ...defaultJamaah }]);
    setIsProfileUsedList((prev) => [...prev, false]);
  };

  const handleHapusJamaah = (index) => {
    if (jamaahList.length === 1) return alert("Minimal 1 jamaah diperlukan.");
    setJamaahList((prev) => prev.filter((_, i) => i !== index));
    setIsProfileUsedList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeJamaah = (index, e) => {
    const { name, value } = e.target;
    const updated = [...jamaahList];
    updated[index][name] = value;
    setJamaahList(updated);
  };

  const roomPrice = useMemo(() => {
    if (!productData) return 0;
    switch (roomType) {
      case "double":
        return parseFloat(productData.price_double || 0);
      case "triple":
        return parseFloat(productData.price_tripple || 0);
      case "quadraple":
      default:
        return parseFloat(productData.price_quadraple || 0);
    }
  }, [productData, roomType]);

  const totalHarga = roomPrice * jamaahList.length;

  const redirectToWhatsApp = (orderData, totalHarga, namaPaket) => {
    const phoneAdmin = productData?.travel?.phone_number || "";

    const pesan = `Assalamu'alaikum warahmatullahi wabarakatuh

Hallo admin GoUmrah, saya ingin mengkonfirmasi pemesanan paket *${namaPaket}* dengan detail berikut:

📦 *Jenis Kamar*: ${orderData.room_type.toUpperCase()}
👥 *Jumlah Jamaah*: ${orderData.jamaah_details.length}
💰 *Total Biaya*: Rp ${totalHarga.toLocaleString("id-ID")}

📝 Data Jamaah:
${orderData.jamaah_details
  .map(
    (j, i) =>
      `${i + 1}. ${j.name}
  NIK: ${j.nik}
  TTL: ${j.birth_place}, ${j.birth_date}
  Jenis Kelamin: ${j.gender === "L" ? "Laki-laki" : "Perempuan"}
  Alamat: ${j.address}
  Pekerjaan: ${j.job}
  Kota: ${j.city}
  Kode Pos: ${j.postal_code}
  Kontak Darurat: ${j.emergency_contact_name} (${j.emergency_contact_phone}, ${j.emergency_contact_relationship})`,
  )
  .join("\n")}

Mohon bantuannya untuk proses selanjutnya. Terima kasih 🙏`;

    const encoded = encodeURIComponent(pesan);
    window.location.href = `https://wa.me/${phoneAdmin}?text=${encoded}`;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Token tidak ditemukan.");
    if (!productData) return alert("Data produk belum dimuat.");

    const isInvalid = jamaahList.some((j) =>
      Object.values(j).some((val) => !val),
    );

    if (isInvalid) return alert("Harap lengkapi semua data jamaah.");

    const orderData = {
      package_id: productData.id,
      room_type: roomType,
      jamaah_details: jamaahList.map((j) => ({
        name: j.namaLengkap,
        birth_date: j.tanggalLahir,
        birth_place: j.tempatLahir,
        nik: j.nomorKTP,
        gender: j.jenisKelamin,
        job: j.pekerjaan,
        city: j.kota,
        address: j.alamat,
        postal_code: j.kodePos,
        emergency_contact_name: j.kontakDaruratNama,
        emergency_contact_phone: j.kontakDaruratNomor,
        emergency_contact_relationship: j.hubunganDarurat,
      })),
    };

    try {
      await api.post("/orders", orderData);
      setShowSuccessModal(true);
      setTimeout(() => {
        redirectToWhatsApp(orderData, totalHarga, productData?.name);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengirim data.");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/packages/${id}`);
        setProductData(res.data.data);
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      }
    };
    fetch();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1064px] items-center justify-between px-4 py-4">
          <img src={logoImage} className="h-10" alt="Logo GoUmrah" />
        </div>
      </header>

      <main className="mx-auto my-8 max-w-[1064px] px-4 pb-10">
        <div className="flex flex-col gap-10 rounded-2xl bg-white p-8 shadow-md lg:flex-row">
          <ProductCard
            productData={productData}
            roomPrice={roomPrice}
            showDetail={showDetail}
            setShowDetail={setShowDetail}
          />
          <div className="flex-1">
            <JamaahForm
              roomType={roomType}
              setRoomType={setRoomType}
              jamaahList={jamaahList}
              onChangeJamaah={handleChangeJamaah}
              onTambahJamaah={handleTambahJamaah}
              onHapusJamaah={handleHapusJamaah}
              isProfileUsedList={isProfileUsedList}
              onToggleProfileUsed={handleToggleProfileUsed}
            />
            <TotalPrice totalHarga={totalHarga} />
            <button
              onClick={handleSubmit}
              className="bg-primary mt-4 w-full rounded-lg px-4 py-2 text-white"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white px-6 py-8 text-center shadow-xl">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              Pemesanan Berhasil ✅
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Anda akan segera dialihkan ke WhatsApp untuk melanjutkan proses
              pembelian.
            </p>
            <button
              onClick={() =>
                redirectToWhatsApp(
                  {
                    package_id: productData.id,
                    room_type: roomType,
                    jamaah_details: jamaahList,
                  },
                  totalHarga,
                  productData?.name,
                )
              }
              className="bg-primary w-full rounded-md px-4 py-2 font-medium text-white transition"
            >
              Buka WhatsApp Sekarang
            </button>
          </div>
        </div>
      )}

      <FooterSecond />
    </div>
  );
};

export default ProductOrder;
