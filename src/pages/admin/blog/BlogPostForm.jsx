import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaSave, FaArrowLeft, FaImage } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import ReactQuill from "react-quill";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";

const BlogPostForm = () => {
  const { categorySlug, postSlug } = useParams(); // Changed from slug to categorySlug and postSlug
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(postSlug);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category_id: "",
    status: "draft",
    featured_image: null,
  });
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/blogs/tags");
        setAvailableTags(
          response.data.data.map((tag) => ({
            value: tag.id,
            label: tag.name,
          })),
        );
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
    }
  }, [categorySlug, postSlug]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blogs/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Gagal memuat kategori");
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${categorySlug}/${postSlug}`);
      const post = response.data.data;
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        category_id: post.category_id,
        status: post.status,
        featured_image: null,
      });
      if (post.featured_image) {
        setPreviewImage(`${$BASE_URL}/${post.featured_image}`);
      }
      if (post.tags) {
        setSelectedTags(
          post.tags.map((tag) => ({
            value: tag.id,
            label: tag.name,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Gagal memuat data postingan");
      navigate("/admin/blog-posts");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format file harus JPG, PNG, atau JPEG");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        featured_image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    // Validasi
    if (!formData.title?.trim()) {
      toast.error("Judul harus diisi");
      return;
    }
    if (!formData.content?.trim()) {
      toast.error("Konten harus diisi");
      return;
    }
    if (!formData.excerpt?.trim()) {
      toast.error("Excerpt harus diisi");
      return;
    }
    if (!formData.category_id) {
      toast.error("Kategori harus dipilih");
      return;
    }

    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("title", formData.title.trim());
    formPayload.append("content", formData.content);
    formPayload.append("excerpt", formData.excerpt.trim());
    formPayload.append("category_id", formData.category_id);
    formPayload.append("status", formData.status);

    if (formData.featured_image) {
      formPayload.append("featured_image", formData.featured_image);
    }

    if (selectedTags.length > 0) {
      formPayload.append(
        "tags",
        JSON.stringify(selectedTags.map((tag) => tag.label)),
      );
    }

    try {
      if (isEditMode) {
        await api.put(`/blogs/${categorySlug}/${postSlug}`, formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/blogs", formPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success(
        `Postingan berhasil ${isEditMode ? "diperbarui" : "dibuat"}`,
      );
      navigate("/admin/blog-posts");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title={isEditMode ? "Edit Postingan Blog" : "Tambah Postingan Blog"}
    >
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
            <FiBook className="text-lg text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Edit Postingan" : "Tambah Postingan Baru"}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditMode
                ? "Perbarui informasi postingan blog"
                : "Buat postingan blog baru"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Masukkan judul postingan"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            {/* Category, Tags, and Status */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  required
                  disabled={submitting}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <Select
                  isMulti
                  options={availableTags}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Pilih tags..."
                  isDisabled={submitting}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: "48px",
                      borderColor: "#d1d5db",
                      "&:hover": {
                        borderColor: "#3b82f6",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  required
                  disabled={submitting}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Gambar Utama
              </label>
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-md text-gray-400">
                      <FaImage className="text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting}
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: JPG, PNG, JPEG (Maksimal: 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Kutipan (Excerpt) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                required
                disabled={submitting}
                placeholder="Ringkasan singkat postingan (maksimal 160 karakter)"
                maxLength="160"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Ringkasan yang menarik untuk memikat pembaca</span>
                <span>{formData.excerpt.length}/160</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Konten <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  readOnly={submitting}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ["bold", "italic", "underline", "strike"],
                      ["blockquote", "code-block"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ indent: "-1" }, { indent: "+1" }],
                      [{ align: [] }],
                      [{ color: [] }, { background: [] }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  className="[&_.ql-container]:rounded-t-none [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-10 [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:bg-white"
                  style={{ height: "340px" }}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-15 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/blog-posts")}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>{isEditMode ? "Simpan Perubahan" : "Simpan"}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogPostForm;
