import RecipeCard from '../components/RecipeCard'
import Navbar from '../components/Navbar';

const CookBook = () => {
const fav=true;

  return (
    <div className="bg-primary w-full flex p-10 min-h-screen">
      <div className="absolute">
      <Navbar />
      </div>
        <div className="max-w-screen-lg mx-auto items-center flex flex-col">
          <span className="font-fira-sans-condensed font-black text-8xl text-accent ">
            My CookBook
          </span>

          {!fav && (
            <div className="h-[80vh] flex flex-col items-center gap-4">
                <img src="404.png" className="h-3/4" alt="404 svg" />
            </div>
          )}

          {fav && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
            </div>
          )}

        </div>

    </div>
  )
}

export default CookBook;