/*
AIR UTILITIES

These are specifically designed to make working with air systems easier. They provide an easy abstraction layer for all the math behind pneumatic simulations.
*/

var air = {
    reservoir : {
        main : {
            /*
            updatePSI();
            
            Takes one argument:
            locomotive : the position in the train of the loco you want to update (for example, if it was first it would be 0)
            
            When called, it will look at the various air measurements in .prototype.realtime and calculate the pressure of the main reservoir. It updates both psi abs and psig measurements with the calculation, no need to update them yourself. You will, however, need to update the gauge IF you're in the current loco.
            
            Returns:
            nothing. nothing at all. nice and simple.
            */
            updatePSI : function (locomotive) {
                var capacity = train.all[locomotive].prototype.air.reservoir.main.capacity;
                var currentAtmAirVolume = train.all[locomotive].prototype.air.reservoir.main.currentAtmAirVolume;
                
                //atmosphere air is at 14.696psi, so:
                var psiAbs = (currentAtmAirVolume / capacity) + 13.696; //this means that if currentAtmAirVolume and capacity are equal, then the psi will be 14.696psi (1atm)
                var psig = (currentAtmAirVolume / capacity) - 1; //this is psig, which is 0 if capacity and currentAtmAirVolume are equal. It is the difference between tank pressure and ambient (atmosphere) pressure, and is the value displayed on the dash gauge.
                
                //this is a safeguard to make sure we don't accidentally turn the reservoir into a vacuum
                if (psig < 0) {
                    psiAbs = 14.696;
                    psig = 0;
                }
                
                //now we actually set the train objects to the newly calculated values
                train.all[locomotive].prototype.air.reservoir.main.psi.g = psig;
                train.all[locomotive].prototype.air.reservoir.main.psi.abs = psiAbs;
                //and then we update the gauge
                gauge.air.reservoir.main(psig)
            },
            
            take : function(cfeet, atPressure, locomotive) {
                log.air("Taking " + cfeet + "@" + atPressure + "PSI from Main Reservoir on train.all[" + locomotive + "]");
                //Define some shorthand variables
                var mainReservoir = {};
                mainReservoir.psi = train.all[locomotive].prototype.reservoir.main.psi.g;
                mainReservoir.cap = train.all[locomotive].prototype.air.reservoir.main.capacity;
                mainReservoir.atmAirVol = train.all[locomotive].prototype.reservoir.main.currentAtmAirVolume;
                
                //using Boyle's law, figure out how much cubic feet @ the reservoir pressure is equal to cfeet @ atPressure
                var cfeetToTake = (cfeet * atPressure) / mainReservoir.psi;
                
                log.air("cfeetToTake = " + cfeetToTake);
                
                //subtract the amount of air (in cubic feet) we determined
                mainReservoir.newVol = mainReservoir.atmAirVol - cfeetToTake;
                
                log.air("New Main Reservoir Volume : " + mainReservoir.newVol);
                
                train.all[locomotive].prototype.reservoir.main.currentAtmAirVolume = mainReservoir.newVol;
                
                //update the gauge to reflect our changes
                if (locomotive == cab.current) {
                    gauge.air.reservoir.main(train.all[locomotive].prototype.reservoir.main.psi.g);
                }
                
                //Return true or false based on whether or not it was able to do it
                if (mainReservoir.psi == 0) {
                    return false;
                }
                else {
                    return true;
                }
            },
            
            //returns true or false whether an air device can operate with the current reservoir pressure
            pressureCheck : function(opsPressure, locomotive) {
                var resPressure = train.all[locomotive].prototype.reservoir.main.psi.g;
                var result = (resPressure >= opsPressure);
                if (result == false) {Materialize.toast("Not enough air pressure!", 2000);}
                return result;
            }
        }
    }
};
