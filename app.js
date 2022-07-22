// MAPS API
fetch('https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=e5aa2048e6664ce4b56caac669e7ae07')
  .then(response => response.json())
  .then(data => console.log(data));

// PLACES API
var requestOptions = {
  method: 'GET',
};

fetch("https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=rect%3A10.716463143326969%2C48.755151258420966%2C10.835314015356737%2C48.680903341613316&limit=20&apiKey=5dcb8d1d92d14976882703f8c845523f", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

// MAP MATCHING API
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"mode":"drive","waypoints":[{"timestamp":"2019-11-04T07:09:34.000Z","location":[10.694703,47.567028]},{"timestamp":"2019-11-04T07:09:45.000Z","location":[10.6950319,47.567783]},{"timestamp":"2019-11-04T07:09:57.000Z","location":[10.6952599,47.5682759]},{"timestamp":"2019-11-04T07:10:07.000Z","location":[10.6965304,47.5687653]},{"timestamp":"2019-11-04T07:10:17.000Z","location":[10.6975647,47.5691475]},{"timestamp":"2019-11-04T07:10:28.000Z","location":[10.6984645,47.5689924]},{"timestamp":"2019-11-04T07:10:38.000Z","location":[10.6993804,47.5695884]},{"timestamp":"2019-11-04T07:10:49.000Z","location":[10.7004255,47.5696526]},{"timestamp":"2019-11-04T07:10:59.000Z","location":[10.7017509,47.5691545]},{"timestamp":"2019-11-04T07:11:34.000Z","location":[10.7028073,47.5688025]},{"timestamp":"2019-11-04T07:11:45.000Z","location":[10.7039882,47.5684956]},{"timestamp":"2019-11-04T07:11:55.000Z","location":[10.7059951,47.5678558]},{"timestamp":"2019-11-04T07:12:05.000Z","location":[10.7085059,47.5668116]},{"timestamp":"2019-11-04T07:12:16.000Z","location":[10.7106272,47.5658437]},{"timestamp":"2019-11-04T07:12:26.000Z","location":[10.7130338,47.5651228]},{"timestamp":"2019-11-04T07:12:37.000Z","location":[10.7154089,47.5652946]},{"timestamp":"2019-11-04T07:12:47.000Z","location":[10.7175699,47.5655232]},{"timestamp":"2019-11-04T07:12:58.000Z","location":[10.7203314,47.5657987]},{"timestamp":"2019-11-04T07:13:09.000Z","location":[10.7229241,47.5660543]},{"timestamp":"2019-11-04T07:13:20.000Z","location":[10.7252423,47.5656265]},{"timestamp":"2019-11-04T07:13:30.000Z","location":[10.7269064,47.5647174]},{"timestamp":"2019-11-04T07:13:41.000Z","location":[10.7275872,47.5632757]},{"timestamp":"2019-11-04T07:13:51.000Z","location":[10.7290924,47.5617733]},{"timestamp":"2019-11-04T07:14:02.000Z","location":[10.7312696,47.560384]},{"timestamp":"2019-11-04T07:14:13.000Z","location":[10.7330629,47.5588335]},{"timestamp":"2019-11-04T07:14:23.000Z","location":[10.7348687,47.5579939]},{"timestamp":"2019-11-04T07:14:33.000Z","location":[10.736509,47.5568371]},{"timestamp":"2019-11-04T07:14:44.000Z","location":[10.7384167,47.5569489]},{"timestamp":"2019-11-04T07:14:55.000Z","location":[10.740077,47.556789]},{"timestamp":"2019-11-04T07:15:21.000Z","location":[10.7405779,47.5566208]},{"timestamp":"2019-11-04T07:15:32.000Z","location":[10.7407534,47.5562106]},{"timestamp":"2019-11-04T07:15:43.000Z","location":[10.7399772,47.555543]},{"timestamp":"2019-11-04T07:16:00.000Z","location":[10.7395943,47.5552649]},{"timestamp":"2019-11-04T07:16:11.000Z","location":[10.7387026,47.554868]},{"timestamp":"2019-11-04T07:16:23.000Z","location":[10.7378114,47.554748]}]});

var requestOptions1 = {
  method: 'POST',
  headers: myHeaders,
  body: raw
};

fetch("https://api.geoapify.com/v1/mapmatching?apiKey=457805a28f39445ab2f4c8e81f70f46d", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

// CONSTANTS
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
const mapIcon = document.getElementById("map");
var inputLocation = ""

// INITIALIZED VARIABLES
var currentLat = 0;
var currentLon = 0;
var state = 0;

// INITIALIZED VARIABLES
var currentLat = 0;
var currentLon = 0;
var state = 0;

// ANIMATION GSAP
const tl = new TimelineMax();

tl.fromTo(slider1, .9, {x: "0%"}, {x: "100%"},"+=.6")
  .fromTo(slider2, .8, {y: "0%"}, {y:"-100%"},"-=.1")
  .fromTo(navBar, 1, {y: "-100%"}, {y:"0%"},"-=.1")
  .fromTo(mapIcon, .6, {x: "-100%"}, {x: "0%"});

// TYPEWRITER ANIMATION ON HEADER TEXT
var i = 0;
var txt = 'Plan your next trip ';
var speed = 70;

window.onloadstart = wait();
window.onloadstart = getLoc();

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

// MAP
var map = L.map('map').setView([30.7128, -90.935242], 7);

var myAPIKey = "e5aa2048e6664ce4b56caac669e7ae07";

  // Retina displays require different mat tiles quality
var isRetina = L.Browser.retina;

var baseUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=e5aa2048e6664ce4b56caac669e7ae07";
var retinaUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=e5aa2048e6664ce4b56caac669e7ae07";

  // Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
L.tileLayer(isRetina ? retinaUrl : baseUrl, {
  attribution: '',
  apiKey: myAPIKey,
  maxZoom: 14,
  id: 'osm-bright',
}).addTo(map);

// DARK MODE
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

// CHECKS WHAT THE INPUTTED NAME IS
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

// GETS CURRENT LOCATION OF USER
function getLoc(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getLoc2);
  }else{
    alert("Geolocation not supported in this browser");
  }
}

// FINDS THE CLOSEST CITY FROM THE USERS CURRENT LOCATION
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
var a = 0;
var txt1 = 0
var speed1 = 100;
function typeWriter2(){
  if (a < txt1.length) {
    document.getElementById("search").value += txt1.charAt(a);
    a++;
    setTimeout(typeWriter2, speed1);
  }
}
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
  txt1 = citiesFile[index].city
  state = citiesFile[index].state
  typeWriter2();
}
