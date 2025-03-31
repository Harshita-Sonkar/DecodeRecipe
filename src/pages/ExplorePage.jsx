import { Search } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar1";

const ExplorePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [decodeExpanded, setDecodeExpanded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    fetchIndianRecipes();
  }, []);

  const fetchIndianRecipes = async (query = "", isNewSearch = false) => {
    if (isNewSearch) {
      setOffset(0);
      setRecipes([]);
    }
    
    if (!hasMore && !isNewSearch) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/indian?${
          query ? `query=${query}&` : ""
        }number=12&offset=${isNewSearch ? 0 : offset}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      const newRecipes = data.results || [];
      
      if (isNewSearch) {
        setRecipes(newRecipes);
      } else {
        setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]);
      }
      
      // Check if we have more results to load
      setHasMore(newRecipes.length > 0);
      
      // Update offset for next fetch
      if (newRecipes.length > 0) {
        setOffset(prevOffset => prevOffset + newRecipes.length);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIndianRecipes(searchQuery, true);
  };

  // Create ref for the last recipe element
  const lastRecipeElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchIndianRecipes(searchQuery);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, searchQuery]);

  return (
    <div className="bg-primary min-h-screen h-full w-full">
      <div className="">
        <Navbar
          exploreExpanded={exploreExpanded}
          setExploreExpanded={setExploreExpanded}
          decodeExpanded={decodeExpanded}
          setDecodeExpanded={setDecodeExpanded}
        />
      </div>
      <div className="max-w-screen-lg mx-auto pt-16 px-4">
        <div className="flex flex-col items-center justify-items-center">
          <div className="flex gap-14 font-fira-sans-condensed font-black text-8xl text-accent mt-12 mb-5 hover:bg-clip-text hover:rotate-30 hover:text-transparent hover:bg-gradient-to-r hover:from-accent hover:via-neutral hover:to-accent hover:bg-[length:200%_150%] hover:animate-gleam">
            <span>E</span>
            <span>X</span>
            <span>P</span>
            <span>L</span>
            <span>O</span>
            <span>R</span>
            <span>E</span>
          </div>
          <form onSubmit={handleSearch} className="w-96">
            <label className="input rounded-full bg-neutral shadow-md opacity-80 shadow-accent flex items-center gap-2 md:m-3 sm:m-3">
              <Search size={"24"} color="#003049" />
              <input
                type="text"
                className="text-sm text-accent placeholder:text-accent md:text-md grow"
                placeholder="Search for Asian recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </form>
        </div>
        <p className="font-fira-sans-condensed font-bold text-3xl md:text-5xl my-4 md:m-3 sm:m-3 text-accent">
          Asian Delights
        </p>

        {error && <div className="text-red-500 text-center my-4">{error}</div>}

        <div className="grid gap-4 grid-cols-1 sm:m-3 md:grid-cols-2 md:m-3 lg:grid-cols-3 mb-10">
          {recipes.map((recipe, index) => {
            if (recipes.length === index + 1) {
              // Add ref to last recipe element
              return (
                <div ref={lastRecipeElementRef} key={recipe.id}>
                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image}
                    servings={recipe.servings}
                    description={`Ready in ${recipe.readyInMinutes} minutes`}
                  />
                </div>
              );
            } else {
              return (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  servings={recipe.servings}
                  description={`Ready in ${recipe.readyInMinutes} minutes`}
                />
              );
            }
          })}
        </div>
        
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        )}
        
        {!loading && recipes.length === 0 && (
          <div className="text-accent text-center my-4">
            No recipes found. Try another search.
          </div>
        )}
        
        {!hasMore && recipes.length > 0 && (
          <div className="text-accent text-center my-4">
            No more recipes to load.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;