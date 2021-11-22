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
const nextLabel= document.querySelector('.next .label');

const whiteKeys      = ['A','B','C','D','E','F','G'];
const blackKeysFlat  = ['Ab','Bb','Db','Eb','Gb'];
const blackKeysSharp = ['G#','A#','C#','D#','F#'];
let blackKeys, current, next, collection, bag;
let species = '';

const visualBeat = document.querySelector('.beat');
const visualMetronome = document.querySelector('.metronome');
let bpm;
const bpmSlider = document.getElementById('slider-bpm');
const bpmLabel = document.getElementById('label-bpm');
bpmSlider.value = bpm;
bpmLabel.textContent = `Speed: ${bpm} bpm`;
let beatsPerMeasure;
const metronome = new Metronome(updateChords, bpm, beatsPerMeasure, visualMetronome);

let modalIsOpen = false;
const openModalBtn = document.querySelector('.open-modal')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');

const altsNodeList = document.getElementsByName('alterations');
let alts;

const collectLabel  = document.getElementById('label-collection');
const collectSlider = document.getElementById('slider-collection');

const measureLabel  = document.getElementById('label-beats');
const measureSlider = document.getElementById('slider-beats');
measureSlider.value = beatsPerMeasure;
measureLabel.textContent = `Beats per measure: ${beatsPerMeasure}`

const volSlider = document.getElementById('slider-vol');

let run = false;
const startStopBtn = document.querySelector('.start-stop-btn');

let spaceReleased = true;