import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Clock, CookingPot, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import TranslationAndSpeech from "./TTS";



const RecipePage = () => {
  const location = useLocation();
  const recipe = location.state?.recipe;
  const imagePreview = location.state?.imagePreview;

  const prepTime = recipe.prepTime || "15 mins";
  const cookTime = recipe.cookTime || "30 mins";
  const prepTimeParts = prepTime.split(" ");
  const cookTimeParts = cookTime.split(" ");

  const cookTimeNumber = cookTimeParts[0]; 
  const cookTimeUnit = cookTimeParts[1]; 
  const prepTimeNumber = prepTimeParts[0];
  const prepTimeUnit = prepTimeParts[1];
  

  if (!recipe) {
    return (
      <div className="text-center mt-10 text-red-500">
        No recipe data found.
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen h-full w-full">
      <div className="absolute">
        <Navbar />
      </div>

      <div className="flex justify-evenly items-start mt-32">
        <div className="flex flex-col items-center">
          <h1 className="font-fira-sans-condensed font-bold text-accent text-center text-6xl mt-5">
            {recipe.dish_name}
          </h1>
          <p className="h-32 w-2/3 bg-primary bg-opacity-90 text-accent text-center text-balance p-9 my-8 rounded-3xl shadow-md shadow-primary">
            {recipe.description}
          </p>
          {recipe.ytLink && (
        <div className="flex justify-center mt-6">
          <a 
            href={recipe.ytLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center bg-accent text-white px-6 py-3 rounded-lg hover:bg-neutral transition-all"
          >
            <Youtube className="mr-2" />
            Watch Video Tutorial
          </a>
        </div>
      )}
        </div>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="uploaded dish"
            className="h-80 shadow-md shadow-accent mb-10"
          />
        )}
      </div>

      <div className="flex justify-evenly mt-10 ">
        <div className="flex h-32 w-52 bg-secondary bg-opacity-40 p-7 rounded-3xl gap-16"></div>
        <div className="flex h-32 w-60 bg-secondary bg-opacity-70 p-7 rounded-3xl gap-16"></div>
        <div className="flex h-32 w-64 bg-secondary bg-opacity-85 p-7 font-fira-sans-condensed font-bold text-3xl text-white rounded-3xl justify-between">
          Prep <br /> Time
          <h1 className="text-7xl">{prepTimeNumber}</h1> 
          <div className="flex flex-col justify-between items-center">
          <Clock className=""/>
          <h1 className="relative text-sm">{prepTimeUnit}</h1>
          </div>
        </div>
        <div className="flex h-32 w-64 bg-secondary bg-opacity-85 p-7 font-fira-sans-condensed font-bold text-3xl text-white rounded-3xl justify-between">
          Cook <br /> Time 
          <h1 className="text-7xl">{cookTimeNumber}</h1>
          <div className="flex flex-col justify-between items-center">
          <CookingPot className="" />
          <h1 className="relative text-sm">{cookTimeUnit}</h1>
          </div>
        </div>
        <div className="flex h-32 w-60 bg-secondary bg-opacity-70 p-7 rounded-3xl gap-16"></div>
        <div className="flex h-32 w-52 bg-secondary bg-opacity-40 p-7 rounded-3xl gap-16"></div>
      </div>


      <div className="flex m-10 gap-10 justify-stretch">
        <div className="flex flex-col flex-1 h-full ">
          <h2 className="font-fira-sans-condensed font-bold text-5xl text-accent mb-5">
            Ingredients
          </h2>
          <ul className="bg-accent p-4 rounded-lg text-white list-disc list-inside">
          {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ing, index) => (
              <li key={index}>
                {typeof ing === 'object' ? `${ing.amount} ${ing.item}` : ing}
              </li>
            ))}
          </ul>
        </div>
          
        <div className="absolute w-full left-1/3 ">
            <TranslationAndSpeech/>
        </div>
        <div className="flex flex-col flex-1 h-full">
          <h2 className="font-fira-sans-condensed font-bold text-5xl text-accent mb-5">
            Instructions
          </h2>
          <ol className="bg-accent p-4 rounded-lg text-white list-decimal list-inside">
          {Array.isArray(recipe.instructions) && recipe.instructions.map((step, index) => (
              <li key={index} className="mb-2">{step}</li>
            ))}

          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
