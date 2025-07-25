const TotalPrice = ({ totalHarga }) => (
  <div className="mt-6 flex items-center justify-between rounded-lg border p-6">
    <p className="text-sm font-medium text-gray-700">Total Pembiayaan</p>
    <p className="text-primary font-bold">
      Rp {totalHarga.toLocaleString("id-ID")}
    </p>
  </div>
);

export default TotalPrice;
