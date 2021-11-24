"use strict";
import Metronome from './metronome.js';

  /////////////////
 /// Elements ////
/////////////////

const currNote = document.querySelector('.current .note');
const currFS   = document.querySelector('.current .flat-sharp');
const currType = document.querySelector('.current .type');

const nextNote = document.querySelector('.next .note');
const nextFS   = document.querySelector('.next .flat-sharp');
const nextType = document.querySelector('.next .type');
const nextLabel = document.querySelector('.next .label');

const visualMetronome = document.querySelector('.metronome');
const visualBeat = document.querySelector('.beat');

const whiteKeys      = ['A','B','C','D','E','F','G'];
const blackKeysFlat  = ['Ab','Bb','Db','Eb','Gb'];
const blackKeysSharp = ['G#','A#','C#','D#','F#'];
let blackKeys, current, next, collection, bag;
let species = '';

const openModalBtn = document.querySelector('.open-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');
const collectLabel  = document.getElementById('label-collection');
const collectSlider = document.getElementById('slider-collection');
const altsNodeList = document.getElementsByName('alterations');
const bpmSlider = document.getElementById('slider-bpm');
const bpmLabel = document.getElementById('label-bpm');
const measureSlider = document.getElementById('slider-beats');
const measureLabel  = document.getElementById('label-beats');
const volSlider = document.getElementById('slider-vol');
const startStopBtn = document.querySelector('.start-stop-btn');

let bpm = 90;
let beatsPerMeasure = 4;
let modalIsOpen = false;
let alts;
let run = false;
let spaceReleased = true;



  /////////////////
 /// Functions ///
/////////////////

function init(arr1, arr2) {
  collection = [...arr1, ...arr2];
  bag = [...collection];
  current = takeNoteFromBag();
  next    = takeNoteFromBag();
  changeDivContent(current, currNote, currFS, currType);
  changeDivContent(next, nextNote, nextFS, nextType);
};

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

function updateChords() {
  current = next;
  next = takeNoteFromBag();
  changeDivContent(current, currNote, currFS, currType);
  changeDivContent(next, nextNote, nextFS, nextType);
};

function drawVisualMetronome(beatsPerMeasure) {
  visualMetronome.textContent = ''; // Clean content first
  if (beatsPerMeasure !== 1) {      // Insert beats
    for (let i=0; i < beatsPerMeasure; i++) {
        visualMetronome.insertAdjacentHTML('beforeEnd', visualBeat.outerHTML);
    };
  };
};

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  modalIsOpen = false;
};

function setAlts(altValue) {
  let prevBlackKeys = [];
  switch (altValue) {
      case 'flat':  
          blackKeys = [...blackKeysFlat];
          prevBlackKeys = [...blackKeysSharp];
          altsNodeList[0].checked = true;
          setCookie('alts', 'flat'); // Save cookie
          break;
      case 'sharp': 
          blackKeys = [...blackKeysSharp]; 
          prevBlackKeys = [...blackKeysFlat];
          altsNodeList[1].checked = true;
          setCookie('alts', 'sharp'); // Save cookie
          break;
  };
  changeAlts(prevBlackKeys, whiteKeys, blackKeys);
};

function changeAlts(prevArray, arr1, arr2) {
  // Update collection for future bag refilling
  collection = [...arr1, ...arr2];
  // Update bag replacing previous alts with new ones
  for (const [i1, el1] of bag.entries()) {
      for (const [i2, el2] of prevArray.entries()) {
          if (el1 === el2) bag[i1] = blackKeys[i2];
      };
  };
  // Update current and next
  for (const [i, el] of prevArray.entries()) {
      if (current === el) current = blackKeys[i]; 
      if (next    === el) next    = blackKeys[i];
  };
  // Update the chords on screen
  changeDivContent(current, currNote, currFS, currType);
  changeDivContent(next, nextNote, nextFS, nextType);
};

function enableAlts(boolean) {
  for (let i=0; i<altsNodeList.length; i++) {
  altsNodeList[i].disabled = !boolean;
  };
};

function collectSliderEvent(inputValue) {
  switch (inputValue) {
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
  };
};

function setClickVolume(value) {
  metronome.click1.volume(value);
  metronome.click2.volume(value);
};

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

function setCookie(cName, cValue, expDays = 30) {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  // document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  document.cookie = `${cName}=${cValue}; ${expires}` // No path and template literal
};

function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); // To be careful
  const cArr = cDecoded.split('; ');
  let res; // Result
  cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
};



  ///////////////////////////////////
 /// Load from Cookie / Defaults ///
///////////////////////////////////

if (getCookie('collection') !== undefined) {
  collectSlider.value = parseInt(getCookie('collection'));
  collectSliderEvent(collectSlider.value);
} else collectSlider.value = 1;

if (getCookie('alts') !== undefined) {
  alts = getCookie('alts');
} else alts = 'flat';

if (getCookie('bpm') !== undefined) {
  bpm = parseInt(getCookie('bpm'));
} else bpm = 100;

if (getCookie('beatsPerMeasure') !== undefined) {
  beatsPerMeasure = parseInt(getCookie('beatsPerMeasure'));
} else beatsPerMeasure = 4;

if (getCookie('volume') !== undefined) {
  volSlider.value = parseFloat(getCookie('volume'));
  setClickVolume(volSlider.value);
} else volSlider.value = 1;



  ////////////////////////
 /// Document On Load ///
////////////////////////

init(whiteKeys, blackKeysFlat);
drawVisualMetronome(beatsPerMeasure);
const metronome = new Metronome(updateChords, bpm, beatsPerMeasure, visualMetronome);
setAlts(alts);



  ///////////////////////
 /// Event Listeners ///
///////////////////////

openModalBtn.addEventListener('click', function(){
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
  modalIsOpen = true;
});
closeModalBtn.addEventListener('click', function(){closeModal()});
overlay.addEventListener('click', function(){closeModal()});

collectSlider.addEventListener('input', function(){
  collectSliderEvent(collectSlider.value);
  setCookie('collection', collectSlider.value); // Save cookie on slider input
});

for (const [i, val] of altsNodeList.entries()) {
  val.addEventListener('click', function(){
      setAlts(val.value);
  });
};

measureSlider.addEventListener('input', function(){
  measureLabel.textContent = `Beats per measure: ${measureSlider.value}`
  beatsPerMeasure = parseInt(measureSlider.value);
  drawVisualMetronome(beatsPerMeasure);
  // Update values used in timer.js
  metronome.beatsPerMeasure = beatsPerMeasure;
  metronome.vMetronome      = visualMetronome;
  metronome.vBeats          = visualMetronome.querySelectorAll('.beat');
  setCookie('beatsPerMeasure', measureSlider.value); // Save cookie
});

tempoSlider.addEventListener('input', () => {
  bpm = tempoSlider.value;
  metronome.timeInterval = 60000 / bpm;
  tempoLabel.textContent = `Speed: ${bpm} bpm`;
  setCookie('bpm', tempoSlider.value); // Save cookie
});

volSlider.addEventListener('input', function(){
  setClickVolume(volSlider.value);
  setCookie('volume', volSlider.value); // Save cookie
});

startStopBtn.addEventListener('click', function(){
  run = !run;
  runSwitch()
});

window.addEventListener('keydown', key => {
  if (spaceReleased && key.code === 'Space') {
      run = !run;
      runSwitch();
      spaceReleased = false;
      document.body.style.overflow = "hidden"; // to prevent the spacebar from scrolling page
  };
});

window.addEventListener('keyup', key => { 
  if (key.code === 'Space') spaceReleased = true;
  document.body.style.overflow = "auto"; // to prevent the spacebar from scrolling page
});