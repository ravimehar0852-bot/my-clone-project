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
