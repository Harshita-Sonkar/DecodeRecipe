import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({
  exploreExpanded,
  setExploreExpanded,
  decodeExpanded,
  setDecodeExpanded,
}) => {
  return (
    <div className="absolute w-full flex justify-between top-36">
      <div className="flex items-center transition-all duration-300 ease-in-out">
        <div
          className={`h-60 bg-accent overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center ${
            exploreExpanded ? "w-80" : "w-32"
          }`}
        >
          <NavLink
            to="/explore"
            className={`font-fira-sans-condensed font-bold text-white text-5xl top-1/2 -translate-x-[70px] transition-opacity duration-300 ${
              exploreExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {" "}
            EXPLORE
          </NavLink>
        </div>
        <img
          src="/a1.png"
          alt=""
          className="h-72 -translate-x-1/2 cursor-pointer transition-all duration-300 ease-in-out hover:rotate-12"
          onClick={() => setExploreExpanded(!exploreExpanded)}
        />
      </div>

      <div className="flex items-center transition-all duration-300 ease-in-out">
        <img
          src="/b.png"
          alt=""
          className="h-72 translate-x-1/2 cursor-pointer transition-all duration-300 ease-in-out hover:rotate-12"
          onClick={() => setDecodeExpanded(!decodeExpanded)}
        />
        <div
          className={` h-60 bg-accent overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center ${
            decodeExpanded ? "w-80" : "w-32"
          }`}
        >
          <NavLink
          to='/decode'
            className={`font-fira-sans-condensed font-bold text-white text-5xl top-1/2 translate-x-[80px] transition-opacity duration-300 ${
              decodeExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {" "}
            DECODE
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
