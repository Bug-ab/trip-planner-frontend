import { useState } from "react";
import axios from "axios";

function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [experience, setExperience] = useState("Beginner");
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      const response = await axios.post("http://localhost:3000/api/plan", {
        destination,
        start_date: startDate,
        days,
        experience,
      });
      setItinerary(response.data.plan);
    } catch (err) {
      console.error("Frontend error:", err);
      setError("Error generating itinerary. Check backend logs.");
    }
  };

  return (
    <div>
      <h1>Trip Planner</h1>

      <div>
        <label>Destination:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>Number of Days:</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>

      <div>
        <label>Experience Level:</label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Generate Itinerary</button>

      <h2>Generated Itinerary</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {itinerary && <pre>{itinerary}</pre>}
    </div>
  );
}

export default TripPlanner;
