"use strict";

const chordArray = ['A','B','C','D','E','F','G'];
let minor = false;

const changeCurChord = function(newChord = 'C') {
    //Switch between minor and major
    minor = !minor;
    if (minor) newChord = newChord + 'm';
    //Display new chord
    document.querySelector('.current .chord').textContent = newChord;
};


const timer = setInterval(function() {
    changeCurChord(chordArray[Math.trunc(Math.random() * chordArray.length)])
}, 2000);


// let stop = false;
// if (stop) clearInterval(timer);