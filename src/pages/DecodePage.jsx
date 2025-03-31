import { Utensils } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar1";
import { useNavigate } from "react-router-dom";

const DecodePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [servings, setServings] = useState(1);
  const [decodedRecipe, setDecodedRecipe] = useState(null);
  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [decodeExpanded, setDecodeExpanded] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [allergyInput, setAllergyInput] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      handleUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    setUploaded(false);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data);
      setUploaded(true);

      if (data.dish_name) {
        setDecodedRecipe(data.dish_name);
      } else {
        console.error("No dish_name in response:", data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleDecode = async () => {
    console.log("handleDecode called!");

    if (!selectedFile) {
      console.log("No image selected!");
      return;
    }

    console.log("Sending data to backend...");

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("servings", servings);
    formData.append("allergies", JSON.stringify(allergies));

    try {
      console.log("Making API request...");
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response received:", response);

      if (!response.ok) {
        console.error("Error in API request:", response.status);
        return;
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      if (data.error) {
        console.error("API returned error:", data.error);
        return;
      }

      console.log("Navigating to RecipeDetail page...");
      navigate("/RecipeDetail", { state: { recipe: data, imagePreview } });
    } catch (error) {
      console.error("Error in handleDecode:", error);
    }
  };

  const handleAllergyInput = (e) => {
    setAllergyInput(e.target.value);
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAllergy();
    }
  };

  return (
    <div className="bg-primary min-h-screen h-full w-full overflow-y-hidden">
      <div className="">
        <Navbar
        exploreExpanded = {exploreExpanded}
        setExploreExpanded = {setExploreExpanded}
        decodeExpanded = {decodeExpanded}
        setDecodeExpanded = {setDecodeExpanded}
         />
      </div>

      

      <div className="flex flex-col items-center">
        <div className="flex gap-14 font-fira-sans-condensed font-black text-8xl text-accent mt-12 mb-5 hover:bg-clip-text hover:rotate-30 hover:text-transparent hover:bg-gradient-to-r hover:from-accent hover:via-neutral hover:to-accent hover:bg-[length:200%_150%] hover:animate-gleam">
          <span>D</span>
          <span>E</span>
          <span>C</span>
          <span>O</span>
          <span>D</span>
          <span>E</span>
        </div>
        <Utensils
          color="#669BBC"
          className="flex justify-end relative left-32"
        />
        <span className="font-fira-sans-condensed font-bold text-center text-3xl text-accent">
          Upload the image <br /> let us decode it!
        </span>

        <form className="flex flex-col items-center gap-6">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <div className="w-64 mt-8 px-8 py-4 bg-neutral hover:bg-neutral/90 text-white font-fira-sans-condensed font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>
                {loading
                  ? "Uploading...."
                  : uploaded
                  ? "Done!"
                  : selectedFile
                  ? selectedFile.name
                  : "Choose Image"}
              </span>
            </div>
          </label>

          {/* Display Image Preview */}
          {imagePreview && (
            <div className="flex items-center gap-10 font-fira-sans-condensed max-w-96">
              <img
                src={imagePreview}
                alt="Preview"
                className=" w-auto rounded-lg shadow-md"
              />

              <div className="flex flex-col items-center justify-around gap-12">
                {decodedRecipe && (
                  <div className="relative w-96 h-32 flex items-center justify-center font-medium text-accent text-center">
                    <div className="absolute inset-0 rounded-full bg-secondary blur-2xl opacity-40"></div>
                    <span className="text-center">
                      Amazing choice!
                      <br />
                      Dish: {decodedRecipe}
                    </span>
                  </div>
                )}

                {/* Servings Input */}
                {decodedRecipe && (
                  <div className=" flex items-center mt-4">
                    <button
                      className="btn-circle px-4 py-2 bg-secondary bg-opacity-50 border-2 border-secondary text-center text-secondary font-bold"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      type="button"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 mx-4 max-w-52 min-w-52 bg-neutral bg-opacity-70 border  font-bold rounded-full text-center whitespace-pre">
                      Estimate serving {servings}
                    </span>
                    <button
                      className="btn-circle px-4 py-2 bg-secondary bg-opacity-50 border-2 border-secondary text-center text-secondary font-bold"
                      onClick={() => setServings((prev) => prev + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Allergies Section */}
                {decodedRecipe && (
                  <div className="w-full max-w-md mt-4">
                    <h3 className="text-accent font-bold text-lg mb-2">Any allergies or dietary restrictions?</h3>
                    
                    {/* Custom allergy input */}
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={allergyInput}
                        onChange={handleAllergyInput}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your allergies"
                        className="px-4 py-2 bg-neutral bg-opacity-50 rounded-l-lg flex-grow"
                      />
                      <button
                        type="button"
                        onClick={addAllergy}
                        className="px-4 py-2 bg-secondary bg-opacity-70 rounded-r-lg text-white"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Selected allergies display */}
                    {allergies.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-accent font-medium mb-1">Your allergies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {allergies.map(allergy => (
                            <div key={allergy} className="flex items-center bg-secondary px-3 py-1 rounded-full">
                              <span className="text-white text-sm">{allergy}</span>
                              <button
                                type="button"
                                onClick={() => removeAllergy(allergy)}
                                className="ml-2 text-white text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              console.log("Button clicked");
              handleDecode();
            }}
            disabled={loading || !selectedFile}
            className="w-48 px-6 py-3 mb-5 bg-secondary hover:bg-secondary/90 text-white font-fira-sans-condensed font-bold rounded-lg bg-opacity-50 border-2 border-secondary visible disabled:hidden"
          >
            Decode
          </button>
        </form>
      </div>
    </div>
  );
};

export default DecodePage;
