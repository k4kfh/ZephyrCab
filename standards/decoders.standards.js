//Constructors will be called with address, trainPosition arguments and should produce an object structured like this:

generic = {
    f: {
        headlight: {
            set: function(state) {},
            state: false,
        },
        bell: {
            set: function(state) {},
            state: false,
        },
        horn: {
            set: function(state) {},
            state: false,
        },
        compressor: {
            set: function(state) {},
            state: false,
        },
        airDump: {
            set: function(state) {},
            state: false,
        },
        dynBrakes: {
            set: function(state) {},
            state: false,
        },
        engine: {
            set: function(state) {
                //note that this function MUST set the following variable!
                if (state === true) {
                    train.all[trainPosition].prototype.engineRunning = 1;
                } else if (state === false) {
                    train.all[trainPosition].prototype.engineRunning = 0;
                }
            },
            state : false,
        },
        notch: {
            up: function(){
                //include any necessary error checking and such for your decoder, and be aware that use of setTimeout() may be necessary
                //Also note that you MUST increment this variable!
                var newNotch = (train.all[trainPosition].dcc.f.notch.state + 1);
            },
            down: function(){
                //include any necessary error checking and such for your decoder, and be aware that use of setTimeout() may be necessary
                //Also note that you MUST decrement this variable!
                var newNotch = (train.all[trainPosition].dcc.f.notch.state - 1);
            },
            state: 0, //This should reflect the current notching state of the sound decoder. You should increment this up or down 1 when your up() and down() functions finish, or sim.js's functions will be horribly confused and mess up your sounds.
        },
    },
    /*
    The speed code is NOT decoder specific. Please copy and paste this code:
    //SPEED SETTING
            this.speed = {};
            this.speed.state = 0;
            this.speed.set = function (speed) {
                train.all[trainPosition].throttle.speed.set(speed);
                train.all[trainPosition].dcc.speed.state = speed;
            };
            this.speed.setMPH = function (mph) {
                var speed = train.all[trainPosition].model.speed(mph);
                train.all[trainPosition].dcc.speed.set(speed);
            };
    */
    speed: { //DO NOT write this yourself. Copy and paste what's above!!
        state: 0,
        set: function(speed){},
        setMPH: function(mph){},
    }
}