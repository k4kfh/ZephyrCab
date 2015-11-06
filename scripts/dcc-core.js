//This script contains the lowest level DCC functions. Things like setting a speed for a given address, and toggling functions on and off go in this file.

var dcc = new Object(); //All the functions in this file belong to the dcc object

dcc.function(throttle, fnumber, state) {
    //This function should set a function (1-28) to a given state (true or false)
    
    //First, check to be sure it is a valid function number.
    if (fnumber >= 0) {
        if (fnumber <= 28) {
            //By now, we are sure that the function number argument is in the acceptable range.
            sendcmdLoco('{"type":"throttle","data":{"address":' + locoAddress + ', "F2":true, "throttle":"' + throttleName + '"}}');
            }
        else {
            //TODO - Error toast
        }
    }
    else {
        //TODO - error toast
    }
}