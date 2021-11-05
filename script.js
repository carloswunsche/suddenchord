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

// Changes the content of divs (currElement and nextElement)
function changeTextContent(note, div) {
    div.textContent = ''; //Clear div (including span, didn't find other way)
    div.insertAdjacentHTML('afterBegin',note[0]); //Insert note
    div.insertAdjacentHTML('beforeEnd','<span class="flat-sharp"></span>'); //Insert span
    let nodeList = document.querySelectorAll('.flat-sharp');     // Select .flat-sharps (nodelist)
    
    // Compare nodelist with div passed as a parameter to find the right child
    let rightChild;
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].parentNode === div) {
            rightChild = nodeList[i]; 
            break;
        };
    };

    // Remover solo la nota (ej: G) dejando la alteracion o especies si las hay
    note = note.slice(1);
    // Insert alteration if any into span
    if (note[0] === 'b') {
        rightChild.textContent = String.fromCharCode('0x266d');
        // Nuevamente remover
        note = note.slice(1);
    }
    if (note[0] === '#') {
        rightChild.textContent = '#';
        // Nuevamente remover
        note = note.slice(1);
    }
    
    // Si queda especie o algo al final, insertar
    if (note.length > 0) div.insertAdjacentHTML('beforeEnd', note);
    // Insert any other species at the end, if any
    div.insertAdjacentHTML('beforeEnd', species);
};

// Initialization
function init(string, arr1, arr2 = [], arr3 = []) {
    collection = [...arr1, ...arr2, ...arr3];
    bag = [...collection];
    species = string;
    current = takeChordFromBag();
    next    = takeChordFromBag();
    changeTextContent(current, currElement);
    changeTextContent(next, nextElement);
};


  ////////////////////
 /// Starting up ////
////////////////////

// DOM elements and variables
const currElement = document.querySelector('.current .chord');
const nextElement = document.querySelector('.next .chord');
const nextLabel = document.querySelector('.next .label');
const whiteKeys = ['A','B','C','D','E','F','G'];
const blackKeysFlat = ['Ab','Bb','Db','Eb','Gb'];
const blackKeysSharp = ['A#','C#','D#','F#','G#'];
let current, next, collection, bag, species;

// Initialize!
init('', whiteKeys, blackKeysFlat);



  //////////////
 /// Timer ////
//////////////

let timer;
function callTimer() {
    timer = setInterval(function() {

        current = next;
        next = takeChordFromBag();
        changeTextContent(current, currElement);
        changeTextContent(next, nextElement);

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
            init('', whiteKeys, blackKeysFlat);
        break;
        case '2': 
            collectLabel.textContent = 'Collection: Minors';
            init('m', whiteKeys, blackKeysSharp);
        break;
        case '3': 
            collectLabel.textContent = 'Collection: C major';
            init('', ['Am','Bdim','C','Dm','Em','F','G']);
        break;
        case '4': collectLabel.textContent = 'Collection: G major';
            init('', ['Am','Bm','C','D','Em','F#dim','G']);
        break;
        case '5': collectLabel.textContent = 'Collection: D major';
            init('', ['A','Bm','C#dim','D','Em','F#m','G']);
        break;
    }
});



  ////////////////////////
 /// Flat or Sharp ? ////
////////////////////////

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
        callTimer();
        nextLabel.textContent = 'Next:';
        startStopBtn.textContent = 'Stop';
    } else {
        clearInterval(timer);
        startStopBtn.textContent='Go!';
    };
});