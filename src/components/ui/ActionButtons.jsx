import { FaEdit, FaTrash, FaEye, FaImage } from "react-icons/fa";

const ActionButtons = ({ actions }) => (
  <div className="flex items-center gap-2">
    {actions.map((action) => (
      <button
        key={action.type}
        onClick={action.onClick}
        className={`rounded p-1 ${action.color} hover:bg-${action.color.split("-")[0]}-50`}
        title={action.title}
      >
        {action.type === "edit" && <FaEdit />}
        {action.type === "delete" && <FaTrash />}
        {action.type === "view" && <FaEye />}
        {action.type === "image" && <FaImage />}
      </button>
    ))}
  </div>
);

export default ActionButtons;
