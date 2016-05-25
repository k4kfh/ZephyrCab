//This file uses JMRI's decoderFamily and decoderModel variables to categorize and organize the different decoder constructors. Read more @ github.com
decoders = {
    //product "LokSound Select"
    "ESU LokSound Select":{
        //sound project "emd567"
        "LokSound Select EMD 567" : function(address, trainPosition) {
            //ESU LokSound Select V4
            //decoder object for ESU official EMD 567 Sound project
            //By Hampton Morgan - k4kfh@github - May 2015
            //evilgeniustech.com
            train.all[trainPosition].throttle = new jmri.throttle(address, jmri.throttleName.generate()) //we use the train position as the throttle name for future lookup purposes
            
            //FUNCTIONS
            this.f = new Object();
            //light
            this.f.headlight = new Object();
            this.f.headlight.set = function(state) {
                train.all[trainPosition].throttle.f.set({"F0":state});
                train.all[trainPosition].dcc.f.headlight.state = state;
            }
            //bell
            this.f.bell = new Object();
            this.f.bell.set = function(state) {
                var opsPressure = train.all[trainPosition].prototype.air.device.bell.operatingPressure
                var allowed = air.reservoir.main.pressureCheck(opsPressure, trainPosition)
                if (allowed == true) {
                    train.all[trainPosition].throttle.f.set({"F1":state})
                    train.all[trainPosition].dcc.f.bell.state = state;
                }
                else {
                    console.log("NOT ENOUGH PRESSURE")
                }
            }
            this.f.bell.state = false;
                
            //horn
            this.f.horn = new Object();
            this.f.horn.set = function(state) {
                var opsPressure = train.all[trainPosition].prototype.air.device.horn.operatingPressure
                var allowed = air.reservoir.main.pressureCheck(opsPressure, trainPosition)
                if (allowed == true) {
                    train.all[trainPosition].throttle.f.set({"F2":state})
                    train.all[trainPosition].dcc.f.horn.state = state;
                    sim.f.air.horn(trainPosition, state);
                }
                else {
                    console.log("CANT DO IT, NOT ENOUGH PRESSURE")
                }
            }
            this.f.horn.state = false;
                
            //compressor
            this.f.compressor = new Object();
            this.f.compressor.set = function(state) {
                train.all[trainPosition].throttle.f.set({"F20":state})
                train.all[trainPosition].dcc.f.compressor.state = state;
            }
            this.f.compressor.state = false;
                
            //air release
            this.f.airDump = new Object();
            this.f.airDump.set = function(state) {
                var possible = (train.all[trainPosition].prototype.realtime.air.reservoir.main.psi.g != 0)
                if (possible == true) {
                    train.all[trainPosition].throttle.f.set({"F19":state})
                }
                else if ((possible == false) && (state == false)) {
                    train.all[trainPosition].throttle.f.set({"F19":state})
                }
            }
                
            //dyn brake fans
            this.f.dynbrakes = new Object();
            this.f.dynbrakes.set = function(state) {
                    
                }
            this.f.dynbrakes.state = false;
                
            //engine on/off
            this.f.engine = new Object();
            this.f.engine.set = function(state) {
                //This IF makes the entire function useless if you're out of fuel.
                if (train.all[trainPosition].prototype.realtime.fuel.status != 0){
                    train.all[trainPosition].throttle.f.set({"F8":state});
                    train.all[trainPosition].dcc.f.engine.state = state;
                    //This code sets engineRunning to 0 or 1 depending on the state
                    if (state == true) {
                        train.all[trainPosition].prototype.engineRunning = 1;
                    }
                    else if (state == false) {
                        train.all[trainPosition].prototype.engineRunning = 0;
                    }
                }
                else {
                    //This code means that if you're out of fuel, regardless of what state you fed into this function it will turn the engine off.
                    train.all[trainPosition].throttle.f.set(8, false);
                    train.all[trainPosition].prototype.engineRunning = 0;
                    train.all[trainPosition].dcc.f.engine.state = false;
                }
            }
            this.f.engine.state = false;
                
            //notch sound stuff.
            this.f.notch = {
                up : function() {
                    //Notch up code
                    //This is inside an IF statement to make sure we don't try to notch OVER 8. If that happens, ESU decoders get confused.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state + 1)
                    if (newNotch <= 8) {
                         train.all[trainPosition].dcc.f.notch.state++; //THIS HAS TO RUN INSTANTLY OR SIM.JS IS STUPID
                        setTimeout(function() { train.all[trainPosition].throttle.f.set({"F9":true})}, 500);
                        setTimeout(function() { train.all[trainPosition].throttle.f.set({"F9":false});}, 1750)
                    }
                },
                down : function() {
                    //Notch down code
                    //This is inside an IF statement to make sure we don't try to notch LESS THAN idle. If that happens, ESU decoders get confused.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state - 1)
                    if (newNotch >= 0) {
                        train.all[trainPosition].dcc.f.notch.state--; //THIS MUST RUN INSTANTLY OR SIM.JS DOES WEIRD STUFF
                        setTimeout(function() { train.all[trainPosition].throttle.f.set({"F10":true})}, 500);
                        setTimeout(function() { train.all[trainPosition].throttle.f.set({"F10":true});}, 1750)
                    }
                },
                state : 0, //This should reflect the current notching state of the sound decoder. You should increment this up or down 1 when your up() and down() functions finish, or sim.js's functions will be horribly confused and mess up your sounds.
            }
                
            
            //SPEED SETTING
            this.speed = new Object();
            this.speed.state = 0;
            this.speed.set = function(speed) {
                train.all[trainPosition].throttle.speed.set(speed)
                train.all[trainPosition].dcc.speed.state = speed;
            }
            this.speed.setMPH = function(mph) {
                var speed = train.all[trainPosition].model.speed(mph)
                train.all[trainPosition.dcc.speed.set(speed)]
            }
                
                
        }
    },
    
    //GENERIC FALLBACK SCRIPT - DO NOT REMOVE!!
    "generic":{
        "generic" : function(address, trainPosition) {
            //GENERIC FALLBACK
            train.all[trainPosition].throttle = new jmri.throttle(address, jmri.throttleName.generate())
            
            //FUNCTIONS
            this.f = new Object();
            
            //light
            this.f.headlight = new Object();
            this.f.headlight.set = function(state) {
                train.all[trainPosition].throttle.f.set({"F0":state})
                train.all[trainPosition].dcc.f.headlight.state = state;
            }
            this.f.headlight.state = false;
            
            //bell
            this.f.bell = new Object();
            this.f.bell.set = function(state) {
                train.all[trainPosition].throttle.f.set({"F1":state})
                train.all[trainPosition].dcc.f.bell.state = state;
            }
            this.f.bell.state = false;
                
            //horn
            this.f.horn = new Object();
            this.f.horn.set = function(state) {
                train.all[trainPosition].throttle.f.set({"F2":state})
                train.all[trainPosition].dcc.f.horn.state = state;
            }
            this.f.horn.state = false;
                
            //compressor
            this.f.compressor = new Object();
            this.f.compressor.set = function(state) {
                //there's no compressor assumed on these generic mystery decoders
                train.all[trainPosition].dcc.f.compressor.state = state;
            }
            this.f.compressor.state = false;
                
            //air release
            this.f.airdump = new Object();
            this.f.airdump.set = function(state) {
                    
            }
            this.f.airdump.state = false;
                
            //dyn brake fans
            this.f.dynbrakes = new Object();
            this.f.dynbrakes.set = function(state) {
                    
                }
            this.f.dynbrakes.state = false;
                
            //engine on/off
            this.f.engine = new Object();
            this.f.engine.set = function(state) {
                //This function is almost exactly the same as the one in my ESU LokSound EMD 567 decoder constructor, the difference is this one never actually sends a DCC command (it's basically dummy function that the physics engine thinks is legit)
                
                //This IF makes the entire function useless if you're out of fuel.
                if (train.all[trainPosition].prototype.realtime.fuel.status != 0){
                    train.all[trainPosition].dcc.f.engine.state = state;
                    //This code sets engineRunning to 0 or 1 depending on the state
                    if (state == true) {
                        train.all[trainPosition].prototype.engineRunning = 1;
                    }
                    else if (state == false) {
                        train.all[trainPosition].prototype.engineRunning = 0;
                    }
                }
                else {
                    //This code means that if you're out of fuel, regardless of what state you fed into this function it will turn the engine off.
                    train.all[trainPosition].prototype.engineRunning = 0;
                    train.all[trainPosition].dcc.f.engine.state = false;
                }
            }
            this.f.engine.state = false;
                
            //notch sound stuff.
            this.f.notch = {
                up : function() {
                    //Notch up code
                    //This is inside an IF statement to make sure we don't try to notch OVER 8.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state + 1)
                    if (newNotch <= 8) {
                         train.all[trainPosition].dcc.f.notch.state++; //THIS HAS TO RUN INSTANTLY OR SIM.JS IS STUPID
                    }
                },
                down : function() {
                    //Notch down code
                    //This is inside an IF statement to make sure we don't try to notch LESS THAN idle.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state - 1)
                    if (newNotch >= 0) {
                        train.all[trainPosition].dcc.f.notch.state--; //THIS MUST RUN INSTANTLY OR SIM.JS DOES WEIRD STUFF
                    }
                },
                state : 0, //This should reflect the current notching state of the sound decoder. You should increment this up or down 1 when your up() and down() functions finish, or sim.js's functions will be horribly confused and mess up your sounds.
            }
                
            
            //SPEED SETTING
            this.speed = new Object();
            this.speed.state = 0;
            this.speed.set = function(speed) {
                train.all[trainPosition].throttle.speed.set(speed)
                train.all[trainPosition].dcc.speed.state = speed;
            }
            this.speed.setMPH = function(mph) {
                var speed = train.all[trainPosition].model.speed(mph)
                train.all[trainPosition.dcc.speed.set(speed)]
            }
                
            
            //SPEED SETTING
            this.speed = new Object();
            this.speed.state = 0;
            this.speed.set = function(speed) {
                train[trainPosition].throttle.speed.set(speed)
                train[trainPosition].dcc.speed.state = speed;
            }
            this.speed.setMPH = function(mph) {
                var speed = train[trainPosition].model.speed(mph)
                train[trainPosition.dcc.speed.set(speed)]
            }
                
                
        }
    },
}

