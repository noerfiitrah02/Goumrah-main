import { FaWhatsappSquare } from "react-icons/fa";

export function FloatingWhatsApp() {
  const handleClick = () => {
    const noWa = "6285603623523";
    const pesan =
      "Halo GoUmrah! Saya ingin konsultasi tentang paket umrah. Mohon informasi lebih lanjut.";
    const url = `https://wa.me/${noWa}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      className="fixed right-6 bottom-6 z-50 rounded-full bg-green-500 p-4 text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl"
      onClick={handleClick}
      aria-label="Chat WhatsApp"
    >
      <FaWhatsappSquare className="h-6 w-6" />
    </button>
  );
}
