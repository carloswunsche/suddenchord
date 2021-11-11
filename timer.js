  /////////////////////
 /// Timer module ////
/////////////////////

function Timer(callback, timeInterval = 120, beatsPerMeasure) {
    this.click1 = new Howl({src: ['click01.ogg']});
    this.click2 = new Howl({src: ['click02.ogg']});
    this.timeInterval = 60000 / timeInterval;
    this.beatsPerMeasure = beatsPerMeasure;
    this.counter = 1;

    // Start method
    this.start = () => {
        console.log('Timer started');
        // Set expected time. The moment in time we start plus whatever the time interval is
        this.expected = performance.now() + this.timeInterval;
        // Start the timeout and save the ID in a property, so we can cancel it later
        this.timeout = null;
        // Execute the callback function
        this.callbackAndClick();
        // Re watch the tutorial to understand this xD
        this.timeout = setTimeout(this.round, this.timeInterval);
    };

    // Stop method
    this.stop = () => {
        console.log('Timer stopped');
        clearTimeout(this.timeout);
    };

    // Method that takes care of running the callback function and adjusting the time interval
    this.round = () => {
        let drift = performance.now() - this.expected;
        // //Check if drift is greater than timeInterval and run errorCallback (if exists)
        // if (drift > this.timeInterval) {
        //     if (options.errorCallback) {
        //         errorCallback();
        //     };
        // };
        this.callbackAndClick();
        // Recalculate timeout
        this.expected += this.timeInterval;
        this.timeout = setTimeout(this.round, this.timeInterval - drift)
    };

    this.callbackAndClick = () => {
        // Callback if beat 1
        if (this.counter === 1) {
            callback();
            this.click1.play()
        };
        // If not, just play click2
        if (this.counter !== 1) this.click2.play()
        //Advance counter and reset if === beatsPerMeasure
        this.counter++
        if (this.counter === this.beatsPerMeasure + 1) this.counter = 1;
    };
};

export default Timer;