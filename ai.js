// ===============================
// FITTRACK ONE AI COACH
// ===============================

const GEMINI_API_KEY = "YAHAN_APNI_API_KEY";

async function askAI(question){

    try{

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    contents:[
                        {
                            parts:[
                                {
                                    text:question
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        return data.candidates[0].content.parts[0].text;

    }catch(e){

        return "AI Coach is unavailable.";

    }

}

async function updateAICoach(){

    const profile =
        JSON.parse(localStorage.getItem("fittrackProfile")) || {};

    const history =
        JSON.parse(localStorage.getItem("fittrack_history")) || [];

    let lastRun = history.length
        ? history[history.length-1]
        : null;

    let prompt =
`
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

    const coach = document.getElementById("coachCard");

    if(coach){

        coach.innerHTML = answer;

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    updateAICoach();

});
