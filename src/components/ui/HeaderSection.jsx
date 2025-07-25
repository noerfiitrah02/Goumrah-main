import { FaPlus } from "react-icons/fa";

const HeaderSection = ({
  title,
  description,
  icon,
  addButtonText,
  onAddClick,
}) => (
  <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {addButtonText && onAddClick && (
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        <FaPlus /> {addButtonText}
      </button>
    )}
  </div>
);

export default HeaderSection;
