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
