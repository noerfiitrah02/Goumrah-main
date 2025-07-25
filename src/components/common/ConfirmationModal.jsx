const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  isConfirming = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {isConfirming ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
