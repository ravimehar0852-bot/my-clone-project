/* ===========================
   reminder.js
=========================== */

const PROFILE_KEY = "runningAppProfile";

function checkRunningReminder() {

    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY));

    if (!profile || !profile.runningTime) return;

    const now = new Date();

    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    const currentTime = `${hour}:${minute}`;

    if (currentTime === profile.runningTime) {

        alert(
            "🏃 Time for your Run!\n\nToday's Goal: " +
            (profile.dailyGoal || "10000") +
            " Steps"
        );

    }

}

setInterval(checkRunningReminder, 60000);

checkRunningReminder();
function updateCoachMessage(){

    const profile =
        JSON.parse(localStorage.getItem("fittrackProfile"));

    if(!profile) return;

    const coach =
        document.getElementById("coachCard");

    if(!coach) return;

    const hour = new Date().getHours();

    let greet = "Hello";

    if(hour < 12) greet = "🌞 Good Morning";
    else if(hour < 18) greet = "☀️ Good Afternoon";
    else greet = "🌙 Good Evening";

    coach.innerHTML = `
        <strong>${greet}, ${profile.name}!</strong><br>
        🎯 Goal: ${profile.dailyGoal || 10000} Steps<br>
        🏃 Running Time: ${profile.runningTime || "--:--"}<br>
        💪 Every step makes you stronger!
    `;
}

document.addEventListener("DOMContentLoaded",updateCoachMessage);
