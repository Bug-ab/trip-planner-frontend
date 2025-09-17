import { useState } from "react";
import axios from "axios";

function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [start_date, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [experience, setExperience] = useState("Beginner");
  const [itinerary, setItinerary] = useState("");

  const generateItinerary = async () => {
    try {
      const response = await axios.post(
        "https://trip-planner-backend-6wni.onrender.com/api/plan",
        {
          destination,
          start_date,
          days,
          experience,
        }
      );
      setItinerary(response.data.plan);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary("Failed to generate itinerary. Please try again.");
    }
  };

  return (
    <div>
      <h1>Trip Planner</h1>
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="date"
        value={start_date}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="number"
        value={days}
        min="1"
        onChange={(e) => setDays(e.target.value)}
      />
      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <button onClick={generateItinerary}>Generate Itinerary</button>

      <h2>Generated Itinerary</h2>
      <pre>{itinerary}</pre>
    </div>
  );
}

export default TripPlanner;
