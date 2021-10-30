"use strict";

let chordArray = ['A','B','C','D','E','F','G'];
let minor = false;
const getRandomChord = function() {
    const note = chordArray[Math.trunc(Math.random() * chordArray.length)];
    const species = minor?'m':'';
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


  //////////////
 /// Timer ////
//////////////

const timer = setInterval(function() {
    changeTextContent(next, currElement);
    current = next;
    next = getRandomChord();
    changeTextContent(next, nextElement);
}, 3000);


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
    addHiddenClass()
});

overlay.addEventListener('click', function(){
    addHiddenClass()
});

function addHiddenClass() {
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
};


  ///////////////////////////////////
 /// Collection select (slider) ////
///////////////////////////////////

let collectionName = document.getElementById('collection-name');
const collection = document.getElementById('slider-collection');
collection.value = 1;

collection.addEventListener('input', function(){
    switch (collection.value) {
        case '1': 
            collectionName.textContent = 'Majors';
            chordArray = ['A','B','C','D','E','F','G'];
            minor = false;
        break;
        case '2': 
            collectionName.textContent = 'Minors';
            chordArray = ['A','B','C','D','E','F','G'];
            minor = true;
        break;
        case '3': collectionName.textContent = 'C major';
        chordArray = ['Am','Bdim','C','Dm','Em','F','G'];
        minor = false;
        break;
        case '4': collectionName.textContent = 'G major';
        chordArray = ['Am','Bm','C','D','Em','F#dim','G'];
        minor = false;
        break;
        case '5': collectionName.textContent = 'D major';
        chordArray = ['A','Bm','C#dim','D','Em','F#m','G'];
        minor = false;
        break;
    }
});
