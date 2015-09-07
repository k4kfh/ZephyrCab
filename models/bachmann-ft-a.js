//This file includes any model specific parameters. Things like mph to speed% converter functions go here. It's simple enough to edit.

function locoSpeedCrunch(mph) {
    var newSpeed = (1.51 * mph)
    
    //this function is what's responsible for converting the physics engine speed, in miles/hour, to a percentage your loco will accurately represent. Use a speedometer tool or eyeball it, just get it where this returns the speed percentage for the given mph rate.
    
    return newSpeed
}



//this is the function that lets the program know this script loaded without issues
//every model.js should include this
//it should always be at the bottom, not the top!

scriptLoaded("modeljs")