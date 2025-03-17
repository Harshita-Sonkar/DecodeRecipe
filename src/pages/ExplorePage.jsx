import { Search} from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useEffect } from "react";
import Navbar from "../components/Navbar";



const ExplorePage = () => {
  return (
    <div className="bg-primary w-full h-full">
      <div className="absolute">
      <Navbar />
      </div>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col items-center">
          <span className="font-fira-sans-condensed font-black text-8xl text-accent my-12">
            EXPLORE
          </span>
        </div>
        <form>
          <label className="input rounded-full bg-neutral shadow-md opacity-80 shadow-accent flex items-center gap-2 md:m-3 sm:m-3">
            <Search size={"24"} color="#003049" />
            <input
              type="text"
              className="text-sm text-accent placeholder:text-accent md:text-md grow"
              placeholder="What do you want to cook today?"
            />
          </label>
        </form>
        <p className="font-fira-sans-condensed font-bold text-3xl md:text-5xl my-4 md:m-3 sm:m-3 text-accent">
          {" "}
          Recommended Recipes{" "}
        </p>

        <div className="grid gap-3 grid-cols-1 sm:m-3 md:grid-cols-2 md:m-3 lg:grid-cols-3">
          <RecipeCard />
          <RecipeCard />
          <RecipeCard />
          <RecipeCard />
      
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
