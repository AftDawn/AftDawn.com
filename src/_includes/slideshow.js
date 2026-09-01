const slideIndexes = {
"fursona-slideshow": 1,
"character-slideshow": 2
};

const ACTIVE_DOT = "bg-sky-400";
const VISITED_DOT = "bg-sky-500";
const UNVISITED_DOT = "bg-gray-700";

function plusSlides(id, n) {
slideIndexes[id] += n;
showSlides(id);
}

function currentSlide(id, n) {
slideIndexes[id] = n;
showSlides(id);
}

function showSlides(id) {
const container = document.getElementById(id);
const slides = container.getElementsByClassName("slideshow-slides");
const dots = container.getElementsByClassName("slideshow-dot");

let index = slideIndexes[id];

if (index > slides.length) {
    index = slideIndexes[id] = 1;
}

if (index < 1) {
    index = slideIndexes[id] = slides.length;
}

for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
}

for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove(ACTIVE_DOT);
}

dots[index - 1].classList.remove(UNVISITED_DOT);
dots[index - 1].classList.add(VISITED_DOT);
dots[index - 1].classList.add(ACTIVE_DOT);

document.getElementById(`${id}-description`).textContent = slideData[id][index - 1];

slides[index - 1].style.display = "block";
}

showSlides("fursona-slideshow");
showSlides("character-slideshow");