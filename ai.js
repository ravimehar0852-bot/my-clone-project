// ===============================
// FITTRACK ONE AI COACH
// ===============================



// Ask Gemini AI
async function askAI(question) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: question
      })
    });

    const data = await response.json();
    console.log(response.status);
console.log(data);

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
