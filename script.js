"use strict";

const chordArray = ['A','B','C','D','E','F','G'];
let minor = false;
const getRandomChord = function() {
    const note = chordArray[Math.trunc(Math.random() * chordArray.length)];
    const species = minor?'m':'';
    minor = !minor;
    return note+species;
};
let current = getRandomChord();
let next    = getRandomChord();
const currElement = document.querySelector('.current .chord');
const nextElement = document.querySelector('.next .chord');
const changeTextContent = function(chord, element) {
    element.textContent = chord;
};
changeTextContent(current, currElement);
changeTextContent(next, nextElement);



const timer = setInterval(function() {
    changeTextContent(next, currElement);
    current = next;
    next = getRandomChord();
    changeTextContent(next, nextElement);
}, 2000);


// let stop = false;
// if (stop) clearInterval(timer);


  /////////////////////////////
 /// Modal window (Setup) ////
/////////////////////////////

const openModal = document.querySelector('.open-modal')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModal = document.querySelector('.close-modal');

openModal.addEventListener('click', function(){
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
});

closeModal.addEventListener('click', function(){
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
});

overlay.addEventListener('click', function(){
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
});