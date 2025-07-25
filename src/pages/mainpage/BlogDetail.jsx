import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import api from "../../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { FaEye, FaCalendarAlt, FaUser, FaPencilAlt } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";

dayjs.locale("id");

const FeaturedBlogItem = ({ blog, navigate }) => {
  const formattedDate = dayjs(blog.published_at).format("D MMM YYYY");

  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
      onClick={() => navigate(`/blog/${blog.category.slug}/${blog.slug}`)}
    >
      <div className="relative h-20 w-20 flex-shrink-0">
        {blog.featured_image ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${blog.featured_image}`}
            alt={blog.title}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200">
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
          {blog.title}
        </h3>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const { categorySlug, postSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const articleRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch blog detail
        const blogResponse = await api.get(
          `/blogs/${categorySlug}/${postSlug}`,
        );
        const fetchedBlog = blogResponse.data.data;

        // Tampilkan blog jika statusnya 'published', atau jika user adalah admin
        if (
          fetchedBlog &&
          (fetchedBlog.status === "published" ||
            (user && user.role === "admin"))
        ) {
          setBlog(fetchedBlog);

          // Fetch featured blogs (excluding current blog)
          const featuredResponse = await api.get("/blogs", {
            params: {
              is_featured: true,
              limit: 10,
              exclude_category_slug: categorySlug,
              exclude_slug: postSlug,
              status: "published",
            },
          });
          let filteredBlogs = featuredResponse.data.data;

          const shuffledBlogs = [...filteredBlogs];
          for (let i = shuffledBlogs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledBlogs[i], shuffledBlogs[j]] = [
              shuffledBlogs[j],
              shuffledBlogs[i],
            ];
          }

          setFeaturedBlogs(shuffledBlogs.slice(0, 4));
        } else {
          setBlog(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response && err.response.status === 404) {
          setBlog(null);
        } else {
          setError("Gagal memuat data. Silakan coba lagi nanti.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, postSlug, user]);

  // Scroll to article content on load
  useEffect(() => {
    if (!isLoading && blog && articleRef.current) {
      articleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading, blog]);

  if (isLoading) {
    return (
      <Layout page="Blog Detail">
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout page="Blog Detail">
        <div className="container mx-auto px-4 py-10">
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="mb-4 text-lg text-red-500">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Kembali
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout page="Blog Detail">
        <div className="container mx-auto px-4 py-10">
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="mb-4 text-lg text-gray-600">Blog tidak ditemukan</p>
            <button
              onClick={() => navigate("/blog")}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Kembali ke Daftar Blog
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = dayjs(blog.published_at).format("D MMMM YYYY");

  return (
    <Layout page="Blog Detail">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-green-600 hover:text-green-800"
          >
            <MdArrowBack /> Kembali
          </button>

          {user && user.role === "admin" && (
            <button
              onClick={() =>
                navigate(`/admin/blog-posts/edit/${categorySlug}/${postSlug}`)
              }
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-green-700"
            >
              <FaPencilAlt /> Edit Blog
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-4/6">
            <article
              className="rounded-xl bg-white p-6 shadow-md"
              ref={articleRef}
            >
              <header className="mb-8">
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {formattedDate || "Belum dipublikasikan"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye />
                    {blog.views || 0} dilihat
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser />
                    {blog.author?.name || "Anonim"}
                  </span>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                  {blog.title}
                </h1>
              </header>

              {blog.featured_image && (
                <div className="mb-8 overflow-hidden rounded-lg">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/${blog.featured_image}`}
                    alt={blog.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              <div
                className="prose prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-lg prose-img:shadow-md prose-a:text-green-600 prose-a:no-underline hover:prose-a:text-green-800 prose-blockquote:border-l-green-600 prose-blockquote:bg-gray-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:text-gray-700 max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <footer className="mt-12 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Ditulis oleh {blog.author?.name || "Anonim"} pada{" "}
                  {formattedDate}
                </p>
              </footer>
            </article>
          </div>

          <div className="lg:w-2/6">
            <div className="sticky top-4 space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Rekomendasi artikel
                </h2>
                <div className="space-y-3">
                  {featuredBlogs.length > 0 ? (
                    featuredBlogs.map((featuredBlog) => (
                      <FeaturedBlogItem
                        key={`${featuredBlog.category.slug}/${featuredBlog.slug}`}
                        blog={featuredBlog}
                        navigate={navigate}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">Tidak ada artikel terkait</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;
