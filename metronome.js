  /////////////////////
 /// Timer module ////
/////////////////////

function Metronome(updateChords, timeInterval, beatsPerMeasure, vMetronome) {
    this.click1 = new Howl({src: ['click01.ogg']});
    this.click2 = new Howl({src: ['click02.ogg']});
    this.timeInterval = 60000 / timeInterval;
    this.beatsPerMeasure = beatsPerMeasure;
    this.vMetronome = vMetronome;
    this.vBeats     = vMetronome.querySelectorAll('.beat');
    this.counter    = 1;
    this.stopFlag   = false;


    
    // Start method
    this.start = () => {
        // Set expected time. The moment in time we start plus whatever the time interval is
        this.expected = performance.now() + this.timeInterval;
        // Start the timeout and save the ID in a property, so we can cancel it later
        this.timeout = null;
        // the Stop method will take care of resetting the counter.
        this.stopFlag = false; // Set stopFlag to false
        // Execute the callback function
        this.updateMetronome(false);
        // Re watch the tutorial to understand this xD
        this.timeout = setTimeout(this.round, this.timeInterval);
    };



    // Stop method
    this.stop = () => {
        clearTimeout(this.timeout);
        this.counter = 1;
        this.stopFlag = true;
        this.tintClear();
    };



    // Method that takes care of running the callback function and adjusting the time interval
    this.round = () => {
        let drift = performance.now() - this.expected;
        this.updateMetronome();
        this.expected += this.timeInterval;
        this.timeout = setTimeout(this.round, this.timeInterval - drift)
    };



    this.updateMetronome = (boolean = true) => {
        this.tintBeat();
        // Click1 and update chords if first beat and stopFlag is False
        if (this.counter === 1 && !this.stopFlag) {
            if (boolean) updateChords();
            this.click1.play();
        } else {
            this.click2.play()     // If not, just play Click2
            this.stopFlag = false; // Reset stopFlag
        };
        // Advance counter and reset if > beatsPerMeasure
        this.counter++
        if (this.counter >= this.beatsPerMeasure + 1) this.counter = 1;
    };



    this.tintClear = () => {
        for (let i = 0; i < this.vBeats.length; i++) {
            this.vBeats[i].classList.remove('tint');
        };
    };



    this.tintBeat = () => {
        // Remove all tint first
        this.tintClear();
        // Then tint based on the counter value, only if beatsPerMeasure > 1
        if (this.beatsPerMeasure > 1 && this.counter <= this.vBeats.length) {
            for (let i = 0; i < this.counter; i++) {
                this.vBeats[i].classList.add('tint');
            };
        };
    };
};

export default Metronome;