import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { FaHotel, FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const HotelImages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const $BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchHotelAndImages();
  }, [id]);

  const fetchHotelAndImages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hotels/${id}`);
      setHotel(response.data.data);
      setImages(response.data.data.images || []);
    } catch (error) {
      console.error("Error fetching hotel images:", error);
      toast.error("Gagal memuat data gambar hotel");
      navigate("/admin/hotel");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Pilih file gambar terlebih dahulu");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image_path", file);
      formData.append("caption", caption);

      await api.post(`/hotels/${id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Gambar berhasil diupload");
      fetchHotelAndImages();
      setCaption("");
      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || "Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (imageId) => {
    setImageToDelete(imageId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/hotels/${id}/images/${imageToDelete}`);
      toast.success("Gambar berhasil dihapus");
      fetchHotelAndImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus gambar");
    } finally {
      setShowDeleteModal(false);
      setImageToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  return (
    <AdminLayout title="Kelola Gambar Hotel">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/hotel")}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          <FaArrowLeft /> Kembali
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
                <FaHotel className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Kelola Gambar - {hotel?.name}
              </h2>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                Tambah Gambar Baru
              </h3>
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    File Gambar*
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                    placeholder="Deskripsi singkat gambar"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <FaPlus /> {uploading ? "Mengupload..." : "Upload Gambar"}
                </button>
              </form>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                Daftar Gambar
              </h3>
              {images.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                  Belum ada gambar untuk hotel ini
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative overflow-hidden rounded-lg border border-gray-200"
                    >
                      <img
                        src={`${$BASE_URL}/${image.image_path}`}
                        alt={image.caption || "Hotel Image"}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="truncate text-sm text-gray-700">
                          {image.caption || "Tidak ada keterangan"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                        title="Hapus"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
      />
    </AdminLayout>
  );
};

export default HotelImages;
