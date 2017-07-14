/*
DECODERS

This file is user-editable. It contains all the decoder objects. For developers: these objects are constructors that are called any time a locomotive is added to the train with a corresponding decoder. The decoder functions all go in train.all[number].dcc . These decoder objects provide the necessary abstraction layer for the rest of ZephyrCab to have easy access to all the sound features, such as compressors, air dumps, bells, and horns. Decoder information is not ingested from manual user input anymore; it is automatically fetched from the  JMRI roster. The corresponding decoder object is looked up in this file using JMRI's naming convention. This means it is imperative that the names of your decoder objects be precisely correct.

If ZephyrCab can't find a decoder object for a locomotive in your roster, it will fall back to a "generic" entry which has no sound support and limited lighting/direction/speed support. DO NOT DELETE THE GENERIC ENTRY! **This feature is currently a work in progress as of June 2016. Learn more on the project's GitHub page.**
*/

//JSlint Crap
/*global
foo, WebSocket, $, Materialize, console, cfg, train, jmri, ui, air, sim
*/
/*jslint browser:true, white:true, plusplus:true*/

var decoders = {
    //product "LokSound Select"
    "ESU LokSound Blardy Blar Select": {
        //sound project "emd567"
        "LokSound Select Blardy Blar EMD 567" : function (address, trainPosition) {
            //ESU LokSound Select V4
            //decoder object for ESU official EMD 567 Sound project
            //By Hampton Morgan - k4kfh@github - Originally written in May 2015
            //evilgeniustech.com
            'use strict';
            train.all[trainPosition].throttle = new jmri.throttle(address, jmri.throttleName.generate()); //we use the train position as the throttle name for future lookup purposes

            //FUNCTIONS
            this.f = {};
            //light
            this.f.headlight = {};
            this.f.headlight.set = function (state) {
                train.all[trainPosition].throttle.f.set({"F0": state});
                train.all[trainPosition].dcc.f.headlight.state = state;
                console.log("DCC: Setting headlight to " + state + " on Train#" + trainPosition)
            };
            //bell
            this.f.bell = {};
            this.f.bell.set = function (state) {
              train.all[trainPosition].throttle.f.set({"F1": state});
              train.all[trainPosition].dcc.f.bell.state = state;
              console.log("DCC: Setting bell to " + state + " on Train#" + trainPosition)
            };
            this.f.bell.state = false;

            //horn
            this.f.horn = {};
            this.f.horn.set = function (state) {
              train.all[trainPosition].throttle.f.set({"F2": state});
              train.all[trainPosition].dcc.f.horn.state = state;
              console.log("DCC: Setting headlight to " + state + " on Train#" + trainPosition)
            };
            this.f.horn.state = false;

            //compressor
            this.f.compressor = {};
            this.f.compressor.set = function (state) {
                if (state != train.all[trainPosition].dcc.f.compressor.state) {
                    train.all[trainPosition].throttle.f.set({"F20":state});
                    train.all[trainPosition].dcc.f.compressor.state = state;
                    console.log("DCC: Setting compressor to " + state + " on Train#" + trainPosition)
                }
            };
            this.f.compressor.state = false;

            //air release
            this.f.airDump = {};
            this.f.airDump.set = function (state) {
                train.all[trainPosition].throttle.f.set({"F19":state});
                    console.log("DCC: Setting airDump to " + state + " on Train#" + trainPosition)
            };

            //dyn brake fans
            this.f.dynBrakes = {};
            this.f.dynBrakes.set = function (state) {

            };
            this.f.dynBrakes.state = false;

            //engine on/off
            this.f.engine = {};
            this.f.engine.set = function (state) {
                //This IF makes the entire function useless if you're out of fuel, or if the state argument is no different than the current actual state
                if (state !== train.all[trainPosition].dcc.f.engine.state) {
                    train.all[trainPosition].throttle.f.set({"F8":state});
                    train.all[trainPosition].dcc.f.engine.state = state;
                    console.log("DCC: Setting engine to " + state + " on Train#" + trainPosition)
                    //This code sets engineRunning to 0 or 1 depending on the state
                    if (state === true) {
                        train.all[trainPosition].prototype.engineRunning = 1;
                    }
                    else if (state === false) {
                        train.all[trainPosition].prototype.engineRunning = 0;
                    }
                }
                else {
                    //This code means that if you're out of fuel, regardless of what state you fed into this function it will turn the engine off.
                    train.all[trainPosition].throttle.f.set({"F8":false});
                    train.all[trainPosition].prototype.engineRunning = 0;
                    train.all[trainPosition].dcc.f.engine.state = false;
                }
            };
            this.f.engine.state = false;

            //notch sound stuff.
            this.f.notch = {
                up: function () {
                    //Notch up code
                    //This is inside an IF statement to make sure we don't try to notch OVER 8. If that happens, ESU decoders get confused.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state + 1);
                    if (newNotch <= 8) {
                        train.all[trainPosition].dcc.f.notch.state++; //THIS HAS TO RUN INSTANTLY OR SIM.JS IS STUPID
                        console.log("DCC: Increasing notch on Train#" + trainPosition)
                        setTimeout(function () {
                            train.all[trainPosition].throttle.f.set({"F9":true});
                        }, 500);
                        setTimeout(function () {
                            train.all[trainPosition].throttle.f.set({"F9":false});
                        }, 1750);
                    }
                },
                down: function () {
                    //Notch down code
                    //This is inside an IF statement to make sure we don't try to notch LESS THAN idle. If that happens, ESU decoders get confused.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state - 1);
                    if (newNotch >= 0) {
                        train.all[trainPosition].dcc.f.notch.state--; //THIS MUST RUN INSTANTLY OR SIM.JS DOES WEIRD STUFF
                        console.log("DCC: Decreasing notch on Train#" + trainPosition)
                        setTimeout(function () { train.all[trainPosition].throttle.f.set({"F10":true});}, 500);
                        setTimeout(function () { train.all[trainPosition].throttle.f.set({"F10":false});}, 1750);
                    }
                },
                state: 0 //This should reflect the current notching state of the sound decoder. You should increment this up or down 1 when your up() and down() functions finish, or sim.js's functions will be horribly confused and mess up your sounds.
            };


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
        }
    },

    //GENERIC FALLBACK SCRIPT - DO NOT REMOVE!!
    "generic":{
        "generic" : function (address, trainPosition) {
            'use strict';
            //GENERIC FALLBACK
            train.all[trainPosition].throttle = new jmri.throttle(address, jmri.throttleName.generate());

            //FUNCTIONS
            this.f = {};

            //light
            this.f.headlight = {};
            this.f.headlight.set = function (state) {
                train.all[trainPosition].throttle.f.set({"F0":state});
                train.all[trainPosition].dcc.f.headlight.state = state;
            };
            this.f.headlight.state = false;

            //bell
            this.f.bell = {};
            this.f.bell.set = function (state) {
                train.all[trainPosition].throttle.f.set({"F1":state});
                train.all[trainPosition].dcc.f.bell.state = state;
            };
            this.f.bell.state = false;

            //horn
            this.f.horn = {};
            this.f.horn.set = function (state) {
                train.all[trainPosition].throttle.f.set({"F2":state});
                train.all[trainPosition].dcc.f.horn.state = state;
            };
            this.f.horn.state = false;

            //compressor
            this.f.compressor = {};
            this.f.compressor.set = function (state) {
                //there's no compressor assumed on these generic mystery decoders
                train.all[trainPosition].dcc.f.compressor.state = state;
            };
            this.f.compressor.state = false;

            //air release
            this.f.airdump = {};
            this.f.airdump.set = function (state) {

            };
            this.f.airdump.state = false;

            //dyn brake fans
            this.f.dynbrakes = {};
            this.f.dynbrakes.set = function (state) {

            };
            this.f.dynbrakes.state = false;

            //engine on/off
            this.f.engine = {};
            this.f.engine.set = function (state) {
                //This function is almost exactly the same as the one in my ESU LokSound EMD 567 decoder constructor, the difference is this one never actually sends a DCC command (it's basically dummy function that the physics engine thinks is legit)

                //This IF makes the entire function useless if you're out of fuel.
                if (train.all[trainPosition].prototype.realtime.fuel.status !== 0){
                    train.all[trainPosition].dcc.f.engine.state = state;
                    //This code sets engineRunning to 0 or 1 depending on the state
                    if (state === true) {
                        train.all[trainPosition].prototype.engineRunning = 1;
                    }
                    else if (state === false) {
                        train.all[trainPosition].prototype.engineRunning = 0;
                    }
                }
                else {
                    //This code means that if you're out of fuel, regardless of what state you fed into this function it will turn the engine off.
                    train.all[trainPosition].prototype.engineRunning = 0;
                    train.all[trainPosition].dcc.f.engine.state = false;
                }
            };
            this.f.engine.state = false;

            //notch sound stuff.
            this.f.notch = {
                up : function () {
                    //Notch up code
                    //This is inside an IF statement to make sure we don't try to notch OVER 8.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state + 1);
                    if (newNotch <= 8) {
                         train.all[trainPosition].dcc.f.notch.state++; //THIS HAS TO RUN INSTANTLY OR SIM.JS IS STUPID
                    }
                },
                down : function () {
                    //Notch down code
                    //This is inside an IF statement to make sure we don't try to notch LESS THAN idle.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state - 1);
                    if (newNotch >= 0) {
                        train.all[trainPosition].dcc.f.notch.state--; //THIS MUST RUN INSTANTLY OR SIM.JS DOES WEIRD STUFF
                    }
                },
                state : 0 //This should reflect the current notching state of the sound decoder. You should increment this up or down 1 when your up() and down() functions finish, or sim.js's functions will be horribly confused and mess up your sounds.
            };


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


            //SPEED SETTING
            this.speed = {};
            this.speed.state = 0;
            this.speed.set = function (speed) {
                train[trainPosition].throttle.speed.set(speed);
                train[trainPosition].dcc.speed.state = speed;
            };
            this.speed.setMPH = function (mph) {
                var speed = train[trainPosition].model.speed(mph);
                train[trainPosition].dcc.speed.set(speed);
            };
        }
    }
};
