import { Link } from "react-router-dom";
import logo from "../../assets/logo-remove-bg.png";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer id="main-footer" className="w-full bg-[#191C1C] text-white">
      <div className="mx-auto w-full max-w-[1064px]">
        <div className="grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
          {/* Logo & Deskripsi */}
          <div>
            <img src={logo} alt="GoUmrah" className="mb-4 h-6" />
            <p className="text-sm text-[#AAB2B3]">
              Ibadah umrah ke ibadah umrah berikutnya adalah penggugur di antara
              keduanya haji yang mabrur tiada balasan bagi pelakunya melainkan
              surga
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Navigasi</h4>
            <ul className="space-y-2 text-sm text-[#AAB2B3]">
              <li>
                <Link to={"/"} className="hover:text-white">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to={"/produk"} className="hover:text-white">
                  Produk
                </Link>
              </li>
              <li>
                <Link to={"/tabungan"} className="hover:text-white">
                  Tabungan
                </Link>
              </li>
              <li>
                <Link to={"/kontak"} className="hover:text-white">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Kontak</h4>
            <ul className="space-y-3 text-sm text-[#AAB2B3]">
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-white" />
                +62 857 1936 9799
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-white" />
                Goumrah@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-white" />
                Indonesia
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Berlangganan</h4>
            <p className="mb-3 text-sm text-[#AAB2B3]">
              Dapatkan info & promo langsung lebih lanjut dari kami.
            </p>
            <Link to={"/kontak"}>
              <div className="flex w-full justify-center rounded bg-white py-2 text-sm font-semibold text-black transition hover:bg-gray-300">
                Berlangganan
              </div>
            </Link>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#2A2E2E] px-6 py-6 md:flex-row">
          <div className="flex gap-3">
            <div
              onClick={() => window.open("/", "_blank")}
              className="rounded-full bg-[#232829] p-2 transition hover:bg-[#2f3435]"
            >
              <FaX className="h-5 w-5 text-white" />
            </div>
            <div
              onClick={() => window.open("", "_blank")}
              className="rounded-full bg-[#232829] p-2 transition hover:bg-[#2f3435]"
            >
              <FaFacebook className="h-5 w-5 text-white" />
            </div>

            <div
              onClick={() => window.open("/#", "_blank")}
              className="rounded-full bg-[#232829] p-2 transition hover:bg-[#2f3435]"
            >
              <FaInstagram className="h-5 w-5 text-white" />
            </div>

            <div
              onClick={() => window.open("/#", "_blank")}
              className="rounded-full bg-[#232829] p-2 transition hover:bg-[#2f3435]"
            >
              <FaYoutube className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-center text-sm text-[#AAB2B3]">
            © 2025 GoUmrah. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export const FooterSecond = () => {
  return (
    <footer className="mt-12 border-t bg-white py-4 text-center text-sm text-gray-500">
      © 2025 <strong className="text-primary">GoUmrah</strong> — Dilindungi Hak
      Cipta
    </footer>
  );
};
