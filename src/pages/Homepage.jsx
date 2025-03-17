import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { } from "lucide-react";

const Home = () => {

  return (
    <div className=" relative bg-primary h-screen w-full overflow-hidden">
      {/* <div className="justify-end">
        <Link to={"/auth"} className="">
          <button className="btn btn-secondary btn-outline w-24 text-white rounded-full absolute top-4 right-4">
            <span className="">Sign In</span>
          </button>
        </Link>
      </div> */}

      <div className="absolute flex flex-col items-center left-1/4 top-1/2 md:left-28 md:top-72 lg:left-40">
        <span className="font-fira-sans-condensed font-black lg:text-8xl md:text-7xl sm:text-8xl text-accent">DECODE</span>
        <div>
          <Link to={"/decode"}>
          <button className="btn btn-secondary w-48 my-7 rounded-full drop-shadow-2xl shadow-colored">
            <h1>Let's Decode!</h1>
          </button>
          </Link>
        </div>
      </div>

      <div className="absolute flex flex-col items-center left-44 top-32 md:-right-96 md:top-32 lg:left-1/3">
        <span className="font-fira-sans-condensed font-black lg:text-8xl md:text-7xl sm:text-8xl text-accent">EXPLORE</span>
        <div>
          <Link to={"/explore"}>
          <button className="btn btn-secondary w-48 my-7 rounded-full drop-shadow-2xl shadow-colored">
            <span>Let's go!</span>
          </button>
          </Link>
        </div>
      </div>

      <div>
        {/* Image 1  */}
        <div className="relative flex place-items-center justify-self-center lg:left-24 md:left-14 sm:hidden md:flex lg:flex">
         <div className="relative rounded-full bg-secondary lg:w-80 lg:h-80 md:w-60 md:h-60 lg:-top-6 md:top-1 opacity-30 blur-md "></div>
        <img
          src="p1.png"
          alt="pic"
          className="relative lg:w-[370px] md:w-[270px] lg:-top-5 lg:right-[350px] md:top-2 md:right-[250px] transform hover:rotate-12 transition-all duration-300 ease-in-out"
        /> 
        </div>
        
        {/* Image 2  */}
        <div  className="relative flex items-center justify-center lg:left-40 lg:top-10 md:left-14 md:top-28 sm:hidden md:flex lg:flex">
         <div className="absolute rounded-full bg-secondary lg:w-80 lg:h-80 md:w-60 md:h-60 opacity-30 blur-md"></div>
        <img
          src="p2.png"
          alt="pic"
          className="absolute md:w-[280px] lg:w-[370px] transform hover:rotate-12 transition-all duration-300 ease-in-out"
        /> 
        </div>
        
        {/* Image 3  */}
        <div className="relative flex items-center justify-center md:-bottom-56 md:right-28 lg:top-36 sm:hidden md:flex lg:flex">
         <div className="absolute rounded-full bg-secondary lg:w-80 lg:h-80 md:w-60 md:h-60 opacity-30 blur-md"></div>
        <img
          src="p3.png"
          alt="pic"
          className="md:w-[230px] lg:w-[310px] transform hover:rotate-12 transition-all duration-300 ease-in-out"
        /> 
        </div>
        
      </div>
    </div>
  );
};

export default Home;
