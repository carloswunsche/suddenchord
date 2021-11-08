// Timer module
function Timer(callback, timeInterval, options) {
    this.timeInterval = timeInterval;

    this.start = () => {
        console.log('Timer started');
        // Set expected time. The moment in time we start plus whatever the time interval is
        this.expected = Date.now() + this.timeInterval;
        // Start the timeout and save the ID in a property, so we can cancel it later
        this.timeout = null;

        if (options.immediate) {
            callback();
        }

        this.timeout = setTimeout(this.round, this.timeInterval);
    };

    this.stop = () => {
        console.log('Timer stopped');
        clearTimeout(this.timeout);
    };

    // Method that takes care of running our callback and adjusting the time interval
    this.round = () => {
        let drift = Date.now() - this.expected;
        //Check if drift is greater than timeInterval and run errorCallback (if exists)
        if (drift > this.timeInterval) {
            if (options.errorCallback) {
                errorCallback();
            };
        };
        callback();
        this.expected += this.timeInterval;
        this.timeout = setTimeout(this.round, this.timeInterval - drift)
    };

};

export default Timer;