import React from "react";

const FilterGroup = ({ filters, onFilterChange, onReset, filterConfig }) => (
  <div className="flex gap-2">
    {filterConfig.map((filter) => (
      <div
        key={filter.name}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2"
      >
        {filter.icon}
        {filter.type === "select" ? (
          <select
            name={filter.name}
            value={filters[filter.name] || ""}
            onChange={onFilterChange}
            className="bg-transparent focus:outline-none"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={filter.type}
            name={filter.name}
            value={filters[filter.name] || ""}
            onChange={onFilterChange}
            className="bg-transparent focus:outline-none"
            placeholder={filter.placeholder}
          />
        )}
      </div>
    ))}
    <button
      onClick={onReset}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
    >
      Reset
    </button>
  </div>
);

export default FilterGroup;
