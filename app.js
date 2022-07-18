const slider1 = document.querySelector('.firstSlider');
const slider2 = document.querySelector('.secondSlider');
const navBar = document.querySelector('.navBar');
const car = document.querySelector('.fa-solid fa-car-side');
const plane = document.querySelector('.fa-solid fa-plane-up');
const headline = document.querySelector('.headline');

const tl = new TimelineMax();

tl.fromTo(slider1, 1.5, {x: "0%"}, {x: "100%"},"+=.6")
    .fromTo(slider2, 1, {y: "0%"}, {y:"-100%"})
    .fromTo(navBar, 1, {y: "-100%"}, {y:"0%"});

var i = 0;
var txt = 'Plan your next trip';
var speed = 70;
var x = 0;
var checker = 0;

window.onloadstart = wait();

function wait(){
    setTimeout(typeWriter, 2350);
};

function typeWriter() {
  if (i < txt.length) {
    headline.innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
};