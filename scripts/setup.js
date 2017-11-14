/*
    ZephyrCab - Realistic Model Train Simulation/Control System
    Copyright (C) 2017 Hampton Morgan (K4KFH)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
util = {
    arrayToDropdown: function (options, selector) {
        $(selector).empty();
        $(selector).append('<option>Choose a locomotive to configure.</option>')
        $.each(options, function (i, p) {
            $(selector).append($('<option></option>').val(p).html(p));
        })
    }
}

setup = {
    load: function (loconame) {
        alert("ya boi")
    },
    compare: {
        getUnconfiguredLocomotives: function () {
            var rosterList = Object.keys(jmri.roster.entries);
            var bundlesList = Object.keys(bundles.locomotives);
            var unbundled = [];
            for (entry in rosterList) {
                if (bundlesList.indexOf(rosterList[entry]) == -1) {
                    //entry has no bundle
                    unbundled.push(rosterList[entry]);
                }
            }
            return unbundled;
        }
    },
    onConnect: function () { //called when we connect to JMRI
        //setup page stuff
        util.arrayToDropdown(setup.compare.getUnconfiguredLocomotives(), "#setup-loco-select") //populate dropdown with unbundled locomotives
        $("#setup-num-unbundled").html(setup.compare.getUnconfiguredLocomotives().length) //set how many unbundled locomotives you have
        $("#setup-form").find("input").change(function () {
            setup.generate();
        })
    },
    generate: function () {
        //regenerate the bundle text below
        var generatedBundle = {
                type: "locomotive",
                prototype: {
                    "builder": $("#setupForm-builder").val(),
                    "name": $("#setupForm-name").val(),
                    "weight": Number($("#setupForm-weight").val()), //Weight of the locomotive in lbs
                    "maxHP": Number($("#setupForm-maxHP").val()), //Horsepower of the locomotive
                    "maxAmps": Number($("#setupForm-maxAmps").val()), //Max current of the locomotive
                    "notchRPM": [
                        Number($("#setupForm-notch0-rpm").val()),
                        Number($("#setupForm-notch1-rpm").val()),
                        Number($("#setupForm-notch2-rpm").val()),
                        Number($("#setupForm-notch3-rpm").val()),
                        Number($("#setupForm-notch4-rpm").val()),
                        Number($("#setupForm-notch5-rpm").val()),
                        Number($("#setupForm-notch6-rpm").val()),
                        Number($("#setupForm-notch7-rpm").val()),
                        Number($("#setupForm-notch8-rpm").val()),
                    ],
                    "notchMaxSpeeds": [
                        null,
                        Number($("#setupForm-notch1-maxSpeed").val()),
                        Number($("#setupForm-notch2-maxSpeed").val()),
                        Number($("#setupForm-notch3-maxSpeed").val()),
                        Number($("#setupForm-notch4-maxSpeed").val()),
                        Number($("#setupForm-notch5-maxSpeed").val()),
                        Number($("#setupForm-notch6-maxSpeed").val()),
                        Number($("#setupForm-notch7-maxSpeed").val()),
                        Number($("#setupForm-notch8-maxSpeed").val()),
                    ],
                    "engineRunning": 0, //0 or 1 - 1 is on, 0 is off
                    "startingTE": Number($("#setupForm-startingTE").val()),
                    "drivetrainEfficiency": Number($("#setupForm-drivetrainEfficiency").val()),
                    scaleSpeedCoefficient: Number($("#setupForm-scaleSpeedCoefficient").val()),

                    wheelSlip: {
                        adhesion: Number($("#setupForm-adhesion").val()), //adhesion factor (in percent)
                        adhesionDuringSlip: Number($("#setupForm-adhesionDuringSlip").val()), //adhesion factor for slipping wheels
                    },

                    air: //holds static and realtime data about pneumatics
                    {
                        reservoir: {
                            main: {
                                capacity: Number($("#setupForm-mainReservoirCapacity").val()), //capacity of the tank in cubic feet
                                leakRate: Number($("#setupForm-mainReservoirLeakRate").val()), //leak rate in cubic feet per 100ms
                            },
                        },
                        compressor: {
                            //STATIC DATA
                            limits: {
                                lower: Number($("#setupForm-compressorLowerLimit").val()), //This is the point at which the compressor will turn back on and fill up the air reservoir (psi)
                                upper: Number($("#setupForm-compressorUpperLimit").val()), //This is the point at which the compressor will turn off (psi)
                            },
                            flowrateCoeff: Number($("#setupForm-flowRateCoeff").val()), //This is cfm/rpm, derived from "255cfm @ 900rpm for an SD45" according to Mr. Al Krug
                        },
                    },

                    "coeff": {
                        rollingResistance:Number($("#setupForm-rollingResistance").val()),
                    },

                    brake: {
                        //air brake equipment information
                        latency: Number($("#setupForm-brakeLatency").val()), //time it takes to propagate a signal through the car, in milliseconds
                    },
                },
            };
            var locoName = $('#setup-loco-select').find(":selected").text();
        
            var finishedBundle = 'tmp = {"' + locoName + '" : ' +JSON.stringify(generatedBundle, null, 4) + "};";
            
            var dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(finishedBundle);
            var linkElement = document.getElementById("setup-download-bundle");
            //if the user forgot to select a locomotive for the bundle to apply to
            if (locoName == "Choose a locomotive to configure.") {
                linkElement.setAttribute('onclick', "alert('You need to choose a locomotive from your JMRI roster!')")
            }
            else {
                linkElement.setAttribute('onclick', undefined)
                linkElement.setAttribute('href', dataUri);
                var filename = locoName;
                filename = filename.replace(" ", ""); //strip out spaces
                linkElement.setAttribute('download', filename+".zephyrcab")
            }
            return generatedBundle;
    
    }
}
