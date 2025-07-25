import logo from "../../assets/nobg.png";

const FullScreenLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 text-gray-800">
      <div className="flex flex-col items-center text-center">
        {/* Bouncing Logo */}
        <div className="relative mb-8">
          <img
            src={logo}
            alt="GoUmrah Logo"
            className="h-24 animate-bounce"
            style={{ animationDuration: "2s" }}
          />
          {/* Shadow effect - simple pulse */}
          <div
            className="absolute bottom-0 left-1/2 h-1 w-20 -translate-x-1/2 animate-pulse rounded-full bg-gray-400/30 blur-md"
            style={{ animationDuration: "2s" }}
          ></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-light tracking-wider text-gray-700">
          Mempersiapkan Perjalanan Anda...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Sebentar lagi, pengalaman spiritual menanti.
        </p>

        {/* Spinner with multiple colors */}
        <div className="mt-8 flex items-center justify-center space-x-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-blue-600 [animation-delay:0s]"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-teal-500 [animation-delay:0.2s]"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500 [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
