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

document.getElementById("liveSteps").innerHTML=steps;

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

};
