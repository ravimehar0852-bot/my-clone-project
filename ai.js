// ===============================
// FITTRACK ONE AI COACH
// ===============================

const GEMINI_API_KEY = "AQ.Ab8RN6KbJMYy5hoOOGtkf1ldm_MCh21WldYnzd5vB7uURkDVXA";

// Ask Gemini AI
async function askAI(question) {

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: question
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", data);

        if (!response.ok) {
            return "❌ " + JSON.stringify(data);
        }

        if (
            data.candidates &&
            data.candidates.length > 0 &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0
        ) {
            return data.candidates[0].content.parts[0].text;
        }

        return "No AI response received.";

    } catch (e) {

        console.log(e);
        return "AI Coach is unavailable.";

    }

}

// Update Coach Card
async function updateAICoach() {

    const profile =
        JSON.parse(localStorage.getItem("fittrackProfile")) || {};

    const history =
        JSON.parse(localStorage.getItem("fittrack_history")) || [];

    const lastRun =
        history.length > 0
            ? history[history.length - 1]
            : null;

    const prompt = `
You are FitTrack ONE AI Fitness Coach.

User Name: ${profile.name || "Runner"}
Age: ${profile.age || "Unknown"}
Weight: ${profile.weight || "Unknown"}
Height: ${profile.height || "Unknown"}
Daily Goal: ${profile.dailyGoal || 10000} Steps

Last Run:
${lastRun ? JSON.stringify(lastRun) : "No Running History"}

Give only a short motivational fitness advice in 3-4 lines.
`;

    const answer = await askAI(prompt);

    const coach = document.getElementById("coachMessage");

    if (coach) {
        coach.innerHTML = answer;
    }

}

// Run after page loads
document.addEventListener("DOMContentLoaded", () => {

    updateAICoach();

});
