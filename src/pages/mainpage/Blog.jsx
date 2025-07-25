import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "../../components/layout/Layout";
import { CardBlog } from "../../components/ui/Card";
import { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import api from "../../utils/api";
import { useSearchParams } from "react-router-dom";
import { FloatingWhatsApp } from "../../components/ui/FloatingWhatsApp";

const GridCardWrapper = () => {
  const [content, setContent] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleTagCount, setVisibleTagCount] = useState(5);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const topRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const TAG_LIMIT = 5;

  const [filters, setFilters] = useState({
    category_slug: searchParams.get("category") || "",
    tag_slug: searchParams.get("tag") || "",
    search: searchParams.get("search") || "",
  });
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const params = {
        status: "published",
        ...filters,
      };

      const response = await api.get("/blogs", { params });
      setAllContent(response.data.data);
      setContent(response.data.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allContent.slice(startIndex, endIndex);
  }, [allContent, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allContent.length / itemsPerPage);

  useEffect(() => {
    setContent(paginatedContent);
  }, [paginatedContent]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blogs/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get("/blogs/tags");
      setTags(response.data.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchContents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchContents();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category_slug) params.set("category", filters.category_slug);
    if (filters.tag_slug) params.set("tag", filters.tag_slug);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filters, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleFilterClick = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    // Close mobile filter on selection
    if (window.innerWidth < 1024) {
      setIsMobileFilterOpen(false);
    }
  };

  const loadMoreTags = () => {
    setVisibleTagCount((prev) => Math.min(prev + TAG_LIMIT, tags.length));
  };

  const resetTagDisplay = () => {
    setVisibleTagCount(TAG_LIMIT);
  };

  const resetFilters = () => {
    setFilters({
      category_slug: "",
      tag_slug: "",
      search: "",
    });
    setSearchTerm("");
    resetTagDisplay();
    setIsMobileFilterOpen(false);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const visibleTags = tags.slice(0, visibleTagCount);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // Filter Component
  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Cari
        </label>
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari artikel..."
            className="h-10 w-full rounded-l-lg border border-gray-300 px-3 py-2 focus:z-10 focus:border-green-500 focus:outline-none"
          />
          <button
            type="submit"
            className="-ml-px flex h-10 flex-shrink-0 items-center justify-center rounded-r-lg border border-green-600 bg-green-600 px-3 text-white hover:bg-green-700"
            aria-label="Cari"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Kategori
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterClick("category_slug", "")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!filters.category_slug ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleFilterClick("category_slug", category.slug)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filters.category_slug === category.slug ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterClick("tag_slug", "")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!filters.tag_slug ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Semua
          </button>
          {visibleTags.map((tag) => (
            <button
              key={tag.slug}
              onClick={() => handleFilterClick("tag_slug", tag.slug)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filters.tag_slug === tag.slug ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Show More/Less Buttons */}
        <div className="mt-2 flex items-center justify-end gap-6">
          {visibleTagCount < tags.length && (
            <button
              onClick={loadMoreTags}
              className="text-sm font-medium text-green-600 transition-colors hover:underline"
            >
              Tampilkan {Math.min(TAG_LIMIT, tags.length - visibleTagCount)} Tag
              Lainnya
            </button>
          )}
          {visibleTagCount > TAG_LIMIT && (
            <button
              onClick={resetTagDisplay}
              className="text-sm font-medium text-gray-500 transition-colors hover:underline"
            >
              Tampilkan Lebih Sedikit
            </button>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        Reset Filter
      </button>
    </div>
  );

  return (
    <div className="space-y-10" ref={topRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Desktop Filter Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/5">
            <div className="sticky top-4 rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <FaFilter /> Filter Artikel
              </h3>
              <FilterContent />
            </div>
          </div>

          {/* Blog List */}
          <div className="w-full lg:w-4/5">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-64 rounded-xl bg-gray-200"></div>
                  </div>
                ))}
              </div>
            ) : allContent.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg bg-white py-20 text-center shadow"
              >
                <p className="text-gray-500">
                  Tidak ada artikel yang ditemukan
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-green-600 hover:text-green-800"
                >
                  Tampilkan semua artikel
                </button>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {content.map((contentItem, index) => (
                      <motion.div
                        key={`${contentItem.category.slug}/${contentItem.slug}`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CardBlog
                          content={contentItem}
                          categorySlug={contentItem.category.slug}
                          postSlug={contentItem.slug}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
                  >
                    <div className="text-sm text-gray-600">
                      Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, allContent.length)}{" "}
                      dari {allContent.length} artikel
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors ${currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <FaChevronLeft className="h-3 w-3" />
                        Sebelumnya
                      </button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) =>
                          page === "..." ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 py-1"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`h-8 w-8 rounded-full text-sm transition-colors ${currentPage === page ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                              {page}
                            </button>
                          ),
                        )}
                      </div>

                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors ${currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        Berikutnya
                        <FaChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button - Fixed position bottom left */}
      <button
        onClick={() => setIsMobileFilterOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all hover:scale-105 hover:bg-green-700 lg:hidden"
        aria-label="Filter"
      >
        <FaFilter className="h-5 w-5" />
      </button>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-opacity-50 fixed inset-0 z-50 bg-black lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 bottom-0 left-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-xl bg-white p-6 shadow-xl lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <FaFilter /> Filter Artikel
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  aria-label="Tutup"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Blog = () => {
  return (
    <Layout page="Blog">
      <GridCardWrapper />
      <FloatingWhatsApp />
    </Layout>
  );
};

export default Blog;
