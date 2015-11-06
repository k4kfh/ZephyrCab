gauge = new Object();

gauge.createAll = function() {
    gauge.speedometer.create()
    gauge.rpm.create()
}

gauge.styleToLeadLoco = function() {
    //make all the gauges accurate to the lead locomotive
}

gauge.speedometer = function(value) {

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ["MPH", value]
        ]);

        var options = {
            minorTicks: 10,
            max: 120,
            animation:{
                easing: "inAndOut",
                startup: true,
                duration: 400
            },
        };

        gauge.speedometer.chart.draw(data, options);
}

gauge.speedometer.create = function() {
    
    var value = 0

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ["MPH", value]
        ]);

        var options = {
            minorTicks: 10,
            max: 120,
            animation:{
                easing: "inAndOut",
                startup: true,
                duration: 400
            },
        };
        gauge.speedometer.chart = new google.visualization.Gauge(document.getElementById('speedometer'));

        gauge.speedometer.chart.draw(data, options);
}

gauge.rpm = function(value) {

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ["RPM", value]
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

        gauge.speedometer.chart.draw(data, options);
}

gauge.rpm.create = function() {
    
    var value = 0

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ["RPM", value]
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
        gauge.speedometer.chart = new google.visualization.Gauge(document.getElementById('RPM'));

        gauge.speedometer.chart.draw(data, options);
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