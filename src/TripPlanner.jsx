const response = await axios.post("https://trip-planner-backend-6wni.onrender.com/api/plan", {
  destination,
  start_date,
  days,
  experience,
});

