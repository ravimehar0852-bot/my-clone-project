/* ===========================
   history.js
=========================== */

const HISTORY_KEY = "runningHistory";

/* Save Today's Run */

function saveRunHistory(data) {

    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

    history.push({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        steps: data.steps,
        distance: data.distance,
        calories: data.calories,
        duration: data.duration
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/* Load History */

function getRunHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

/* Weekly Stats */

function getWeeklyStats() {

    const history = getRunHistory();

    let totalSteps = 0;
    let totalDistance = 0;
    let totalCalories = 0;

    history.forEach(run => {
        totalSteps += Number(run.steps);
        totalDistance += Number(run.distance);
        totalCalories += Number(run.calories);
    });

    return {
        steps: totalSteps,
        distance: totalDistance.toFixed(2),
        calories: totalCalories
    };
}
function showHistory() {

    const list = document.getElementById("historyList");

    if (!list) return;

    const history = getRunHistory();

    list.innerHTML = "";

    if (history.length === 0) {

        list.innerHTML =
            "<p>No Running History Found.</p>";

        return;

    }

    history.reverse().forEach(run => {

        list.innerHTML += `

        <div class="history-card">

            <h3>${run.date}</h3>

            <p>👣 Steps : ${run.steps}</p>

            <p>📍 Distance : ${run.distance} KM</p>

            <p>🔥 Calories : ${run.calories}</p>

            <p>⏱ Time : ${Math.floor(run.duration/60)} min</p>

        </div>

        `;

    });

}

document.addEventListener("DOMContentLoaded", showHistory);
