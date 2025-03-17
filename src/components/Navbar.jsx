import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuButton = document.querySelector('[aria-label="Main menu"]');
      const menu = document.getElementById("nav-menu");
      if (menu && menuButton && !menu.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="navbar bg-primary top-5 px-4 sm:px-4 relative z-50">
      {/* Logo Section */}
      {/* <div className="flex-1 bg">
        <NavLink to="/" className="btn btn-ghost text-xl">
          RecipeDecoder
        </NavLink>
      </div> */}

      {/* Dropdown Trigger Button */}
      <div className="flex-none">
        <button
          className="btn btn-ghost"
          onClick={toggleMenu}
          aria-label="Main menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <Menu className="w-6 h-6 transition-transform" />
          )}
        </button>
      </div>

      {/* Dropdown Menu */}
      <div
        id="nav-menu"
        className={`absolute top-full left-10 mt-2 h-80 ${
          isOpen ? "block" : "hidden"
        }  sm:left-4 sm:mt-3  w-48 sm:w-60 bg-base-100 rounded-box shadow-xl `}
      >
        <ul className="menu p-4 gap-2 text-xl font-fira-sans-condensed font-bold justify-evenly w-full h-full">
          <li>
            <NavLink
              to="/explore"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "active bg-primary/20" : "hover:bg-base-200"
              }
            >
              Explore 
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/decode"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "active bg-primary/20" : "hover:bg-base-200"
              }
            >
              Decode 
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cookbook"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "active bg-primary/20" : "hover:bg-base-200"
              }
            >
              My Cookbook
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;