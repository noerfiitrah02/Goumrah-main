const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  onClick,
}) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className={`rounded-full ${iconBgColor} p-3 ${iconColor}`}>
        <Icon />
      </div>
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default QuickActionCard;
