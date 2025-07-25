import { useState } from "react";
import { Pencil } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

const Step2VerifyCode = ({ email, code, setCode, onNext, onEdit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error("Kode harus 6 digit");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/register/step2", {
        email,
        otp: code,
      });
      toast.success("Email berhasil diverifikasi");
      onNext(response.data.tempToken);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Kode verifikasi tidak valid. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="rounded-md border border-gray-200 p-4 text-sm text-gray-800">
        <div className="flex items-center justify-between">
          <span>{email}</span>
          <button
            onClick={onEdit}
            className="text-gray-500 transition-colors hover:text-gray-700"
            aria-label="Edit email"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">Email belum dikonfirmasi</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Kode konfirmasi
        </label>
        <input
          type="text"
          className="w-full border-b-1 border-gray-300 px-4 py-2"
          placeholder="Masukkan 6-digit kode"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Konfirmasi email dengan kode dari pesan</span>
          <button className="text-green-600 hover:underline">
            Kirim ulang
          </button>
        </div>
      </div>

      <button
        onClick={handleVerifyCode}
        disabled={isLoading}
        className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
      >
        {isLoading ? "Memverifikasi..." : "Konfirmasi"}
      </button>
    </div>
  );
};

export default Step2VerifyCode;
