import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import DecodePage from "./pages/DecodePage"
import ExplorePage from "./pages/ExplorePage"
import CookBook from "./pages/CookBook";
import TranslationAndSpeech from "./components/TTS";
import RecipeDetail from "./components/RecipeDetail"

function App() {
  return (
    <div className="flex">
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decode" element={<DecodePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/cookbook" element={<CookBook />} />
        <Route path="/recipedetail" element={<RecipeDetail />} />


      </Routes>
      {/* <TranslationAndSpeech/> */}
    </div>
  )
}

export default App;
