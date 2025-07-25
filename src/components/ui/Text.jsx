import { FaHome } from "react-icons/fa";
const Text = ({page}) => {
  return (
    <>
      <div className="basis-full lg:mt-24 md:mt-20 sm:mt-12 max-sm:mt-11">
        <div className="lg:w-[195px] sm:w-[170px] max-sm:w-[145px] h-[4px] bg-primary"></div>
      </div>
      <div className="basis-full mt-8 max-sm:mt-6">
        <h1 className="text-white lg:text-4xl sm:text-3xl max-sm:text-2xl font-bold">{page}</h1>
      </div>
      <div className="basis-full flex gap-3 lg:mt-4 sm:mt-4 max-sm:mt-3">
        <div className="mt-1">
          <FaHome style={{ color: "#92C64E" }}></FaHome>
        </div>
        <span className="text-white ">Halaman - {page}</span>
      </div>
    </>
  );
};

export default Text;
