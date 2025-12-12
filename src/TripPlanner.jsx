import React, { useMemo, useState } from "react";

export default function TripPlanner() {
  // Step control: 1 = inputs, 2 = choose hikes, 3 = itinerary
  const [step, setStep] = useState(1);

  // Form inputs
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(2);
  const [level, setLevel] = useState("Beginner");
  const [camping, setCamping] = useState(false);

  // Data from backend
  const [hikeOptions, setHikeOptions] = useState([]); // [{ day, options:[...] }]
  const [selected, setSelected] = useState({}); // { [day]: optionIndex }

  // Output
  const [itinerary, setItinerary] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Backend URL (production fallback)
  const API_URL =
    (import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) ||
    "https://trip-planner-backend-6wni.onrender.com";

  const canGoNextFromStep1 = useMemo(() => {
    return (
      destination.trim().length > 0 &&
      startDate.trim().length > 0 &&
      Number(days) >= 1 &&
      Number(days) <= 14
    );
  }, [destination, startDate, days]);

  const fetchHikeOptions = async (e) => {
    e.preventDefault();
    setError("");
    setItinerary("");
    setHikeOptions([]);
    setSelected({});
    setLoading(true);

    try {
      const resp = await fetch(`${API_URL}/api/hike-options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.trim(),
          days: Number(days),
          experience: level,
          camping, // optional (backend may ignore for now)
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Hike options request failed (${resp.status}). ${text}`);
      }

      const data = await resp.json();

      // Expected: { hikes: [ { day, options: [...] } ] }
      const hikes = Array.isArray(data?.hikes) ? data.hikes : [];
      if (!hikes.length) {
        throw new Error("No hike options returned. Check backend /api/hike-options.");
      }

      // Auto-select first option per day
      const initialSelected = {};
      hikes.forEach((d) => {
        initialSelected[String(d.day)] = 0;
      });

      setHikeOptions(hikes);
      setSelected(initialSelected);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load hike options.");
    } finally {
      setLoading(false);
    }
  };

  const buildItinerary = async () => {
    setError("");
    setItinerary("");
    setLoading(true);

    try {
      // Build selected_hikes payload
      const selected_hikes = hikeOptions.map((dayBlock) => {
        const dayKey = String(dayBlock.day);
        const idx = Number(selected[dayKey] ?? 0);
        const opt = dayBlock.options?.[idx];

        return {
          day: dayBlock.day,
          name: opt?.name || "Unknown hike",
          distance_km: opt?.distance_km ?? null,
          elevation_m: opt?.elevation_m ?? null,
          difficulty: opt?.difficulty || level,
          notes: opt?.notes || "",
        };
      });

      const resp = await fetch(`${API_URL}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.trim(),
          start_date: startDate,
          days: Number(days),
          experience: level,
          camping,
          selected_hikes,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Plan request failed (${resp.status}). ${text}`);
      }

      const data = await resp.json();
      setItinerary(data?.plan || "No itinerary generated.");
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setHikeOptions([]);
    setSelected({});
    setItinerary("");
    setError("");
    setLoading(false);
  };

  const styles = {
    container: {
      maxWidth: 900,
      margin: "30px auto",
      padding: 24,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    },
    title: { textAlign: "center", margin: 0, fontSize: "1.8rem" },
    sub: { textAlign: "center", marginTop: 8, color: "#555" },
    row: { display: "flex", gap: 12, flexWrap: "wrap" },
    field: { flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 8 },
    label: { fontSize: 12, color: "#555" },
    input: {
      padding: "12px 12px",
      border: "1px solid #ddd",
      borderRadius: 10,
      fontSize: 14,
      outline: "none",
    },
    buttonRow: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
    btn: {
      padding: "12px 16px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 14,
    },
    primary: { background: "#0077ff", color: "#fff" },
    secondary: { background: "#f2f2f2", color: "#222" },
    danger: { background: "#ffe8e8", color: "#a30000" },
    note: {
      marginTop: 14,
      padding: 12,
      borderRadius: 12,
      background: "#f7f7f7",
      color: "#333",
      fontSize: 13,
    },
    error: {
      marginTop: 14,
      padding: 12,
      borderRadius: 12,
      background: "#fff1f1",
      color: "#a30000",
      fontSize: 13,
      border: "1px solid #ffd0d0",
    },
    dayBlock: {
      marginTop: 18,
      border: "1px solid #eee",
      borderRadius: 14,
      padding: 16,
      background: "#fafafa",
    },
    dayTitle: { margin: 0, marginBottom: 10, fontSize: 16 },
    optionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 12,
    },
    optionCard: (active) => ({
      border: active ? "2px solid #0077ff" : "1px solid #e6e6e6",
      borderRadius: 14,
      padding: 14,
      background: "#fff",
      cursor: "pointer",
      boxShadow: active ? "0 6px 18px rgba(0,119,255,0.12)" : "none",
    }),
    optionName: { margin: 0, fontSize: 15, fontWeight: 700 },
    meta: { marginTop: 6, color: "#555", fontSize: 13, lineHeight: 1.4 },
    pre: {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55,
    },
    divider: { height: 1, background: "#eee", margin: "18px 0" },
    checkboxRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 6 },
    badge: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      background: "#eef5ff",
      color: "#0b4db3",
      fontSize: 12,
      fontWeight: 600,
      marginLeft: 8,
      verticalAlign: "middle",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>RockyTrip Planner</h1>
      <p style={styles.sub}>
        Step {step} of 3{" "}
        {step === 1 && <span style={styles.badge}>Trip details</span>}
        {step === 2 && <span style={styles.badge}>Choose hikes</span>}
        {step === 3 && <span style={styles.badge}>Your itinerary</span>}
      </p>

      {error ? <div style={styles.error}>{error}</div> : null}

      {step === 1 && (
        <>
          <form onSubmit={fetchHikeOptions}>
            <div style={styles.row}>
              <div style={styles.field}>
                <div style={styles.label}>Destination</div>
                <input
                  style={styles.input}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Banff, Jasper, Yoho..."
                  required
                />
              </div>

              <div style={styles.field}>
                <div style={styles.label}>Start date</div>
                <input
                  style={styles.input}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <div style={styles.label}>Days</div>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <div style={styles.label}>Experience</div>
                <select
                  style={styles.input}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>

                <div style={styles.checkboxRow}>
                  <input
                    id="camping"
                    type="checkbox"
                    checked={camping}
                    onChange={(e) => setCamping(e.target.checked)}
                  />
                  <label htmlFor="camping" style={{ fontSize: 13, color: "#444" }}>
                    Include camping (optional)
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.buttonRow}>
              <button
                type="submit"
                style={{ ...styles.btn, ...styles.primary, opacity: loading ? 0.7 : 1 }}
                disabled={loading || !canGoNextFromStep1}
              >
                {loading ? "Loading hike options..." : "Next: Choose Hikes"}
              </button>
              <button
                type="button"
                style={{ ...styles.btn, ...styles.secondary }}
                onClick={resetAll}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>

          <div style={styles.note}>
            This step returns <b>2 options per day</b>. Next you’ll pick the hikes you
            actually want, then we build the itinerary around your choices.
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={styles.note}>
            Pick <b>one option per day</b>. Then click <b>Build Itinerary</b>.
          </div>

          {hikeOptions.map((dayBlock) => {
            const dayKey = String(dayBlock.day);
            const chosenIdx = Number(selected[dayKey] ?? 0);

            return (
              <div key={dayKey} style={styles.dayBlock}>
                <h3 style={styles.dayTitle}>Day {dayBlock.day}</h3>

                <div style={styles.optionGrid}>
                  {(dayBlock.options || []).map((opt, idx) => {
                    const active = idx === chosenIdx;
                    return (
                      <div
                        key={`${dayKey}-${idx}`}
                        style={styles.optionCard(active)}
                        onClick={() => setSelected((prev) => ({ ...prev, [dayKey]: idx }))}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelected((prev) => ({ ...prev, [dayKey]: idx }));
                          }
                        }}
                      >
                        <p style={styles.optionName}>
                          {opt?.name || "Hike option"}
                        </p>
                        <div style={styles.meta}>
                          <div>
                            <b>Difficulty:</b> {opt?.difficulty || level}
                          </div>
                          <div>
                            <b>Distance:</b>{" "}
                            {opt?.distance_km != null ? `${opt.distance_km} km` : "—"}
                            {"  "}•{"  "}
                            <b>Elevation:</b>{" "}
                            {opt?.elevation_m != null ? `${opt.elevation_m} m` : "—"}
                          </div>
                          {opt?.notes ? (
                            <div style={{ marginTop: 6 }}>
                              <b>Notes:</b> {opt.notes}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={styles.divider} />

          <div style={styles.buttonRow}>
            <button
              type="button"
              style={{ ...styles.btn, ...styles.secondary }}
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </button>

            <button
              type="button"
              style={{ ...styles.btn, ...styles.primary, opacity: loading ? 0.7 : 1 }}
              onClick={buildItinerary}
              disabled={loading || hikeOptions.length === 0}
            >
              {loading ? "Building itinerary..." : "Build Itinerary"}
            </button>

            <button
              type="button"
              style={{ ...styles.btn, ...styles.danger }}
              onClick={resetAll}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={styles.buttonRow}>
            <button
              type="button"
              style={{ ...styles.btn, ...styles.secondary }}
              onClick={() => setStep(2)}
              disabled={loading}
            >
              Change selected hikes
            </button>
            <button
              type="button"
              style={{ ...styles.btn, ...styles.secondary }}
              onClick={resetAll}
              disabled={loading}
            >
              Start over
            </button>
          </div>

          <div style={styles.divider} />

          <div style={styles.note}>
            <b>Tip:</b> If you want more control, we can add “Show 5 options per day”
            and a “Swap this hike” button.
          </div>

          <div style={{ ...styles.note, background: "#f9f9f9" }}>
            {itinerary ? (
              <pre style={styles.pre}>{itinerary}</pre>
            ) : (
              <div style={{ color: "#777", textAlign: "center" }}>
                No itinerary yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
