import { Soup, Heart } from "lucide-react";
import {Link} from "react-router-dom"

const RecipeCard = () => {
  return (
    <div className="flex flex-col rounded-md bg-neutral bg-opacity-50 overflow-hidden p-3 relative">
      <a href="#" className="realtive h-32">
        <img
          src="1.jpg"
          alt="recipe image"
          className="rounded-md w-full h-full object-cover cursor-pointer"
        />
        <div className="absolute top-[107px] left-4 bg-white rounded-full p-1 cursor-pointer flex items-center gap-1 text-sm text-secondary font-fira-sans-condensed ">
          <Soup size="19" /> 4 Servings
        </div>
        <div className="absolute top-1 right-2 bg-white rounded-full p-1 cursor-pointer">
          <Link to={"/cookbook"}>
          <Heart
            size={"20"}
            className="hover:fill-secondary hover:text-secondary"
          />
          </Link>
        </div>
      </a>
      <div className="flex mt-1">
        <p className="font-fira-sans-condensed font-medium tracking-wide text-accent">
          Chole Bhature
        </p>
      </div>
      <p className="font-fira-sans-condensed my-2 text-accent">
        Some explanation
      </p>
    </div>
  );
};

export default RecipeCard;
