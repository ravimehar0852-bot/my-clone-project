/* ===========================
   history.js
=========================== */

const HISTORY_KEY = "runningHistory";

/* Save Today's Run */

function saveRunHistory(data) {

    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
   updateTrendData();
   showHistory();

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
function checkAchievements(steps){

    let badges=[];

    if(steps>=1000) badges.push("🥉 First 1K Steps");

    if(steps>=5000) badges.push("🥈 5K Walker");

    if(steps>=10000) badges.push("🥇 10K Champion");

    localStorage.setItem(
        "badges",
        JSON.stringify(badges)
    );

}
function checkAchievements(steps) {

    let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

    if (steps >= 1000 && !achievements.includes("🥉 First 1K Steps")) {
        achievements.push("🥉 First 1K Steps");
    }

    if (steps >= 5000 && !achievements.includes("🥈 5K Walker")) {
        achievements.push("🥈 5K Walker");
    }

    if (steps >= 10000 && !achievements.includes("🥇 10K Champion")) {
        achievements.push("🥇 10K Champion");
    }

    localStorage.setItem("achievements", JSON.stringify(achievements));
}
const HISTORY_KEY = "fittrack_history";

function loadHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function updateTrendData() {

    const history = loadHistory();

    let totalSteps = 0;
    let totalCalories = 0;
    let totalDistance = 0;

    history.forEach(item => {
        totalSteps += item.steps;
        totalCalories += item.calories;
        totalDistance += item.distance;
    });

    const steps = document.getElementById("stepsValue");
    const calories = document.getElementById("caloriesValue");
    const distance = document.getElementById("distanceValue");

    if (steps) steps.innerHTML = totalSteps;
    if (calories) calories.innerHTML = totalCalories;
    if (distance) distance.innerHTML = totalDistance.toFixed(2) + " km";
}

document.addEventListener("DOMContentLoaded", updateTrendData);
function showHistory() {

    const list =
        document.getElementById("trendsLogList") ||
        document.getElementById("dashboardLogList");

    if (!list) return;

    list.innerHTML = "";

    const history = loadHistory();

    history.reverse().forEach(run => {

        const li = document.createElement("li");

        li.className = "log-item";

        li.innerHTML = `
            <div>
                <strong>${run.date}</strong><br>
                <small>${run.time}</small>
            </div>

            <div>
                👣 ${run.steps}<br>
                📍 ${run.distance.toFixed(2)} KM<br>
                🔥 ${run.calories} kcal
            </div>
        `;

        list.appendChild(li);

    });

}
