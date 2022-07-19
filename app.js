const slider1 = document.querySelector('.firstSlider');
const slider2 = document.querySelector('.secondSlider');
const slider3 = document.querySelector('.citySlider');
const navBar = document.querySelector('.navBar');
const car = document.querySelector('.fa-solid fa-car-side');
const plane = document.querySelector('.fa-solid fa-plane-up');
const headline = document.querySelector('.headline');
const icons = document.querySelector('.navOptions');
const body = document.querySelector('body');
const buttons = document.querySelector('.search-container');
var inputLocation = ""

var currentLat = 0;
var currentLon = 0;

const tl = new TimelineMax();

tl.fromTo(slider1, .9, {x: "0%"}, {x: "100%"},"+=.6")
  .fromTo(slider2, .8, {y: "0%"}, {y:"-100%"},"-=.1")
  .fromTo(navBar, 1, {y: "-100%"}, {y:"0%"},"-=.1");

var i = 0;
var txt = 'Plan your next trip ';
var speed = 70;
var x = 0;
var checker = 0;

window.onloadstart = wait();

function wait(){
  setTimeout(typeWriter, 2450);
}

function typeWriter() {
  if (i < txt.length) {
    headline.innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

var swap = 0;
function darkMode(){
  if(swap == 0){
    tl.fromTo(slider2, .6, {y: "100%"}, {y: "-100%"});
    swap = 1;
  }else{
    tl.fromTo(slider1, .5, {x: "-100%"}, {x: "100%"});
    swap = 0;
  }
  body.classList.toggle("dark-mode");
  icons.classList.toggle("dark-mode-icons");
  buttons.classList.toggle("dark-mode-buttons");
}

function saveName(){
  inputLocation = document.getElementById("search").value;
  if(inputLocation == 'New York'){
    nySlide();
  }
}

function nySlide(){
  tl.fromTo(slider3, 1.3, {x: "0%"}, {x: "100%"})
    .fromTo(slider3, .6, {y: "0%"}, {y: "-100%"});
};

function getLoc(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getLoc2);
  }else{
    alert("Geolocation not supported in this browser");
  }
}

citiesFile = 0;

function getLoc2(position){
  currentLat = position.coords.latitude;
  currentLon = position.coords.longitude;

  fetch("./cities.json")
  .then(response => {
    return response.json();
  })
  .then(data => citiesFile = data);
  checkLocation();
}

/* checks where the nearest city is from the current location
   and how far it is in miles */
function checkLocation(){
  var index = 0;
  var miles = 0;
  var miles1 = 0;

  // INITIALIZE FIRST DISTANCE
  var latitude = citiesFile[0].latitude;
  var longitude = citiesFile[0].longitude;

  latitude =  latitude * Math.PI / 180;
  longitude = longitude * Math.PI / 180;
  var currentLat1 = currentLat * Math.PI / 180;
  var currentLon1 = currentLon * Math.PI / 180;

  var dlon1 = currentLon1 - longitude;
  var dlat1 = currentLat1 - latitude;
  var a = Math.pow(Math.sin(dlat1 / 2), 2)
            + Math.cos(latitude) * Math.cos(currentLat1)
            * Math.pow(Math.sin(dlon1 / 2),2);
           
  var c = 2 * Math.asin(Math.sqrt(a));

  var r = 3956;
  miles = (c * r);
  // LOOP THROUGH REST
  for(let x = 0; x < citiesFile.length; x++){
    var latitude1 = citiesFile[x].latitude;
    var longitude1 = citiesFile[x].longitude;

    latitude1 =  latitude1 * Math.PI / 180;
    longitude1 = longitude1 * Math.PI / 180;
    var currentLat1 = currentLat * Math.PI / 180;
    var currentLon1 = currentLon * Math.PI / 180;

    var dlon = currentLon1 - longitude1;
    var dlat = currentLat1 - latitude1;
    var a = Math.pow(Math.sin(dlat / 2), 2)
             + Math.cos(latitude1) * Math.cos(currentLat1)
             * Math.pow(Math.sin(dlon / 2),2);
           
    var c = 2 * Math.asin(Math.sqrt(a));

    var r = 3956;
    miles1 = (r * c)

    if(miles1 < miles){
      miles = miles1;
      index = x;
    }
  }
}