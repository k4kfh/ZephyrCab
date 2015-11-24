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
            train.all[trainPosition].throttle = new jmri.throttle(address, trainPosition) //we use the train position as the throttle name for future lookup purposes
            
            //FUNCTIONS
            this.f = new Object();
            //light
            this.f.headlight = new Object();
            this.f.headlight.set = function(state) {
                train.all[trainPosition].throttle.f.set(0, state);
                train.all[trainPosition].dcc.f.headlight.state = state;
            }
            //bell
            this.f.bell = new Object();
            this.f.bell.set = function(state) {
                train.all[trainPosition].throttle.f.set(1, state)
                train.all[trainPosition].dcc.f.bell.state = state;
            }
            this.f.bell.state = false;
                
            //horn
            this.f.horn = new Object();
            this.f.horn.set = function(state) {
                train.all[trainPosition].throttle.f.set(2, state)
                train.all[trainPosition].dcc.f.horn.state = state;
            }
            this.f.horn.state = false;
                
            //compressor
            this.f.compressor = new Object();
            this.f.compressor.set = function(state) {
                train.all[trainPosition].throttle.f.set(20, state)
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
                train.all[trainPosition].throttle.f.set(8, state);
                train.all[trainPosition].dcc.f.engine.state = state;
            }
            this.f.engine.state = false;
                
            //notch sound stuff.
            this.f.notch = {
                up : function() {
                    //Notch up code
                    //This is inside an IF statement to make sure we don't try to notch OVER 8. If that happens, ESU decoders get confused.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state + 1)
                    if (newNotch <= 8) {
                        setTimeout(function() { train.all[trainPosition].throttle.f.set(9, true)}, 500);
                        setTimeout(function() { train.all[trainPosition].throttle.f.set(9, false); train.all[trainPosition].dcc.f.notch.state++;}, 1750)
                    }
                },
                down : function() {
                    //Notch down code
                    //This is inside an IF statement to make sure we don't try to notch LESS THAN idle. If that happens, ESU decoders get confused.
                    var newNotch = (train.all[trainPosition].dcc.f.notch.state - 1)
                    if (newNotch >= 0) {
                        setTimeout(function() { train.all[trainPosition].throttle.f.set(10, true)}, 500);
                        setTimeout(function() { train.all[trainPosition].throttle.f.set(10, false); train.all[trainPosition].dcc.f.notch.state--;}, 1750)
                    }
                },
                state : 0,
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
    
    //TESTING ONLY
    "E-Z Command decoders":{
        //sound project "emd567"
        "1 function decoder (36-551)" : function(address, trainPosition) {
            //ESU LokSound Select V4
            //decoder object for ESU official EMD 567 Sound project
            //By Hampton Morgan - k4kfh@github - May 2015
            //evilgeniustech.com
            train[trainPosition].throttle = new jmri.throttle(address, trainPosition) //we use the train position as the throttle name for future lookup purposes
            
            //FUNCTIONS
            this.f = new Object();
            //bell
            this.f.bell = new Object();
            this.f.bell.set = function(state) {
                train[trainPosition].throttle.f.set(1, state)
                train[trainPosition].dcc.f.bell.state = state;
            }
            this.f.bell.state = false;
                
            //horn
            this.f.horn = new Object();
            this.f.horn.set = function(state) {
                train[trainPosition].throttle.f.set(2, state)
                train[trainPosition].dcc.f.horn.state = state;
            }
            this.f.horn.state = false;
                
            //compressor
            this.f.compressor = new Object();
            this.f.compressor.set = function(state) {
                train[trainPosition].throttle.f.set(20, state)
                train[trainPosition].dcc.f.compressor.state = state;
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
                train[trainPosition].throttle.f.set(8, state)
                train[trainPosition].dcc.f.engine.state = state;
            }
            this.f.engine.state = false;
                
            //notch up
            this.f.notchup = new Object();
            this.f.notchup.set = function(state) {
                    
            }
            this.f.notchup.state = false;
                
            //notch down
            this.f.notchdown = new Object();
            this.f.notchdown.set = function(state) {
                    
            }
            this.f.notchdown.state = false;
                
            
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

