// CONSTANTS ///////////////////////////////////////////////////////////////////////////////
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
const currentLoc = document.getElementById('currentLocation');
const search = document.getElementById('search');
const inputNameSlider = document.getElementById('name');
const inputMileSlider = document.getElementById('miles');
const submitButton = document.getElementById('submitButton');
const cityFlex = document.querySelector('.citySlot');
const mapText = document.getElementById('mapText');

fetch("./cities.json")
.then(response => {
  return response.json();
})
.then(data => citiesFile = data);

// TYPEWRITER ANIMATION FUNCTION ///////////////////////////////////////////////////////////////////////////////
var a = 0;
var txt = 'Plan your next trip ';
var speed = 40;
function typeWriter() {
  if (a < txt.length) {
    headline.innerHTML += txt.charAt(a);
    a++;
    setTimeout(typeWriter, speed);
  }
  getLoc()
}

var b = 0;
var txt2 = '';
var speed2 = 120;
function typeWriter2(){
  if (b < txt2.length) {
    currentLoc.innerHTML += txt2.charAt(b);
    b++;
    setTimeout(typeWriter2, speed2);
  }
}

// INITIALIZED VARIABLES ///////////////////////////////////////////////////////////////////////////////
var currentLat = 40.7127837;
var currentLon = -74.0059413;
var state = 'New York';

search.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitButton.click();
  }
});
// ANIMATION GSAP ///////////////////////////////////////////////////////////////////////////////
const tl = new TimelineMax();

tl.fromTo(slider1, .8, {x: "0%"}, {x: "100%"},"+=.6")
  .fromTo(slider2, .8, {y: "0%"}, {y:"-100%"})
  .fromTo(navBar, 1, {y: "-100%"}, {y:"0%"},"-=.1");

window.onloadstart = wait();
window.onloadstart = getLoc();

function wait(){
  setTimeout(typeWriter, 2450);
}

function closeSlide(){
  tl.fromTo(slider3, 1, {x: "100%"}, {x: "0%"});
}
// DARK MODE ///////////////////////////////////////////////////////////////////////////////
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

// CHECKS WHAT THE INPUTTED NAME IS ///////////////////////////////////////////////////////////////////////////////
var stateLocation = '';
var inputLocation = "";
var click = 0;
function saveName(){
  inputLocation = search.value;
  click ++;
  var states = '';
  var city = 0;
  var state = 0;
  var lat = 0;
  var long = 0;
  var pop = 0;
  var sameChecker = 0;
  
  for(let x = 0; x < citiesFile.length; x++){
    if((citiesFile[x].city.toLowerCase() == inputLocation.toLowerCase()) || (citiesFile[x].city.toUpperCase() == inputLocation.toUpperCase())){
      sameChecker++;
      city = citiesFile[x].city;
      state = citiesFile[x].state;
      lat = citiesFile[x].latitude;
      long = citiesFile[x].longitude;
      pop = citiesFile[x].population;

      states += ' ';
      states += citiesFile[x].state;
    }
  }
  if(click = true){
    stateLocation = search.value;
    alert(stateLocation);
    alert(inputLocation);
  }
  // CHECK IF MULTIPLE CITIES OF SAME NAME ////////////////////////////
  if(sameChecker > 1){
    search.value = '';
    search.placeholder = "Specify -" + String(states) + "?";
  /////////////////////////////////////////////////////////////////////
  }
  if(sameChecker == 1){
    inputNameSlider.innerHTML = String(city) + ", " + String(state);
    mapText.innerHTML = 'Population: ' + pop;
    locationSlider()
    // MAP /////////////////////////////////////////////////////////////////////////////////////////////
    var myLatlng = new google.maps.LatLng(lat,long);
    var mapOptions = {
      zoom: 12,
      center: myLatlng
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    var marker = new google.maps.Marker({
      position: myLatlng,
    });
    marker.setMap(map);
    /////////////////////////////////////////////////////////////////////////////////////////////////////
  }else{
    search.placeholder = "Not a valid city, please try again.";
    search.value = '';
    setTimeout(function(){
      search.placeholder = "Where to...?";
    },1500);
  }
}

// test newark
  
  /*
  for(let x = 0; x < citiesFile.length; x++){
    if((stateLocation.toLowerCase() == citiesFile[x].state.toLowerCase()) && (secondClickCity.toLowerCase() == citiesFile[x].city)){
      state = citiesFile[x].state;
      city = citiesFile[x].city;
      lat = citiesFile[x].latitude;
      long = citiesFile[x].longitude;
      pop = citiesFile[x].population;
      found = true;
      secondClick = 0;
      inputNameSlider.innerHTML = String(city) + ", " + String(state);
      locationSlider()
      // MAP /////////////////////////////////////////////////////////////////////////////////////////////
      var myLatlng = new google.maps.LatLng(lat,long);
      var mapOptions = {
        zoom: 12,
        center: myLatlng
      }
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var marker = new google.maps.Marker({
        position: myLatlng,
      });
      marker.setMap(map);
    }
  }
  */



function locationSlider(){
  search.value = "";
  tl.fromTo(slider3, 1.4, {x: "0%"}, {x: "100%"})
    .fromTo(inputNameSlider, .8, {y: "0%"}, {y: "-1300%"})
    .fromTo(cityFlex, 1, {y: "0%"}, {y: "-125%"},"-=.8");
};

// GETS CURRENT LOCATION OF USER ///////////////////////////////////////////////////////////////////////////////
function getLoc(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getLoc2);
  }else{
    alert("Geolocation not supported in this browser");
  }
}

// FINDS THE CLOSEST CITY FROM THE USERS CURRENT LOCATION ///////////////////////////////////////////////////////////////////////////////
//citiesFile = 0;
function getLoc2(position){
  currentLat = position.coords.latitude;
  currentLon = position.coords.longitude;
  checkLocation();
}

/* checks where the nearest city is from the current location ///////////////////////////////////////////////////////////////////////////////
   and how far it is in miles */
function checkLocation(){
  var index = 0;
  var miles = 0;
  var miles1 = 0;

  // INITIALIZE FIRST DISTANCE ///////////////////////////////////////////////////////////////////////////////
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
  // LOOP THROUGH REST ///////////////////////////////////////////////////////////////////////////////
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
  state = citiesFile[index].state;
  txt2 = 'Nearest City: ' + citiesFile[index].city;
  typeWriter2();
}