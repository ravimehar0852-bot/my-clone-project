/* ==========================================
   profile.js
========================================== */

const PROFILE_KEY = "runningAppProfile";

/* ---------- Save Profile ---------- */

function saveUserProfile() {

    const profile = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        dailyGoal: document.getElementById("dailyGoal").value,
        runningTime: document.getElementById("runningTime").value
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/* ---------- Load Inputs ---------- */

function loadUserProfile() {

    const profile =
        JSON.parse(localStorage.getItem(PROFILE_KEY));

    if (!profile) return;

    document.getElementById("name").value = profile.name || "";
    document.getElementById("age").value = profile.age || "";
    document.getElementById("height").value = profile.height || "";
    document.getElementById("weight").value = profile.weight || "";
    document.getElementById("dailyGoal").value = profile.dailyGoal || "";
    document.getElementById("runningTime").value = profile.runningTime || "";
}

/* ---------- Update Profile Card ---------- */

function loadProfileSection() {

    const profile =
        JSON.parse(localStorage.getItem(PROFILE_KEY));

    if (!profile) return;

    const name = document.getElementById("profileName");
    const goal = document.getElementById("dailyGoalValue");

    if (name)
        name.textContent = profile.name || "Runner";

    if (goal)
        goal.textContent =
            (profile.dailyGoal || "10000") + " Steps";
   // Home Dashboard Summary

const weightCard = document.getElementById("weightCard");
const heightCard = document.getElementById("heightCard");
const ageCard = document.getElementById("ageCard");

if (weightCard)
    weightCard.textContent = (profile.weight || "0") + " kg";

if (heightCard)
    heightCard.textContent = (profile.height || "0") + " cm";

if (ageCard)
    ageCard.textContent = (profile.age || "0") + " Y";
}

const img = document.getElementById("profilePhoto");

const savedPhoto = localStorage.getItem("profilePhoto");

if (img && savedPhoto) {
    img.src = savedPhoto;
}

/* ---------- Modal ---------- */

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("profileModal");
    const openBtn = document.getElementById("editProfileBtn");
    const closeBtn = document.getElementById("closeProfile");
    const saveBtn = document.getElementById("saveProfileBtn");

    loadProfileSection();

    if (openBtn) {

        openBtn.addEventListener("click", () => {

            modal.style.display = "flex";

            loadUserProfile();

        });

    }

    if (closeBtn) {

        closeBtn.addEventListener("click", () => {

            modal.style.display = "none";

        });

    }

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

    if (saveBtn) {

        saveBtn.addEventListener("click", () => {

            saveUserProfile();

            loadProfileSection();

            modal.style.display = "none";

            alert("✅ Profile Saved");

        });

    }

});


// Load Profile
function loadProfile() {

    const data = JSON.parse(localStorage.getItem("fittrackProfile"));

    if (!data) return;

    // Profile Page
    document.getElementById("profileName").innerText = data.name || "Runner";

    if(data.dailyGoal){
        document.getElementById("dailyGoalValue").innerText =
        data.dailyGoal + " Steps";
    }

    // Home Screen
    const homeName = document.getElementById("homeUserName");
    if(homeName){
        homeName.innerText = data.name;
    }

}

window.onload = loadProfile;
function checkRunningReminder() {

    const data = JSON.parse(localStorage.getItem("fittrackProfile"));

    if (!data || !data.runningTime) return;

    const now = new Date();

    const current =
        String(now.getHours()).padStart(2,"0") + ":" +
        String(now.getMinutes()).padStart(2,"0");

    if (current === data.runningTime) {

        alert(
            "🏃 Hi " + data.name +
            ", it's your running time! Let's complete today's goal 💪"
        );

    }

}

setInterval(checkRunningReminder,60000);
const photoInput = document.getElementById("profilePhotoInput");

if (photoInput) {

    photoInput.addEventListener("change", function () {

        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            localStorage.setItem("profilePhoto", e.target.result);

            const img = document.getElementById("profilePhoto");
            if (img) {
                img.src = e.target.result;
            }

        };

        reader.readAsDataURL(file);

    });

}
function updateCoach() {

    const profile =
        JSON.parse(localStorage.getItem(PROFILE_KEY));

    if(!profile) return;

    const coach =
        document.getElementById("coachMessage");

    if(!coach) return;

    const hour = new Date().getHours();

    let greet = "Good Evening";

    if(hour < 12)
        greet = "Good Morning";

    else if(hour < 17)
        greet = "Good Afternoon";

    coach.innerHTML =
`👋 ${greet} ${profile.name}<br><br>

🎯 Goal : ${profile.dailyGoal} Steps<br>

🏃 Running Time : ${profile.runningTime}<br>

💧 Drink at least 2L water today.<br>

😴 Sleep 7-8 hours tonight.<br>

🔥 Keep moving and stay consistent!`;
}
