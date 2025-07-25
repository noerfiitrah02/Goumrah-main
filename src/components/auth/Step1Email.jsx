import { useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

const Step1Email = ({ email, setEmail, onNext }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/register/step1", { email });
      toast.success(response.data.message);
      onNext();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Gagal mengirim kode. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="rounded-lg border border-gray-300">
        <div className="m-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Masukkan email Anda
          </label>
          <input
            type="email"
            className="w-full border-b-2 border-gray-300 px-4 py-2"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleSendCode}
        disabled={isLoading}
        className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
      >
        {isLoading ? "Mengirim..." : "Kirim Kode"}
      </button>
    </div>
  );
};

export default Step1Email;
