gauge = new Object();

gauge.createAll = function() {
    if (train.all[0] != undefined) {
        gauge.speedometer.create()
        gauge.rpm.create()
    }
}

gauge.speedometer = function(value) {
    //This is just a wrapper so we can add additional functions that trigger if we need to
    gauge.speedometer.object.setValue(value)
}

gauge.speedometer.create = function() {
    //Pulls options from lead locomotive's prototype.gauges object
    var options = train.all[0].prototype.gauges.speedometer;
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
    var options = train.all[0].prototype.gauges.rpm;
    options.renderTo = "gauge.rpm";
    gauge.rpm.object = new Gauge(options);
    gauge.rpm.object.draw();
}

gauge.ammeter = function(value) {

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ["Amps", value]
        ]);

        var options = {
            minorTicks: 10,
            max: 900,
            animation:{
                easing: "inAndOut",
                startup: true,
                duration: 400
            },
        };

        gauge.speedometer.chart.draw(data, options);
}

gauge.ammeter.create = function() {
    
    var value = 0

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ["Amps", value]
        ]);

        var options = {
            minorTicks: 10,
            max: 800,
            animation:{
                easing: "inAndOut",
                startup: true,
                duration: 400
            },
        };
        gauge.speedometer.chart = new google.visualization.Gauge(document.getElementById('ammeter'));

        gauge.speedometer.chart.draw(data, options);
}