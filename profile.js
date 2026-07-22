/* ==========================================
   Profile Manager
   File: profile.js
   ========================================== */
console.log("Profile JS Loaded");
const PROFILE_KEY = "runningAppProfile";

const ProfileManager = {

    getProfile() {
        const data = localStorage.getItem(PROFILE_KEY);
        return data ? JSON.parse(data) : null;
    },

    saveProfile(profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    },

    updateProfile(newData) {
        const oldData = this.getProfile() || {};

        const updatedData = {
            ...oldData,
            ...newData,
            updatedAt: new Date().toISOString()
        };

        this.saveProfile(updatedData);
    },

    deleteProfile() {
        localStorage.removeItem(PROFILE_KEY);
    },

    hasProfile() {
        return this.getProfile() !== null;
    }
};


/* ==========================================
   Save Profile
   ========================================== */

function saveUserProfile() {

    const profile = {
        name: document.getElementById("name")?.value.trim(),
        age: document.getElementById("age")?.value,
        height: document.getElementById("height")?.value,
        weight: document.getElementById("weight")?.value,
        dailyGoal: document.getElementById("dailyGoal")?.value,
        runningTime: document.getElementById("runningTime")?.value,
        profilePhoto: document.getElementById("profilePhotoPreview")?.src || "",
        createdAt: new Date().toISOString()
    };

    ProfileManager.saveProfile(profile);

    alert("Profile Saved Successfully!");
}


/* ==========================================
   Load Profile
   ========================================== */

function loadUserProfile() {

    const profile = ProfileManager.getProfile();

    if (!profile) return;

    if (document.getElementById("name"))
        document.getElementById("name").value = profile.name || "";

    if (document.getElementById("age"))
        document.getElementById("age").value = profile.age || "";

    if (document.getElementById("height"))
        document.getElementById("height").value = profile.height || "";

    if (document.getElementById("weight"))
        document.getElementById("weight").value = profile.weight || "";

    if (document.getElementById("dailyGoal"))
        document.getElementById("dailyGoal").value = profile.dailyGoal || "";

    if (document.getElementById("runningTime"))
        document.getElementById("runningTime").value = profile.runningTime || "";

    if (
        document.getElementById("profilePhotoPreview") &&
        profile.profilePhoto
    ) {
        document.getElementById("profilePhotoPreview").src =
            profile.profilePhoto;
    }
}


/* ==========================================
   Profile Photo Upload
   ========================================== */

function previewProfilePhoto(input) {

    const file = input.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        document.getElementById("profilePhotoPreview").src = e.target.result;

        const profile = ProfileManager.getProfile() || {};
        profile.profilePhoto = e.target.result;

        ProfileManager.saveProfile(profile);
    };

    reader.readAsDataURL(file);
}


/* ==========================================
   Get User Name Anywhere
   ========================================== */

function getUserName() {

    const profile = ProfileManager.getProfile();

    return profile ? profile.name : "Runner";
}


/* ==========================================
   Auto Load
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    loadProfileSection();
});

    const profile = ProfileManager.getProfile();

    if (!profile) return;

    const name = document.getElementById("profileName");
    const photo = document.getElementById("profilePhoto");
    const goal = document.getElementById("dailyGoalValue");

    if (name) {
        name.textContent = profile.name || "Runner";
    }

    if (photo && profile.profilePhoto) {
        photo.src = profile.profilePhoto;
    }

    if (goal) {
        goal.textContent = (profile.dailyGoal || "10000") + " Steps";
    }

}
/* ===========================
   PROFILE MODAL
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("profileModal");
    const openBtn = document.getElementById("editProfileBtn");
    const closeBtn = document.getElementById("closeProfile");
    const saveBtn = document.getElementById("saveProfileBtn");

    if (openBtn) {
        openBtn.onclick = () => {
            modal.style.display = "flex";
            loadUserProfile();
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    window.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

    if (saveBtn) {
        saveBtn.onclick = () => {

            saveUserProfile();

            loadProfileSection();

            modal.style.display = "none";

            alert("✅ Profile Saved Successfully");
        };
    }

    loadProfileSection();

});
