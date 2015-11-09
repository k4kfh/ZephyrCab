decoders = {
    //manufacturer ESU
    esu:{
        //product "LokSound Select"
        loksoundSelect:{
            //sound project "emd567"
            emd567:function(address, trainPosition) {
                //ESU LokSound Select V4
                //decoder object for ESU official EMD 567 Sound project
                //By Hampton Morgan - k4kfh@github - May 2015
                //evilgeniustech.com
                
                this.throttle = new jmri.throttle(address, trainPosition) //we use the train position as the throttle name for future lookup purposes
                
                //FUNCTIONS
                this.f = new Object();
                
                //bell
                this.f.bell = new Object();
                this.f.bell.set = function(state) {
                    
                }
                this.f.bell.state = false;
                
                //horn
                this.f.horn = new Object();
                this.f.horn.set = function(state) {
                    
                }
                this.f.horn.state = false;
                
                //compressor
                this.f.compressor = new Object();
                this.f.compressor.set = function(state) {
                    
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
                this.speed.state = false;
                this.speed.set = function(speed) {
                    
                }
                
                
            }
        }
    }
}

