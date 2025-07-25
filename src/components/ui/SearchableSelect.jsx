import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

const SearchableSelect = ({ options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: "" } });
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={
            selectedOption ? "text-sm text-gray-900" : "text-sm text-gray-500"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center">
          {value && (
            <button
              onClick={handleClear}
              className="mr-2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={12} />
            </button>
          )}
          <FaChevronDown
            className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Cari..."
              className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="py-1 text-sm">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="relative cursor-pointer py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-indigo-600 hover:text-white"
                onClick={() => handleSelect(option.value)}
              >
                {" "}
                <span className="block truncate font-normal">
                  {option.label}
                </span>{" "}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-gray-500">Tidak ada hasil</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
