//this file is purely to cut down on the "OH NO THIS VARIABLE ISNT DEFINED!" errors. there are arrangements in everything to alert the user when the variable it needs == undefined, but it has to just have an undefined value. This takes care of that
var locoAddress //locomotive's DCC #
var throttleName //name given to throttle requested
var reverser  //direction locomotive should be in (neutral, forward, or reverse),
var JMRIhellomsg  //initial websockets hello message
var layoutRailroadName //the name of the railroad as set in JMRI prefs, only checked on initial connect
var notch //this is the notch the loco is currently in. DO NOT try to adjust the notch with this, it's only for reading. if you want to adjust the notch use the function