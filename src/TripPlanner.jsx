import React, { useState } from "react";

export default function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [level, setLevel] = useState("Beginner");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCamping, setIsCamping] = useState(false); // ⬅️ new

  // Uses Vercel env var if present, otherwise falls back to Render
  const API_URL =
    (import.meta.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) ||
    "https://trip-planner-backend-6wni.onrender.com";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setItinerary("");

    try {
      const resp = await fetch(`${API_URL}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          start_date: startDate,
          days: Number(days),
          experience: level,
          camping: isCamping, // ⬅️ send choice to backend
        }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setItinerary(data.plan || "No itinerary generated.");
    } catch (err) {
      console.error(err);
      setError("Error generating itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>✨ Trip Planner</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Destination (e.g., Yoho, Banff)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          aria-label="Destination"
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          aria-label="Start date"
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          required
          aria-label="Number of days"
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          aria-label="Experience level"
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        {/* Camping toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={isCamping}
            onChange={(e) => setIsCamping(e.target.checked)}
            aria-label="Include camping"
          />
          Include camping (campsites, permits, gear)
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Generating..." : "🚀 Generate Itinerary"}
        </button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 20,
          background: "#f9f9f9",
          minHeight: 150,
        }}
      >
        {itinerary ? (
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{itinerary}</pre>
        ) : (
          <p style={{ color: "#777", textAlign: "center", margin: 0 }}>
            Your itinerary will appear here ✨
          </p>
        )}
      </div>
    </div>
  );
}
