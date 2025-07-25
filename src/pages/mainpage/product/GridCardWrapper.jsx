import { useEffect, useRef, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../utils/api";
import { FaSearch } from "react-icons/fa";

const GridCardWrapper = ({
  categoryId,
  priceRange,
  departureCity,
  departureDateFrom,
  departureDateTo,
  searchQuery,
  searchInput,
  setSearchQuery,
  setSearchInput,
}) => {
  const [breakpoint, setBreakpoint] = useState("mobile");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const topRefProduct = useRef(null);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width >= 1024) setBreakpoint("desktop");
    else if (width >= 768) setBreakpoint("tablet");
    else setBreakpoint("mobile");
  };

  const scrollToTop = () => {
    if (topRefProduct.current) {
      topRefProduct.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      scrollToTop();
      setCurrentPage(1);
      setIsLoading(true);

      const params = new URLSearchParams();
      if (categoryId) params.append("category_id", categoryId);
      if (searchQuery) params.append("search", searchQuery);
      if (
        priceRange &&
        (priceRange[0] !== 30000000 || priceRange[1] !== 90000000)
      ) {
        params.append("min_price", priceRange[0]);
        params.append("max_price", priceRange[1]);
      }
      if (departureCity && departureCity.length > 0) {
        departureCity.forEach((city) => params.append("departure_city", city));
      }
      if (departureDateFrom && departureDateTo) {
        params.append("departure_date_from", departureDateFrom);
        params.append("departure_date_to", departureDateTo);
      }

      const responsePromise = api.get(
        `/packages?status=published&&${params.toString()}`,
      );
      const [response] = await Promise.all([responsePromise]);

      setProducts(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    setTimeout(() => handleResize(), 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    categoryId,
    priceRange,
    departureCity,
    departureDateFrom,
    departureDateTo,
    searchQuery,
  ]);

  const cardsPerPage =
    breakpoint === "mobile" ? 8 : breakpoint === "tablet" ? 12 : 12;

  const totalPages = Math.ceil(products.length / cardsPerPage);
  const currentCards = products.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      topRefProduct.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = breakpoint === "mobile" ? 1 : 3;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`rounded px-3 py-1 ${
            currentPage === 1
              ? "border border-gray-400 font-bold"
              : "border border-gray-300"
          }`}
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="left-ellipsis" className="px-2">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`rounded px-3 py-1 ${
            currentPage === i
              ? "scale-110 border border-gray-400 font-bold"
              : "border border-gray-300"
          }`}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="right-ellipsis" className="px-2">
            ...
          </span>,
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`rounded px-3 py-1 ${
            currentPage === totalPages
              ? "border border-gray-400 font-bold"
              : "border border-gray-300"
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pageNumbers;
  };

  return (
    <div className="w-full space-y-10" ref={topRefProduct}>
      {/* Mobile Search */}
      <div className="flex justify-center lg:hidden">
        <div className="flex w-4/5">
          <input
            type="text"
            placeholder="   Search..."
            className="w-full rounded-tl-lg rounded-bl-lg border border-gray-300"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="bg-gradient cursor-pointer rounded-tr-lg rounded-br-lg px-4 py-3"
            onClick={() => setSearchQuery(searchInput)}
          >
            <FaSearch color="white" stroke="1" />
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex h-full min-h-[200px] w-full items-center justify-center">
            <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-transparent"></div>
          </div>
        ) : (
          <AnimatePresence>
            {currentCards.map((product, i) => (
              <motion.div
                key={product.id || i}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <Card product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="cursor-pointer rounded-full disabled:opacity-30"
            >
              <IoIosArrowBack
                className="bg-gradient h-full w-full rounded-full p-3"
                color="white"
              />
            </button>
            <div className="flex gap-1">{renderPageNumbers()}</div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-full disabled:opacity-30"
            >
              <IoIosArrowForward
                className="bg-gradient h-full w-full rounded-full p-3"
                color="white"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridCardWrapper;
