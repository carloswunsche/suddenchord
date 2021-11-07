"use strict";
console.clear();
  //////////////////
 /// Functions ////
//////////////////

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

// Changes the content of divs (currChord and nextChord)
function changeTextContent(chord, note, flatSharp, type) {
    //Clear all elements first
    note.textContent = ''; flatSharp.textContent = ''; type.textContent = '';

    //Insert note
    note.textContent = chord[0]; chord = chord.slice(1);

    //Insert flat-sharp if any
    if (chord[0] === 'b') {
        flatSharp.textContent = String.fromCharCode('0x266d'); chord = chord.slice(1);
    };
    if (chord[0] === '#') {
        flatSharp.textContent = '#'; chord = chord.slice(1);
    };
    
    //If the chord contains a type (species), insert it
    if (chord.length > 0) type.textContent = chord;

    //Also insert species variable if different than empty string
    if (species !== '') type.insertAdjacentHTML('beforeEnd', species);
};

// Initialization
function init(arr1 = whiteKeys, arr2 = blackKeys, arr3 = []) {
    collection = [...arr1, ...arr2, ...arr3];
    bag = [...collection];
    current = takeChordFromBag();
    next    = takeChordFromBag();
    changeTextContent(current, currNote, currFS, currType);
    changeTextContent(next, nextNote, nextFS, nextType);
};


  ////////////////////
 /// Starting up ////
////////////////////

// DOM elements and variables
const currNote = document.querySelector('.current .note');
const currFS   = document.querySelector('.current .flat-sharp');
const currType = document.querySelector('.current .type');

const nextNote = document.querySelector('.next .note');
const nextFS   = document.querySelector('.next .flat-sharp');
const nextType = document.querySelector('.next .type');
const nextLabel = document.querySelector('.next .label');

const whiteKeys = ['A','B','C','D','E','F','G'];
const blackKeysFlat = ['Ab','Bb','Db','Eb','Gb'];
const blackKeysSharp = ['A#','C#','D#','F#','G#'];
let blackKeys = [...blackKeysFlat];
let current, next, collection, bag;
let species = '';

// Initialize!
init();



  //////////////
 /// Timer ////
//////////////

let timer;
function callTimer() {
    timer = setInterval(function() {

        current = next;
        next = takeChordFromBag();
        changeTextContent(current, currNote, currFS, currType);
        changeTextContent(next, nextNote, nextFS, nextType);

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
    if (run) callTimer();
};


  ///////////////////////
 // Flat or Sharp ? ////
///////////////////////

const alterations = document.getElementsByName('alterations');
// alterations[0].checked = true; // Esta linea es necesaria si uno no la puso en el HTML
for (const [i, val] of alterations.entries()) {
    val.addEventListener('click', function(){
        switch (val.value) {
            case 'flat':  blackKeys = [...blackKeysFlat];  break;
            case 'sharp': blackKeys = [...blackKeysSharp]; break;
        };
        init();
    });
};

function enableAlts(boolean) {
    for (let i=0; i<alterations.length;i++) {
    alterations[i].disabled = !boolean;
    };
};


  ///////////////////////////////////
 /// Collection select (slider) ////
///////////////////////////////////

const collectLabel = document.getElementById('collection-name');
const collectSlider = document.getElementById('slider-collection');
collectSlider.value = 1; 

collectSlider.addEventListener('input', function(){
    switch (collectSlider.value) {
        case '1': 
            collectLabel.textContent = 'Collection: Majors';
            enableAlts(true);
            species = '';
            init();
        break;
        case '2': 
            collectLabel.textContent = 'Collection: Minors';
            enableAlts(true);
            species = 'm';
            init();
        break;
        case '3': 
            collectLabel.textContent = 'Collection: C major';
            enableAlts(false);
            species = '';
            init(['Am','Bdim','C','Dm','Em','F','G'], []);
        break;
        case '4': collectLabel.textContent = 'Collection: G major';
            enableAlts(false);
            species = '';
            init(['Am','Bm','C','D','Em','F#dim','G'], []);
        break;
        case '5': collectLabel.textContent = 'Collection: D major';
            enableAlts(false);
            species = '';
            init(['A','Bm','C#dim','D','Em','F#m','G'], []);
        break;
    }
});


  ////////////////////////////
 /// Start / Stop Button ////
////////////////////////////

let run = false;
const startStopBtn = document.querySelector('.start-stop-btn');
startStopBtn.addEventListener('click', function(){
    run = !run;

    if (run) {
        callTimer();
        nextLabel.textContent = 'Next:';
        startStopBtn.textContent = 'Stop';
    } else {
        clearInterval(timer);
        startStopBtn.textContent='Go!';
    };
});