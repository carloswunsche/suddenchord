  /////////////////////
 /// Timer module ////
/////////////////////

function Timer(callback, timeInterval = 120, beatsPerMeasure) {
    this.click1 = new Howl({src: ['click01.ogg']});
    this.click2 = new Howl({src: ['click02.ogg']});
    this.timeInterval = 60000 / timeInterval;

    // Start method
    this.start = () => {
        console.log('Timer started');
        // Set expected time. The moment in time we start plus whatever the time interval is
        this.expected = performance.now() + this.timeInterval;
        // Start the timeout and save the ID in a property, so we can cancel it later
        this.timeout = null;
        // Execute the callback function
        callback();
        this.click1.play()
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
        callback();
        this.click1.play()
        this.expected += this.timeInterval;
        this.timeout = setTimeout(this.round, this.timeInterval - drift)
    };
};

export default Timer;