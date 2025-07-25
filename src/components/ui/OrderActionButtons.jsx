import { FaEye, FaTrash } from "react-icons/fa";

const OrderActionButtons = ({ actions }) => (
  <div className="flex items-center gap-2">
    {actions.map((action, index) => (
      <button
        key={`${action.type}-${index}`}
        onClick={action.onClick}
        className={`rounded p-1 ${action.color} hover:bg-${action.color.split("-")[0]}-50`}
        title={action.title}
      >
        {action.icon ? (
          action.icon
        ) : (
          <>
            {action.type === "view" && <FaEye />}
            {action.type === "delete" && <FaTrash />}
          </>
        )}
      </button>
    ))}
  </div>
);

export default OrderActionButtons;
