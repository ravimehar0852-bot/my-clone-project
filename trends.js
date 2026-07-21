document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("trendChart");

  if (!canvas) return;

  // Local Storage se data lo
  const steps = parseInt(localStorage.getItem("steps")) || 0;
  const distance = parseFloat(localStorage.getItem("distance")) || 0;
  const calories = parseInt(localStorage.getItem("calories")) || 0;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Steps", "Distance (km)", "Calories"],
      datasets: [{
        label: "Today's Activity",
        data: [steps, distance, calories]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
