import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <FaSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-green-500 focus:outline-none"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default SearchBar;
