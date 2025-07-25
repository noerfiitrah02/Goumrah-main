const PopularPackagesList = ({ packages, FormatCurrency }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Detail Paket</h3>
      <div className="space-y-3">
        {packages.map((pkg, index) => (
          <div key={pkg.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <span className="font-bold">{index + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate font-medium text-gray-800"
                title={pkg.name}
              >
                {pkg.name}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{pkg.order_count} pesanan</span>
                <span className="font-medium text-green-600">
                  {FormatCurrency(pkg.total_revenue)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPackagesList;
