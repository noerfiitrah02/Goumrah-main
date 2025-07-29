import { Link } from "react-router-dom";
import { Footer } from "../common/Footer";
import Header from "../common/Header";
import Text from "../ui/Text";

export const Layout = ({ page, children }) => {
  return (
    <>
      <div className="m-auto w-full bg-black max-sm:h-[300px] sm:h-[370px] md:h-[440px] lg:h-[510px]">
        <div className="h-full w-full bg-[url(/bg.png)] bg-cover bg-center bg-no-repeat">
          <div className="mx-8 flex flex-col items-center justify-center max-md:mx-6 max-sm:mx-4">
            <Header></Header>
            <Text page={page}></Text>
          </div>
        </div>
      </div>
      <div className="m-auto max-w-[1064px]">
        <div className="px-4 py-10">{children}</div>
      </div>
      <Footer></Footer>
    </>
  );
};

export const LayoutSecond = ({ page, children }) => {
  return (
    <>
      <div className="m-auto w-full bg-black max-sm:h-[300px] sm:h-[370px] md:h-[440px] lg:h-[510px]">
        <div className="h-full w-full bg-[url(/bg.png)] bg-cover bg-center bg-no-repeat">
          <div className="mx-8 flex flex-col items-center justify-center max-md:mx-6 max-sm:mx-4">
            <Header></Header>
            <Text page={page}></Text>
          </div>
        </div>
      </div>
      <div>{children}</div>

      <Footer></Footer>
    </>
  );
};

export const LayoutHome = ({ children }) => {
  return (
    <>
      <div className="m-auto w-full overflow-hidden bg-black max-sm:h-[500px] sm:h-[500px] md:h-[570px] lg:h-[640px]">
        <div className="h-full w-full bg-[url(/bg-landing-page.png)] bg-cover bg-center bg-no-repeat">
          <div className="mx-8 flex flex-col items-center justify-center max-sm:mx-4">
            <Header></Header>
            <div className="mt-24 basis-full max-lg:mt-20 max-md:mt-11 max-sm:mt-11">
              <div className="bg-primary h-[4px] w-[195px] max-md:w-[170px] max-sm:w-[145px]"></div>
            </div>
            <div className="mt-8 basis-full text-center max-sm:mt-6">
              <h1 className="text-primary w-full max-w-[621px] font-bold max-md:text-2xl md:text-3xl lg:text-4xl">
                Langkah kecil menuju Tanah Suci GoUmrah Solusinya
              </h1>
            </div>
            <div className="flex basis-full max-sm:mt-2.5 sm:mt-3 md:mt-4 lg:mt-5">
              <div className="text-center">
                <p className="w-full max-w-[660px] text-lg text-white max-md:max-w-[400px]">
                  Ibadah umrah ke ibadah umrah berikutnya adalah penggugur di
                  antara keduanya haji yang mabrur tiada balasan bagi pelakunya
                  melainkan surga
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>

      <Footer></Footer>
    </>
  );
};
