import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const DataTable = ({ columns, data, sortConfig, onSort, onRowClick }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase ${
              column.sortable ? "cursor-pointer" : ""
            }`}
            onClick={() => column.sortable && onSort(column.key)}
          >
            <div className="flex items-center gap-1">
              {column.label}
              {sortConfig.key === column.key &&
                (sortConfig.direction === "asc" ? (
                  <FaArrowUp size={10} />
                ) : (
                  <FaArrowDown size={10} />
                ))}
            </div>
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 bg-white">
      {data.map((row, index) => (
        <tr
          key={row.id || index}
          className={onRowClick ? "cursor-pointer" : ""}
          onClick={() => onRowClick && onRowClick(row)}
        >
          {columns.map((column) => (
            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
              {column.render ? column.render(row) : row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default DataTable;
