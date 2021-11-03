"use strict";
console.clear();
///////////////////////////////////////////////////
const whiteKeys = ['A','B','C','D','E','F','G'];
const blackKeysFlat = ['Ab','Bb','Db','Eb','Gb'];
const blackKeysSharp = ['A#','C#','D#','F#','G#'];
let collection = setCollection(whiteKeys, blackKeysSharp);
let bag = [...collection]; 
let species = '';

// Build the collection based on chosen sets
function setCollection(set1, set2 = [], set3 = []) {
    return [...set1, ...set2, ...set3];
};

// Returns a random chord from the bag
function takeChordFromBag() {
    // Get a random index from bag
    const index = Math.trunc(Math.random() * bag.length);
    // Chosen chord into variable before deleting it from bag
    const chord = bag[index];
    // Remove chord from bag
    bag.splice(index, 1);
    // Fill bag again if empty
    if (bag.length === 0) bag = [...collection];
    // Return
    return chord;
};



  ///////////////////////////
 /// DOM Initialization ////
///////////////////////////

// DOM elements
let current, next;
const currElement = document.querySelector('.current .chord');
const currElementSpan = document.querySelector('.current .chord .flat-sharp');
const nextElement = document.querySelector('.next .chord');
const nextElementSpan = document.querySelector('.next .chord .flat-sharp');
const nextLabel = document.querySelector('.next .label');

// Changes the content of currElement nextElement
function changeTextContent(note, div, span) {
    // Insert chord
    div.insertAdjacentHTML('afterBegin',note[0]);
    // Clear span
    span.textContent = '';
    // Insert alteration if any
    if (note[1] === 'b') span.textContent = String.fromCharCode('0x266d');
    if (note[1] === '#') span.textContent = '#';
    // Insert species at the end, if any other than Major
    div.insertAdjacentHTML('beforeEnd', species);
};


  //////////////
 /// Timer ////
//////////////

let timer;
function callTimer() {
    timer = setInterval(function() {
        changeTextContent(current, currElement, currElementSpan);
        current = next;
        next = takeChordFromBag();
        changeTextContent(next, nextElement, nextElementSpan);
    }, 1000);
};


  ////////////////////////////////
 /// Modal window (Settings) ////
////////////////////////////////

const openModalBtn = document.querySelector('.open-modal')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');

openModalBtn.addEventListener('click', function(){
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
    clearInterval(timer);
});

closeModalBtn.addEventListener('click', function(){closeModal()});
overlay.addEventListener('click', function(){closeModal()});

function closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    callTimer() ;
};



  ///////////////////////////////////
 /// Collection select (slider) ////
///////////////////////////////////

const collectionName = document.getElementById('collection-name');
const selectedCollection = document.getElementById('slider-collection');
selectedCollection.value = 2;

selectedCollection.addEventListener('input', function(){
    switch (selectedCollection.value) {
        case '1': 
            collectionName.textContent = 'Collection: Majors';
            collection = setCollection(whiteKeys, blackKeys);
            species = '';
        break;
        case '2': 
            collectionName.textContent = 'Collection: Minors';
            collection = setCollection(whiteKeys, blackKeys);
            species = 'm';
        break;
        case '3': collectionName.textContent = 'Collection: C major';
            collection = ['Am','Bdim','C','Dm','Em','F','G'];
            species = '';
        break;
        case '4': collectionName.textContent = 'Collection: G major';
            collection = ['Am','Bm','C','D','Em','F#dim','G'];
            species = '';
        break;
        case '5': collectionName.textContent = 'Collection: D major';
            collection = ['A','Bm','C#dim','D','Em','F#m','G'];
            species = '';
        break;
    }
});



  ///////////////////////////
 /// Alterations select ////
///////////////////////////

// const alterations = document.getElementsByName('alterations');
// // alterations[0].checked = true; // Esta linea es necesaria si uno no la puso en el HTML
// for (const [i, val] of alterations.entries()) {
//     val.addEventListener('click', function(){
//         switch (val.value) {
//             case 'flat':  collection = setCollection(whiteKeys, blackKeysFlat);
//             case 'sharp': collection = setCollection(whiteKeys, blackKeysSharp);
//         };
//         bag = [...collection]; 
//     });
// };


  ////////////////////////////
 /// Start / Stop Button ////
////////////////////////////

let run = false;
const startStopBtn = document.querySelector('.start-stop-btn');

startStopBtn.addEventListener('click', function(){
    run = !run;

    if (run) {
        nextLabel.textContent = 'Next:';
        startStopBtn.textContent = 'Stop';

        current = takeChordFromBag();
        next    = takeChordFromBag();
        changeTextContent(current, currElement, currElementSpan);
        changeTextContent(next, nextElement, nextElementSpan);
        callTimer();
    } else {
        clearInterval(timer);
        startStopBtn.textContent='Go!';
    };
});