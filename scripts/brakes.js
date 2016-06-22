/*
This file is to keep the new braking code separate, at least until it's stable enough to move over into sim.js
*/

brake = {
    eqReservoir : {
        psi:{
            abs:14.6959, //this is set to 1atm of pressure just because nobody likes a vacuum.
            g:0,
        },
    }, //this will represent the "current" train brake line pressure. Since all the cars may have different pressures at times due to the air pressure drop, it's necessary to have a global "master" value.
    feedValve : {
        state : cfg.brakes.defaultFeedValveSetting, //this makes it easy for the user to set a default.
        set : function(pressure) {
            //this is really only a function on the off chance that additional functionality is needed. It seems pointless now, but I don't want to have to rewrite 1000 lines because in 4 months I need one thing to happen when the feed valve is set.
            brake.feedValve.state = pressure;
        }
    },
    autoBrakeValve : {
        
    },
    cycle : function(trainPosition) {
        
    }
}
