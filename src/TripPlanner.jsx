import React, { useState } from "react";
import axios from "axios";

function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);
  const [level, setLevel] = useState("Beginner");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setItinerary("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/plan`,
        { destination, date, days, level }
      );
      setItinerary(response.data.itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary("❌ Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✨ Trip Planner</h1>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={styles.input}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={styles.input}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <button
          onClick={handleSubmit}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : "🚀 Generate Itinerary"}
        </button>
      </div>

      <div style={styles.result}>
        <h2 style={styles.subtitle}>📌 Generated Itinerary</h2>
        <div style={styles.itineraryBox}>
          {itinerary ? (
            <pre style={styles.itinerary}>{itinerary}</pre>
          ) : (
            <p style={styles.placeholder}>Your itinerary will appear here ✨</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1a1a1a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "14px 20px",
    background: "#0077ff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  result: {
    marginTop: "30px",
    textAlign: "left",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    fontWeight: "600",
  },
  itineraryBox: {
    background: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
    minHeight: "150px",
    border: "1px solid #eee",
  },
  itinerary: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "0.95rem",
    color: "#333",
  },
  placeholder: {
    color: "#888",
    fontStyle: "italic",
  },
};

export default TripPlanner;

