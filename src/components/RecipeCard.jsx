import { Soup, Heart, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const RecipeCard = ({ id, title, image, servings, description, source = "spoonacular" }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleViewRecipe = async () => {
    try {
      // Fetch detailed recipe information
      const response = await fetch(`http://localhost:5000/api/recipes/${id}?source=${source}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }
      
      const recipeData = await response.json();
      
      // Format the recipe data for the RecipePage
      const formattedRecipe = {
        dish_name: recipeData.title,
        description: recipeData.summary ? recipeData.summary.replace(/<[^>]*>/g, '') : description,
        prepTime: `${Math.floor(recipeData.readyInMinutes / 2) || 15} mins`,
        cookTime: `${Math.ceil(recipeData.readyInMinutes / 2) || 30} mins`,
        ytLink: recipeData.sourceUrl || null,
        ingredients: recipeData.extendedIngredients ? 
          recipeData.extendedIngredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`) : 
          ["Ingredients not available"],
        instructions: recipeData.analyzedInstructions && recipeData.analyzedInstructions.length > 0 && recipeData.analyzedInstructions[0].steps ?
          recipeData.analyzedInstructions[0].steps.map(step => step.step) :
          recipeData.instructions ? 
            recipeData.instructions.replace(/<[^>]*>/g, '').split('.').filter(s => s.trim().length > 0) : 
          ["Instructions not available"],
      };

      // Navigate to recipe page with data
      navigate(`/RecipeDetail/${id}`, { 
        state: { 
          recipe: formattedRecipe,
          imagePreview: image 
        } 
      });
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      // Fall back to navigation without data
      navigate(`/RecipeDetail/${id}`, {
        state: {
          recipe: {
            dish_name: title,
            description: description || "No description available",
            prepTime: "15 mins",
            cookTime: "30 mins",
            ingredients: ["Ingredients not available"],
            instructions: ["Instructions not available"]
          },
          imagePreview: image
        }
      });
    }
  };

  return (
    <div className="flex flex-col rounded-md bg-neutral bg-opacity-50 overflow-hidden p-3 relative h-full cursor-pointer" onClick={handleViewRecipe}>
      <div className="relative h-40">
        <img
          src={image || "/images/placeholder-food.jpg"}
          alt={title || "Recipe image"}
          className="rounded-md w-full h-full object-cover"
        />
        {servings && (
          <div className="absolute bottom-2 left-2 bg-white rounded-full p-1 flex items-center gap-1 text-sm text-secondary font-fira-sans-condensed">
            <Soup size="16" /> {servings} Servings
          </div>
        )}
        <div 
          className="absolute top-2 right-2 bg-white rounded-full p-1" 
          onClick={toggleFavorite}
        >
          <Heart
            size={"20"}
            className={`${isFavorite ? "fill-secondary text-secondary" : ""} hover:fill-secondary hover:text-secondary`}
          />
        </div>
      </div>
      <div className="flex flex-col mt-3 flex-grow">
        <h3 className="font-fira-sans-condensed font-medium tracking-wide text-accent text-lg">
          {title || "Recipe Title"}
        </h3>
        <p className="font-fira-sans-condensed mt-2 text-accent text-sm line-clamp-2">
          {description || "No description available"}
        </p>
      </div>
      <div 
        className="mt-2 text-sm text-secondary hover:underline font-fira-sans-condensed self-end"
      >
        View Recipe →
      </div>
    </div>
  );
};

export default RecipeCard;