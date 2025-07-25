import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../utils/api";
import { useAuth } from "../../../contexts/AuthContext"; // Import useAuth
import { FaBox, FaPlus, FaTimes } from "react-icons/fa";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({
    user_id: "",
    package_id: "",
    room_type: "double",
    jamaah_details: [
      {
        name: "",
        birth_date: "",
        birth_place: "",
        nik: "",
        gender: "male",
        job: "",
        city: "",
        address: "",
        postal_code: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        emergency_contact_relationship: "",
      },
    ],
  });

  const fetchPackages = async () => {
    try {
      const response = await api.get("/packages?status=published");
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Gagal memuat data paket");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      // Validasi
      if (!newOrder.package_id) {
        toast.error("Paket harus dipilih");
        return;
      }
      if (newOrder.jamaah_details.some((detail) => !detail.name)) {
        toast.error("Nama jamaah harus diisi untuk semua anggota");
        return;
      }
      if (newOrder.jamaah_details.some((detail) => !detail.nik)) {
        toast.error("NIK harus diisi untuk semua anggota");
        return;
      }
      if (newOrder.jamaah_details.some((detail) => !detail.birth_place)) {
        toast.error("Tempat lahir harus diisi untuk semua anggota");
        return;
      }
      if (newOrder.jamaah_details.some((detail) => !detail.birth_date)) {
        toast.error("Tanggal lahir harus diisi untuk semua anggota");
        return;
      }

      await api.post("/orders", newOrder);
      toast.success("Pemesanan berhasil dibuat");
      navigate("/admin/pemesanan");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Gagal membuat pemesanan");
    }
  };

  const addJamaah = () => {
    setNewOrder((prev) => ({
      ...prev,
      jamaah_details: [
        ...prev.jamaah_details,
        {
          name: "",
          birth_date: "",
          birth_place: "",
          nik: "",
          gender: "male",
          job: "",
          city: "",
          address: "",
          postal_code: "",
          emergency_contact_name: "",
          emergency_contact_phone: "",
          emergency_contact_relationship: "",
        },
      ],
    }));
  };

  const removeJamaah = (index) => {
    if (newOrder.jamaah_details.length <= 1) return;
    setNewOrder((prev) => ({
      ...prev,
      jamaah_details: prev.jamaah_details.filter((_, i) => i !== index),
    }));
  };

  const handleJamaahChange = (index, field, value) => {
    const updatedJamaah = [...newOrder.jamaah_details];
    updatedJamaah[index][field] = value;
    setNewOrder((prev) => ({
      ...prev,
      jamaah_details: updatedJamaah,
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Auto-fill user_id ketika user data tersedia
  useEffect(() => {
    if (user && user.id) {
      setNewOrder((prev) => ({
        ...prev,
        user_id: user.id,
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <AdminLayout title="Buat Pemesanan Baru">
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Buat Pemesanan Baru">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Buat Pemesanan Baru
            </h2>
            <p className="text-sm text-gray-500">
              Tambah pemesanan paket perjalanan baru
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Paket <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaBox className="text-gray-400" />
                </div>
                <select
                  value={newOrder.package_id}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, package_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-green-500 focus:outline-none"
                  required
                >
                  <option value="">Pilih Paket</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({formatDate(pkg.departure_date)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipe Kamar <span className="text-red-500">*</span>
              </label>
              <select
                value={newOrder.room_type}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, room_type: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                required
              >
                <option value="double">Double (2 orang)</option>
                <option value="triple">Triple (3 orang)</option>
                <option value="quadruple">Quadruple (4 orang)</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-gray-800">Data Jamaah</h4>
              <button
                onClick={addJamaah}
                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
              >
                <FaPlus size={12} /> Tambah Jamaah
              </button>
            </div>

            <div className="space-y-4">
              {newOrder.jamaah_details.map((jamaah, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h5 className="font-medium text-gray-700">
                      Jamaah #{index + 1}
                    </h5>
                    {newOrder.jamaah_details.length > 1 && (
                      <button
                        onClick={() => removeJamaah(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={jamaah.name}
                        onChange={(e) =>
                          handleJamaahChange(index, "name", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        NIK <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={jamaah.nik}
                        onChange={(e) =>
                          handleJamaahChange(index, "nik", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={jamaah.birth_place}
                        onChange={(e) =>
                          handleJamaahChange(
                            index,
                            "birth_place",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={jamaah.birth_date}
                        onChange={(e) =>
                          handleJamaahChange(
                            index,
                            "birth_date",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={jamaah.gender}
                        onChange={(e) =>
                          handleJamaahChange(index, "gender", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                        required
                      >
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Pekerjaan
                      </label>
                      <input
                        type="text"
                        value={jamaah.job}
                        onChange={(e) =>
                          handleJamaahChange(index, "job", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Kota
                      </label>
                      <input
                        type="text"
                        value={jamaah.city}
                        onChange={(e) =>
                          handleJamaahChange(index, "city", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        value={jamaah.address}
                        onChange={(e) =>
                          handleJamaahChange(index, "address", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm text-gray-600">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={jamaah.postal_code}
                        onChange={(e) =>
                          handleJamaahChange(
                            index,
                            "postal_code",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <h6 className="mb-2 text-sm font-medium text-gray-700">
                        Kontak Darurat
                      </h6>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Nama <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={jamaah.emergency_contact_name}
                            onChange={(e) =>
                              handleJamaahChange(
                                index,
                                "emergency_contact_name",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            No. Telepon <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={jamaah.emergency_contact_phone}
                            onChange={(e) =>
                              handleJamaahChange(
                                index,
                                "emergency_contact_phone",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Hubungan <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={jamaah.emergency_contact_relationship}
                            onChange={(e) =>
                              handleJamaahChange(
                                index,
                                "emergency_contact_relationship",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-6">
          <button
            onClick={() => navigate("/admin/pemesanan")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleCreateOrder}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Buat Pemesanan
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateOrder;
