"use strict";
import Metronome from './metronome.js';

  //////////////////
 /// Functions ////
//////////////////

// Returns a random chord from the bag
function takeNoteFromBag() {
    // Get a random index from bag
    const index = Math.trunc(Math.random() * bag.length);
    // Chosen note into variable before deleting it from bag
    const note = bag[index];
    // Remove note from bag
    bag.splice(index, 1);
    // Fill bag again if empty
    if (bag.length === 0) bag = [...collection];
    // Return note
    return note;
};

// Changes the content of divs currChord and nextChord
function changeDivContent(chord, note, flatSharp, type) {
    //Clear all elements first
    note.textContent = ''; flatSharp.textContent = ''; type.textContent = '';

    //Insert note
    note.textContent = chord[0]; chord = chord.slice(1);

    //Insert flat-sharp if any
    if (chord[0] === 'b') {
        flatSharp.textContent = String.fromCharCode('0x266d'); 
        chord = chord.slice(1);
    };
    if (chord[0] === '#') {
        flatSharp.textContent = '#'; 
        chord = chord.slice(1);
    };
    
    //If the chord contains a type (species), insert it
    if (chord.length > 0) type.textContent = chord;

    //Also insert species variable if different than the empty string
    if (species !== '') type.insertAdjacentHTML('beforeEnd', species);
};

// Initialization
function init(arr1 = whiteKeys, arr2 = blackKeys, arr3 = []) {
    collection = [...arr1, ...arr2, ...arr3];
    bag = [...collection];
    current = takeNoteFromBag();
    next    = takeNoteFromBag();
    changeDivContent(current, currNote, currFS, currType);
    changeDivContent(next, nextNote, nextFS, nextType);
};



  ////////////////////////////////////////
 /// Gathering DOM elements and Init ////
////////////////////////////////////////

const currNote = document.querySelector('.current .note');
const currFS   = document.querySelector('.current .flat-sharp');
const currType = document.querySelector('.current .type');

const nextNote = document.querySelector('.next .note');
const nextFS   = document.querySelector('.next .flat-sharp');
const nextType = document.querySelector('.next .type');
const nextLabel = document.querySelector('.next .label');

const whiteKeys = ['A','B','C','D','E','F','G'];
const blackKeysFlat  = ['Ab','Bb','Db','Eb','Gb'];
const blackKeysSharp = ['G#','A#','C#','D#','F#'];
let blackKeys = [...blackKeysFlat];
let current, next, collection, bag;
let species = '';

// Initialize
init(whiteKeys, blackKeys);



  //////////////////
 /// Metronome ////
//////////////////

function updateChords() {
    current = next;
    next = takeNoteFromBag();
    changeDivContent(current, currNote, currFS, currType);
    changeDivContent(next, nextNote, nextFS, nextType);
};

// Visual metronome variables
const visualBeat = document.querySelector('.beat');
const visualMetronome = document.querySelector('.metronome');


function drawVisualMetronome(beatsPerMeasure) {
    // Clean content first
    visualMetronome.textContent = '';
    // Insert beats
    for (let i=0; i < beatsPerMeasure; i++) {
        visualMetronome.insertAdjacentHTML('beforeEnd', visualBeat.outerHTML);
    };
    if (beatsPerMeasure === 1) visualMetronome.textContent = '';
};

let bpm = 90
const tempoSlider = document.getElementById('slider-tempo');
const tempoLabel = document.getElementById('speed-bpm');
tempoSlider.value = bpm;
tempoLabel.textContent = `Speed: ${bpm} bpm`;
tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;
    metronome.timeInterval = 60000 / bpm;
    tempoLabel.textContent = `Speed: ${bpm} bpm`;
});
let beatsPerMeasure = 4;
drawVisualMetronome(beatsPerMeasure);
const metronome = new Metronome(updateChords, bpm, beatsPerMeasure, visualMetronome);

  ////////////////////////////////
 /// Modal window (Settings) ////
////////////////////////////////

let modalIsOpen = false;
const openModalBtn = document.querySelector('.open-modal')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');

openModalBtn.addEventListener('click', function(){
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
    modalIsOpen = true;
});

closeModalBtn.addEventListener('click', function(){closeModal()});
overlay.addEventListener('click', function(){closeModal()});

function closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    modalIsOpen = false;
};



  ///////////////////////
 // Flat or Sharp ? ////
///////////////////////

const alterations = document.getElementsByName('alterations');
// alterations[0].checked = true; // Esta linea es necesaria si uno no la puso en el HTML
for (const [i, val] of alterations.entries()) {
    val.addEventListener('click', function(){
        let prevBlackKeys;
        switch (val.value) {
            case 'flat':  
                blackKeys = [...blackKeysFlat];
                prevBlackKeys = [...blackKeysSharp];  
                break;
            case 'sharp': 
                blackKeys = [...blackKeysSharp]; 
                prevBlackKeys = [...blackKeysFlat];
                break;
        };
        console.log(prevBlackKeys)
        console.log(blackKeys)
        changeAlts(prevBlackKeys, whiteKeys, blackKeys);
    });
};

function changeAlts(prevArr, arr1 = whiteKeys, arr2 = blackKeys, arr3 = []) {
    // Update collection for future bag refilling
    collection = [...arr1, ...arr2, ...arr3];

    // Update bag replacing previous alts with new ones
    for (const [i1, el1] of bag.entries()) {
        for (const [i2, el2] of prevArr.entries()) {
            if (el1 === el2) bag[i1] = blackKeys[i2];
        };
    };

    // Update current and next
    for (const [i, el] of prevArr.entries()) {
        if (current === el) current = blackKeys[i];
        if (next    === el) next    = blackKeys[i];
    };

    // Update the chords on screen
    changeDivContent(current, currNote, currFS, currType);
    changeDivContent(next, nextNote, nextFS, nextType);
};

function enableAlts(boolean) {
    for (let i=0; i<alterations.length; i++) {
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



  ///////////////////////////////////
 /// Beats per measure (slider) ////
///////////////////////////////////

const measureLabel = document.getElementById('beats-measure');
const measureSlider = document.getElementById('slider-beats');
measureSlider.value = beatsPerMeasure;
measureLabel.textContent = `Beats per measure: ${beatsPerMeasure}`

measureSlider.addEventListener('input', function(){
    measureLabel.textContent = `Beats per measure: ${measureSlider.value}`
    beatsPerMeasure = parseInt(measureSlider.value);
    drawVisualMetronome(beatsPerMeasure);
    // Update values used in timer.js
    metronome.beatsPerMeasure = beatsPerMeasure;
    metronome.vMetronome      = visualMetronome;
    metronome.vBeats          = visualMetronome.querySelectorAll('.beat');
});



  ////////////////////////////
 /// Start / Stop Button ////
////////////////////////////

let run = false;
const startStopBtn = document.querySelector('.start-stop-btn');
startStopBtn.addEventListener('click', function(){
    run = !run;
    runSwitch()
});

function runSwitch() {
    if (run) {
        metronome.start();
        nextLabel.textContent = 'Next:';
        startStopBtn.textContent = 'Stop';
    } else {
        metronome.stop();
        startStopBtn.textContent='Go!';
    };
};



  /////////////////////////////////
 /// Spacebar to Start / Stop ////
/////////////////////////////////

let spaceReleased = true;
window.addEventListener('keydown', key => {
    if (spaceReleased && key.code === 'Space') {
        run = !run;
        runSwitch();
        spaceReleased = false;
    };
});

window.addEventListener('keyup', key => { 
    if (key.code === 'Space') spaceReleased = true;
});