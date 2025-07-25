import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

const AddPackageImage = ({ LayoutComponent, theme, basePath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    previewImage: null,
    caption: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!formData.image) {
      toast.error("Gambar wajib diupload");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image_path", formData.image);
      formDataToSend.append("caption", formData.caption);

      await api.post(`/packages/${id}/image`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Gambar berhasil ditambahkan");
      navigate(`${basePath}/${id}`);
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan gambar");
      setSubmitting(false);
    }
  };

  return (
    <LayoutComponent title="Tambah Gambar Paket">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${theme.primary} shadow-sm`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Tambah Gambar Paket
            </h2>
            <p className="text-sm text-gray-500">
              Tambahkan gambar untuk paket perjalanan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Gambar <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="absolute h-full w-full cursor-pointer opacity-0"
                  accept="image/*"
                  required
                  disabled={submitting}
                />
                <label
                  htmlFor="image"
                  className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400"
                >
                  {formData.previewImage ? (
                    <img
                      src={formData.previewImage}
                      alt="Preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="mx-auto h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="mt-2 block text-xs text-gray-500">
                        Upload Gambar
                      </span>
                    </div>
                  )}
                </label>
              </div>
              <div className="text-sm text-gray-500">
                <p>Format: JPG, PNG, JPEG</p>
                <p>Ukuran maksimal: 2MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Keterangan (Opsional)
            </label>
            <input
              type="text"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Masukkan keterangan gambar"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={() => navigate(`${basePath}/${id}`)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.image}
              className={`flex items-center gap-2 rounded-lg bg-${theme.primary} px-4 py-2 text-white hover:bg-${theme.primaryHover} disabled:opacity-50`}
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>Simpan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </LayoutComponent>
  );
};

export default AddPackageImage;
