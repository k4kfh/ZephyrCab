/*
CAB GAUGES

This file contains all the code for manipulating the cab gauges. These functions work with k4kfh/canv-gauge (my personal fork of the original canv-gauge, tailored for this project). They're called by other scripts, such as ui.js and sim.js, to keep the gauges up to date while providing an abstraction layer between the rest of the system and canv-gauge.
*/

gauge = new Object();

gauge.createAll = function() {
    if (train.all[ui.cab.currentLoco] != undefined) {
        gauge.speedometer.create();
        gauge.rpm.create();
        gauge.fuel.create();
        gauge.air.reservoir.main.create();
    }
}

gauge.speedometer = function(value) {
    //This is just a wrapper so we can add additional functions that trigger if we need to
    gauge.speedometer.object.setValue(value)
}

gauge.speedometer.create = function() {
    //Pulls options from lead locomotive's prototype.gauges object
    var options = train.all[ui.cab.currentLoco].prototype.gauges.speedometer;
    options.renderTo = "gauge.speedometer";
    gauge.speedometer.object = new Gauge(options);
    gauge.speedometer.object.draw();
}

gauge.rpm = function(value) {
    var oldValue = gauge.rpm.object.getValue()
    //This is just a wrapper so we can add additional functions that trigger if we need to.
    
    //This if statement saves resources by not updating the gauge if the value hasn't actually changed. We need this since the physics engine updates this function with a new value every 100ms.
    if (oldValue != value) {
        gauge.rpm.object.setValue(value)
    }
}

gauge.rpm.create = function() {
    //Pulls options from lead locomotive's prototype.gauges object
    var options = train.all[ui.cab.currentLoco].prototype.gauges.rpm;
    options.renderTo = "gauge.rpm";
    gauge.rpm.object = new Gauge(options);
    gauge.rpm.object.draw();
}

gauge.fuel= function(value) {
    var oldValue = gauge.rpm.object.getValue()
    //This is just a wrapper so we can add additional functions that trigger if we need to.
    
    //This if statement saves resources by not updating the gauge if the value hasn't actually changed. We need this since the physics engine updates this function with a new value every 100ms.
    if (oldValue != value) {
        gauge.fuel.object.setValue(value)
    }
}

gauge.fuel.create = function() {
    //Pulls options from lead locomotive's prototype.gauges object
    var options = train.all[ui.cab.currentLoco].prototype.gauges.fuel;
    options.renderTo = "gauge.fuel";
    gauge.fuel.object = new Gauge(options);
    gauge.fuel.object.draw();
}

gauge.air = {
    reservoir : {
        main : {},
    },
}

gauge.air.reservoir.main = function(value) {
    var oldValue = gauge.air.reservoir.main.object.getValue()
    //This is just a wrapper so we can add additional functions that trigger if we need to.
    
    //This if statement saves resources by not updating the gauge if the value hasn't actually changed. We need this since the physics engine updates this function with a new value every 100ms.
    //console.log("Old Value = " + oldValue + ", New Value = " + value)
    if (oldValue != value) {
        gauge.air.reservoir.main.object.setValue(value)
    }
}

gauge.air.reservoir.main.create = function() {
    //Pulls options from lead locomotive's prototype.gauges object
    var options = train.all[ui.cab.currentLoco].prototype.gauges.air.reservoir.main;
    options.renderTo = "gauge.air.reservoir.main";
    gauge.air.reservoir.main.object = new Gauge(options);
    gauge.air.reservoir.main.object.draw();
}


//Indicator Lights - All these are either on or off, they have no specific value like the gauges.

light = new Object();

light.compressor = function(state) {
    if (state == true) {
        document.getElementById("ui.cab.compressor").className = "btn-flat white-text red"
    }
    else if (state == false) {
        document.getElementById("ui.cab.compressor").className = "btn-flat grey lighten-3"
    }
}

light.wheelSlip = function(state) {
    if (state == true) {
        document.getElementById("ui.cab.wheelSlip").className = "btn-flat white-text red"
    }
    else if (state == false) {
        document.getElementById("ui.cab.wheelSlip").className = "btn-flat grey lighten-3"
    }
}
