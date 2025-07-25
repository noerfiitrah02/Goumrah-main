import logo from "../../assets/logo-remove-bg.png";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
export const Footer = () => {
  return (
    <>
      <div className="w-full flex flex-col bg-[#191C1C]">
        <div className="basis-full flex justify-center py-10">
          <div className="w-[964px] flex justify-between mx-12">
            <div className="flex items-center">
              <img
                src={logo}
                alt="GoUmrah"
                className="h-6 max-lg:h-5 max-md:h-4.5 max-sm:h-4"
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="bg-[#232829] p-2">
                <FaTwitter className="text-white max-lg:size-3.5 max-md:size-3 max-sm:size-2.5"></FaTwitter>
              </div>
              <div className="bg-[#232829] p-2">
                <FaFacebook className="text-white max-lg:size-3.5 max-md:size-3 max-sm:size-2.5"></FaFacebook>
              </div>
              <div className="bg-[#232829] p-2">
                <FaInstagram className="text-white max-lg:size-3.5 max-md:size-3 max-sm:size-2.5"></FaInstagram>
              </div>
              <div className="bg-[#232829] p-2">
                <FaYoutube className="text-white max-lg:size-3.5 max-md:size-3 max-sm:size-2.5"></FaYoutube>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-full py-10">
          <div className="flex justify-center">
            <span className="text-[#AAB2B3] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]">
              © Copyright 2025 by goumroh.net
            </span>
          </div>
        </div>
      </div>
    </>
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

