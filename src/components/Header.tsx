import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  onHomeClick: () => void;
}

const Header = ({ query, setQuery, onSearch, onHomeClick }: HeaderProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "bg-neutral-700 text-white"
        : "text-neutral-300 hover:text-white hover:bg-neutral-800"
    }`;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <header className="w-full bg-neutral-900 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={(event) => {
              if (location.pathname === "/") {
                event.preventDefault();
                onHomeClick();
              }
            }}
          >
            Home
          </NavLink>
          <NavLink to="/favourites" className={navLinkClass}>
            Favourites
          </NavLink>
        </nav>

        <form onSubmit={onSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="w-56 px-3 py-2 text-sm rounded-md bg-neutral-800 text-white placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:border-neutral-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
          >
            Search
          </button>
          {user && (
            <button
              type="button"
              onClick={() => void logout()}
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-700 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          )}
        </form>
      </div>
    </header>
  );
};

export default Header;
