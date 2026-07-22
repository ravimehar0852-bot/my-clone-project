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
