let watchId = null;

let totalDistance = 0;
let lastPosition = null;

let startTime = null;
let timer = null;

function getDistance(lat1, lon1, lat2, lon2){

const R = 6371e3;

const φ1 = lat1*Math.PI/180;
const φ2 = lat2*Math.PI/180;

const Δφ=(lat2-lat1)*Math.PI/180;
const Δλ=(lon2-lon1)*Math.PI/180;

const a=Math.sin(Δφ/2)**2+
Math.cos(φ1)*Math.cos(φ2)*
Math.sin(Δλ/2)**2;

const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return R*c;

}

document.getElementById("startRun").onclick=function(){
  if (timer) return;

startTime=Date.now();

timer=setInterval(()=>{

let sec=Math.floor((Date.now()-startTime)/1000);

let h=Math.floor(sec/3600);

let m=Math.floor((sec%3600)/60);

let s=sec%60;

document.getElementById("liveTime").innerHTML=
`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

},1000);

watchId=navigator.geolocation.watchPosition((pos)=>{

const lat=pos.coords.latitude;

const lon=pos.coords.longitude;

if(lastPosition){

totalDistance+=getDistance(

lastPosition.lat,
lastPosition.lon,
lat,
lon

);

}

lastPosition={lat,lon};

let km=totalDistance/1000;

document.getElementById("distance").innerHTML=km.toFixed(2)+" KM";

let steps=Math.floor(km*1300);
  let calories = Math.floor(km * 60);

let totalSeconds = Math.floor((Date.now() - startTime) / 1000);

updateWeeklyReport(
    steps,
    km,
    calories,
    totalSeconds
);

document.getElementById("liveSteps").innerHTML=steps;
  // Dashboard Live Update
const goal = 10000;

const stepsValue = document.getElementById("StepsValue");
if (stepsValue) {
    stepsValue.innerHTML = steps;
}

const percent = Math.min(Math.floor((steps / goal) * 100), 100);

const goalText = document.querySelector(".tir-percent");
if (goalText) {
    goalText.innerHTML = percent + "%";
}

const ring = document.getElementById("ringProgress");
if (ring) {
    const circumference = 578;
    ring.style.strokeDashoffset =
        circumference - (circumference * percent / 100);
}
  // Daily Goal Progress
const goalBar = document.getElementById("tirBar");

if (goalBar) {
    goalBar.innerHTML =
        '<div class="tir-seg tir-in" style="width:' + percent + '%"></div>' +
        '<div class="tir-seg tir-high" style="width:' + (100 - percent) + '%"></div>';
}

// Goal Completed
if (steps >= goal) {
    alert("🎉 Congratulations! Daily Goal Completed.");
}

document.getElementById("liveCalories").innerHTML=
Math.floor(km*60)+" kcal";

});

};

document.getElementById("stopRun").onclick = function () {

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }

  alert("Running Stopped ✅");
};

function updateWeeklyReport(steps, distance, calories, seconds) {

    document.getElementById("weeklySteps").innerHTML = steps;

    document.getElementById("weeklyDistance").innerHTML =
        distance.toFixed(2) + " KM";

    document.getElementById("weeklyCalories").innerHTML =
        calories;

    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);

    document.getElementById("weeklyTime").innerHTML =
        `${h}h ${m}m`;
}
