import React, { useState } from "react";

export default function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [level, setLevel] = useState("Beginner");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Works with both Vite (VITE_API_URL) and CRA (REACT_APP_BACKEND_URL)
  const API_URL =
    import.meta.env.VITE_API_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "http://localhost:3000";

  console.log("🌍 Using API_URL:", API_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setItinerary("");

    try {
      const response = await fetch(`${API_URL}/api/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          start_date: startDate,
          days,
          experience: level,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch itinerary");
      }

      const data = await response.json();
      setItinerary(data.plan || "No itinerary generated.");
    } catch (err) {
      setError("Error generating itinerary. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>✨ Trip Planner</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="number"
          value={days}
          min="1"
          max="30"
          onChange={(e) => setDays(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "🚀 Generate Itinerary"}
        </button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          background: "#f9f9f9",
          minHeight: "150px",
        }}
      >
        {itinerary ? (
          <pre style={{ whiteSpace: "pre-wrap" }}>{itinerary}</pre>
        ) : (
          <p style={{ color: "#777", textAlign: "center" }}>
            Your itinerary will appear here ✨
          </p>
        )}
      </div>
    </div>
  );
}
