bundles.locomotives = {
  "JMRI Locomotive Name":
  {
    type: "locomotive",
    model: //all functions dealing with virtual-->model physics
    {
      speed:function(mph){} //converts speed in mph to JMRI speed %
    },
    prototype:
    {
      "builder" : "EMD",
      "name" : "F7-A",
      "type" : "locomotive", //TODO:REMOVE; REDUNDANT
      "weight" : 250000, //Weight of the locomotive in lbs
      "maxHP" : 1500, //Horsepower of the locomotive
      "notchRPM" : [300, 362, 425, 487, 550, 613, 675, 738, 800], //TODO: consolodate these two into one object
      "notchMaxSpeeds" : [null, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60],
      "engineRunning": 0, //0 or 1 - 1 is on, 0 is off

      fuel :
      {
          usage : [3.5, 6.5, 14.5, 23.4, 33.3, 45.7, 59.6, 75.3, 93.1], //array in gal/hr, by notch
          capacity : 1200, //fuel tank in GAL
      },

      calc : //this contains functions left open to developers to implement for a given locomotive
      {
        te : function(speed, trainPosition) {}, //returns tractive effort in lbs
        maxSpeed : function(trainPosition){}, //sets exceedingMaxSpeed (a coefficient to nullify TE) to 0 if we're exceeding traction motor's speed capabilities
      },

      air : //currently just holds static information about air equipment
      {
          reservoir :
          {
              main :
              {
                  capacity : 46.7882, //capacity of the tank in cubic feet
                  leakRate : 0, //leak rate in cubic feet per 100ms
              },
          },
          compressor : {
              limits : {
                  lower : 130, //This is the point at which the compressor will turn back on and fill up the air reservoir (psi)
                  upper : 140, //This is the point at which the compressor will turn off (psi)
              },
              flowrate : 0.28, //This is cfm/rpm, derived from "255cfm @ 900rpm for an SD45" according to Mr. Al Krug
              needsEngine : true, //TODO: remove for now; don't let the perfect spoil the good?

          },
          device : //TODO: maybe remove completely to make things simpler?
          {
              horn : {
                  cfm : 70, //air consumption rate in cfm
                  usagePerMs : 0.001167, //usage in cubic feet, per millisecond (should be an absurdly small number)
                  operatingPressure : 100, //this horn runs at 100psi
              },
              bell : { //TODO: remove from sim and from here because it's negligible
                  cfm : 0, //temporary until I get actual numbers
                  usagePerMs : 0, //^^^
                  operatingPressure : 10, //mental approximation courtesy of Bruce Kingsley
              }
          },
      },

      "realtime" : { //TODO: remove completely and consolidate redundant objects?
          netForce: 0, //defined to make it work later
          speed : 0, //This is defined just to be safe.
          rollingResistance : 0, //this is pretty much a constant but we keep it here just cause
          exceedingMaxSpeed : 1, //This is a boolean stored as a number by .prototype.calc.maxSpeed . If the locomotive has reached its max speed, this becomes zero to nullify the tractive effort. If not, it remains 1.
          horsepower : 0, //This is the OUTPUT HP
          "grade" : 0, //IMPORTANT : This can be set to any grade percentage, but it should be as a percent not as a decimal. 1 for a 1% grade, NOT 0.01!
          fuel : {
              status : 1200, //You should set this to the max fuel capacity, or you'll be starting off with a non-full tank
              notifiedOfEmptyTank : false,
          },
          air : { //TODO: consolidate into main "air" object
              compressor : {
                  calc : function(trainPosition) { //return compressor CFM
                      /*
                      This function should calculate and set the flow rate in CFM. You can find out any prototype property since we gave it the trainPosition. You should NOT multiply this calculation by running or engineRunning; sim.js will do that!
                      In an F7, the compressor is driven directly by the prime mover, so this calculation will look at RPM and go from there.
                      */
                      var rpm = train.all[trainPosition].prototype.realtime.rpm
                      var cfm = rpm * 0.283; //This is a figure that I got from "255cu ft/min @ 900rpm" from Al Krug.

                      return cfm;
                  },
                  flowrate : {}, //this subobject will end up containing flow rates in a few different units
                  running : 0, //This works a lot like prototype.engineRunning;
              },
              reservoir : {
                  //Realtime data about the main reservoir is stored here
                  main : {
                      atmAirVolume: 6316.307, //should be set to capacity * 135 (because that will make the reservoir start out at 135psi)
                      psi : {
                          g : 0, //gauge psi, 0 means 1atm of pressure
                          abs : 14.696, //absolute psi
                      },
                      dump : false, //TODO: remove; don't let the perfect spoil the good
                  }
              }
          },
      },

      "coefficientOf" : { //TODO: change to coeff for succinctness
          rollingResistance : 0.0015,
      },

      brake : { //TODO: pick a horse and ride; also better documentation, maybe a mind map?
          //air brake equipment information
          lineLength : 50, //train line length, in feet, to be used with timing. TODO: do we need this, or can we just specify timing?
          latency: 100, //time it takes to propagate a signal through the car, in milliseconds
          //makes a brake reduction on ``trainPosition`` by ``psi``, and calculates the braking force resulting
          reservoirPSI: 90, //reservoir psi
          cylinderPSI: 0, //brake cylinder psi
          linePSI: 90, //brake pipe psi
          tripleValve: "R", //can be "R"elease,  "A"pply, or "L"ap
          waitingOnChange: false, //tells brake.cycle() whether or not this car is already undergoing a change
          applicationRate: 0.5, //in psi/sec FROM RESERVOIR
          reduction : function(trainPosition, psi) {

          },
          tripleValveCycle : function(trainPosition) {
              var reservoirPSI = train.all[trainPosition].prototype.brake.reservoirPSI;
              var linePSI = train.all[trainPosition].prototype.brake.linePSI;
              if (reservoirPSI > linePSI) {

                  //Figure out how much of a reduction is needed
                  var reductionAmount = reservoirPSI - linePSI;
                  console.debug("Need to make a " + reductionAmount + "psi reduction on element " + trainPosition)

                  //triple valve APPLY
                  train.all[trainPosition].prototype.brake.tripleValve  = "A";
              }
              else if (reservoirPSI < linePSI) {
                  //triple valve RELEASE
                  train.all[trainPosition].prototype.brake.tripleValve  = "R";

              }
              else if (reservoirPSI == linePSI) {
                  //triple valve LAP
                  train.all[trainPosition].prototype.brake.tripleValve  = "L";

              }
          },
      },
  }
}
