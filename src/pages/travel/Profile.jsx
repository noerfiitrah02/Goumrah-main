import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TravelLayout from "../../components/layout/TravelLayout";
import api from "../../utils/api";
import { FaSave, FaTimes, FaEdit } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const Profile = () => {
  const [formData, setFormData] = useState({
    travel_name: "",
    company_name: "",
    sk_number: "",
    phone_number: "",
    address: "",
    email: "",
    logo: null,
    logoPreview: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.id) {
        toast.error("Informasi Travel tidak tersedia");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/travel/profile/${user.id}`);

        const profile = response.data.data;

        const profileData = {
          travel_name: profile.travel_name,
          company_name: profile.company_name,
          sk_number: profile.sk_number,
          phone_number: profile.phone_number,
          address: profile.address,
          email: profile.email,
          logo: profile.logo,
          logoPreview: profile.logo ? `${BASE_URL}/${profile.logo}` : null,
        };

        setFormData(profileData);
        setOriginalData(profileData); // Simpan data asli
      } catch (error) {
        console.error("Error fetching travel profile:", error);

        if (error.response?.status === 403) {
          console.log("403 Error - User ID:", user.id);
          console.log("403 Error - Full error:", error.response.data);
        }

        toast.error("Gagal memuat profil travel");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [BASE_URL, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }

      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format file tidak didukung. Gunakan JPG atau PNG.");
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLogoFile(null);
    // Reset form data ke data asli
    setFormData({ ...originalData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast.error("User information not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("travel_name", formData.travel_name);
      formDataToSend.append("company_name", formData.company_name);
      formDataToSend.append("sk_number", formData.sk_number);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("email", formData.email);

      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      // Sesuaikan dengan endpoint yang sama seperti di fetchProfile
      await api.put(`/travel/profile/${user.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profil travel berhasil diperbarui");
      // scroll ke atas dengan smooth
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating travel profile:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal memperbarui profil travel");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tambahkan loading state jika user belum tersedia
  if (!user) {
    return (
      <TravelLayout title="Kelola Profil Travel">
        <LoadingSpinner />
      </TravelLayout>
    );
  }

  return (
    <TravelLayout title="Kelola Profil Travel">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Profil Travel</h2>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Edit informasi profil travel Anda"
                : "Informasi profil travel Anda"}
            </p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            <FaEdit /> Edit Profil
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Logo Upload Section */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Logo Travel
                </label>
                <div className="flex items-center gap-4">
                  {formData.logoPreview ? (
                    <img
                      src={formData.logoPreview}
                      alt="Logo preview"
                      className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-gray-300 bg-gray-200">
                      <span className="text-xs text-gray-500">No logo</span>
                    </div>
                  )}
                  {isEditing && (
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isSubmitting}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Format: JPG, PNG. Maksimal 5MB.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Nama Travel */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Travel *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="travel_name"
                    value={formData.travel_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {formData.travel_name || "-"}
                  </div>
                )}
              </div>

              {/* Nama Perusahaan */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Perusahaan
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {formData.company_name || "-"}
                  </div>
                )}
              </div>

              {/* Nomor SK */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nomor SK *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="sk_number"
                    value={formData.sk_number}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {formData.sk_number || "-"}
                  </div>
                )}
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nomor Telepon *
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {formData.phone_number || "-"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email *
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {formData.email || "-"}
                  </div>
                )}
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alamat *
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                ) : (
                  <div className="min-h-[80px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {formData.address || "-"}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>Simpan Perubahan</>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </TravelLayout>
  );
};

export default Profile;
