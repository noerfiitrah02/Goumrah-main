const StatCard = ({
  title,
  value,
  subText,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  onClick,
}) => {
  return (
    <div
      className={`rounded-lg bg-white p-6 shadow transition-shadow ${onClick ? "cursor-pointer hover:shadow-md" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-xl font-bold text-gray-800">{value}</p>
          {subText && <p className="mt-2 text-xs text-gray-500">{subText}</p>}
        </div>
        {Icon && (
          <div
            className={`flex-shrink-0 rounded-full ${iconBgColor} p-1 ${iconColor}`}
          >
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
