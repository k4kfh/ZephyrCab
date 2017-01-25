//this is a function I made to make a sort of "verbose mode" for the JS toast alerts. I put in lots of Materialize.toast alerts, but when I don't want to hear everything they're annoying. So if you set debugToastMode = false, then the debug alerts cease and only the normal toasts come. Turn it on and off with cfg.debugToasts
function debugToast(toast, time) {
    if (cfg.debugToasts == true) {
        Materialize.toast("Debug: " + toast, time)
    }
}

//UI Change Events for NEW MATERIALIZE UI


/*
List of Important UI Elements:

---
Inputs:
#horn
#bell
#sand
#headlight
#dyn-brake
#ind-brake
#auto-brake
#throttle
#reverser
#engine-start

---

Indicators:
#throttle-indicator
#reverser-indicator
#wheel-slip
#pcs-open
#dyn-brake-warning
#error
*/
$( document ).ready(function() {
    
    //Reverser
    $('#reverser').change( function() {
        //play sound
        (new buzz.sound("soundfx/click.mp3")).play()
        //Change indicator
        if ($(this).val() == 0) {
            $("#reverser-indicator").html("NEU");
            //change actual reverser global
            reverser = 0;
        }
        else if ($(this).val() == 1) {
            $("#reverser-indicator").html("FWD");
            //change actual reverser global
            reverser = 1;
        }
        else if ($(this).val() == -1) {
            $("#reverser-indicator").html("REV");
            //change actual reverser global
            reverser = -1;
        }
        //DEBUGGING
        console.debug("Change event fired with reverser handle in " + $(this).val() + " position. Set reverser global to " + reverser);
    });
    
    //Throttle
    $('#throttle').change( function() {
        //play sound effect
        (new buzz.sound("soundfx/click.mp3")).play();    
        //call simulation functions
        var returned = notch.set($(this).val())

        //Debugging
        /*
        console.debug("Setting notch to " + $(this).val());
        console.debug("notch.set returned " + returned);
        */

        $("#throttle").val(returned);
        //Change indicator
        if(returned == 0) {
            $("#throttle-indicator").html("IDLE");
        }
        else if (returned > 0 && returned <= 8) {
            $("#throttle-indicator").html("RUN" + returned);
        }
    });
    
    //Horn
    //Mousedown event starts the horn
     $('#horn').mousedown( function() {
        //play sound
        (new buzz.sound("soundfx/switch.mp3")).play()
        //make sure we have a cab locomotive before doing anything else
        if (train.all[cab.current] !== undefined) {
            train.all[cab.current].dcc.f.horn.set(true);
        }
        else {
            //just let the debug console know
            console.error("Horn mousedown method called; doing nothing since we have no cab locomotive!")
        }
    });
    //Mouseup event starts the horn
    $('#horn').mouseup( function() {
        //play sound
        (new buzz.sound("soundfx/switch.mp3")).play()
        //make sure we have a cab locomotive before doing anything else
        if (train.all[cab.current] !== undefined) {
            train.all[cab.current].dcc.f.horn.set(false);
        }
    });

    //Bell
    $('#bell').change( function() {
        //play sound
        (new buzz.sound("soundfx/switch.mp3")).play()
        //make sure we have a cab locomotive before doing anything else
        if (train.all[cab.current] !== undefined) {
            //check if we have enough air pressure to run the bell
            var operatingPressure = train.all[cab.current].prototype.air.device.bell.operatingPressure
            var allowed = air.reservoir.main.pressureCheck(operatingPressure, cab.current);
            if (allowed == true) {
                train.all[cab.current].dcc.f.bell.set($('#bell').is(":checked"))
            }
            else {
                train.all[cab.current].dcc.f.bell.set(false)
            }
        }
        else {
            //just let the debug console know
            console.log("UI: Bell function called; doing nothing since we have no cab locomotive.");
            $('#bell').prop('checked', false);
        }
    });

    //Engine Start
    $('#engine-start').change( function() {
        //If we have no cab locomotive, don't allow anything to happen
        if (train.all[cab.current] === undefined) {
            $('#engine-start').prop('checked', false);
            return null;
        }
        
        //play sound
        (new buzz.sound("soundfx/switch.mp3")).play()
        /*
        Business end of this code
        - Cycle through all train elements
        - If element is locomotive, set .prototype.engineRunning to the state of the #engine-start checkbox
        - If element is locomotive, call .dcc.f.engine.set(boolean)
        */
        for (var i = 0; i < train.all.length; i++) {
            var element = train.all[i]
            if (element.type == "locomotive") {
                element.dcc.f.engine.set($('#engine-start').is(":checked")); //use the state of the checkbox as the boolean argument
                console.log("UI: Calling .dcc.f.engine.set(" + $('#engine-start').is(":checked") + ") on element #" + i + "...");
                
                /*
                FUEL USAGE RELATED CODE - Commented out for now since this is a high-maintenance, low-priority feature. I'm leaving behind the existing codebase, which when commented out is rather unobtrusive and doesn't bother anything else, and could easily be picked up by someone else in the future.
                
                This if statement would handle denying engine start when out of fuel.
                if (!(element.prototype.realtime.fuel.status <= 0)) { //make sure there's fuel before we allow it to start
                    element.dcc.f.engine.set($('#engine-start').is(":checked")); //use the state of the checkbox as the boolean argument
                    console.log("UI: UI: Calling .dcc.f.engine.set(" + $('#engine-start').is(":checked") + ") on element #" + i + "...");
                }
                else { //if we can't start because of no fuel then flip the switch back over
                    $( "#engine-start" ).prop( "checked", false ); //uncheck the switch
                }
                */
            }
        }
    });

    //Track Power
    $('#track-power').change( function() {
        //play sound
        (new buzz.sound("soundfx/switch.mp3")).play();
        jmri.trkpower($('#track-power').is(":checked"));
    });

    //Sand
    $('#sand').change( function() {
        //If we have no cab locomotive, don't allow anything to happen
        if (train.all[cab.current] === undefined) {
            $('#sand').prop('checked', false);
            return null;
        }
        //play sound
        (new buzz.sound("soundfx/switch.mp3")).play()
        Materialize.toast("Sand is not implemented yet!");
    });

    //Headlight
    $('#headlight').change( function() {
        //If we have no cab locomotive, don't allow anything to happen
        if (train.all[cab.current] === undefined) {
            $('#headlight').prop('checked', false);
            return null;
        }
        //play sound
        (new buzz.sound("soundfx/switch.mp3")).play()
        if (train.all[cab.current] === undefined) {
            var value = $(this).is(":checked");
            train.all[cab.current].dcc.f.headlight.set(value);
            console.debug("Setting headlight to " + value);
        }
    });
    
    //WebSockets Connect Button
    $('#link-connect').bind("click", function() {
        //Grab information from the form inputs
        var ip = $('#link-ip').val(),
            port = $('#link-port').val();
        //Double check if the user actually typed in an IP or not
        if (ip !== "") {
            link.connect(ip, port);
        }
        else {
            Materialize.toast("You need to input an IP address!", 2000); //If they didn't type an IP, let them know
        }
    });
});

ui = {
    wheelSlip : {
        set : function(arg) {
            //end early if no real change
            if (arg == ui.wheelSlip.state) {
                return undefined;
            }
            //play sound of relay
            (new buzz.sound("soundfx/switch.mp3")).play()
            //set indicator color
            if (arg == true) {
                $("#wheel-slip").addClass("red").addClass("white-text");
                ui.wheelSlip.state = true;
            }
            else if (arg == false) {
                $("#wheel-slip").removeClass("red").removeClass("white-text");
                ui.wheelSlip.state = false;
            }

        },
        state : false,
    },
    pcsOpen : {
        set : function(arg) {
            //end early if no real change
            if (arg == ui.pcsOpen.state) {
                return undefined;
            }
            //play sound of relay
            (new buzz.sound("soundfx/switch.mp3")).play()
            //set indicator color
            if (arg == true) {
                $("#pcs-open").addClass("red").addClass("white-text");
                ui.pcsOpen.state = true;
            }
            else if (arg == false) {
                $("#pcs-open").removeClass("red").removeClass("white-text");
                ui.pcsOpen.state = false;
            }

        },
        state : false,
    },
    dynBrakeWarning : {
        set : function(arg) {
            //end early if no real change
            if (arg == ui.dynBrakeWarning.state) {
                return undefined;
            }
            //play sound of relay
            (new buzz.sound("soundfx/switch.mp3")).play()
            //set indicator color
            if (arg == true) {
                $("#dyn-brake-warning").addClass("red").addClass("white-text");
                ui.dynBrakeWarning.state = true;
            }
            else if (arg == false) {
                $("#dyn-brake-warning").removeClass("red").removeClass("white-text");
                ui.dynBrakeWarning.state = false;
            }

        },
        state : false,
    },
    error : {
        set : function(arg) {
            //end early if no real change
            if (arg == ui.error.state) {
                return undefined;
            }
            //play sound of relay
            (new buzz.sound("soundfx/switch.mp3")).play()
            //set indicator color
            if (arg == true) {
                $("#error").addClass("red").addClass("white-text");
                ui.error.state = true;
            }
            else if (arg == false) {
                $("#error").removeClass("red").removeClass("white-text");
                ui.error.state = false;
            }

        },
        state : false,
    }
}

var cab = {
    current: 0, //this is set to 0 by default to assume that we're in the cab of the leading locomotive
    setCurrentLoco: function(name) {
        if (name == undefined) {
                if (train.all[0] == undefined) {
                    return undefined; //This makes the entire function not do anything if we have no lead loco
                }
                //Set name to the name of the lead loco
                var name = train.all[0].roster.name;
                
                //Now the function can move on as normal, but it will revert to the lead locomotive.
            }
            var number = train.find.all(name);
            
            //This stops the function mid-execution if it is trying to work with a nonexistant locomotive.
            if (number == undefined) {
                return undefined;
            }
            
            cab.current = number;
            Materialize.toast("<i class='material-icons left'>directions_railway</i>Entered cab of " + name, 2500)
            

            //This resets all the switches (engine startup, bell, etc.) to their ACTUAL values as opposed to the last value they were at.
            $("#engine-start").checked = train.all[cab.current].dcc.f.engine.state;
            $("#bell").checked = train.all[cab.current].dcc.f.bell.state;
            $("#headlight").checked = train.all[cab.current].dcc.f.headlight.state;
    }
}

/*
GAUGES

This is a backwards-compatible (mostly) implementation of the previous incredibly complex <canvas> gauges system. I opted to use tables since screen real estate is a precious commodity on mobile devices, and tables are much easier to deal with than someone else's custom gauges library.

Gauges are all contained in a table, and thus the actual gauge values are accessed via <td> elements. Units are added to the strings in the methods below; they are NOT hardcoded into the HTML.

IDs of the gauge elements:
- Speed         #gauge-speed
- Current       #gauge-amps
- Brake Pipe    #gauge-brakePipe
- Brake Cyl.    #gauge-brakeCylinder
- Main Res.     #gauge-mainReservoir
- EQ Res.       #gauge-equalizingReservoir
*/

gauge = {
    air : {
        reservoir : {
            //Main Air Reservoir Gauge
            main : function(val) {
                val = Math.round(val) + "psi"; //add units
                $("#gauge-mainReservoir").html(val);
            },
            equalizing : function(val) {
                val = val + "psi"; //add units
                $("#gauge-equalizingReservoir").html(val);
            }
        }
    },
    speedometer : function(val) {
        val = Math.round(val) + "mph"; //add units
        $("#gauge-speed").html(val);
    },
    current : function(val) {
        val = val + "psi"; //add units
        $("#gauge-mainReservoir").html(val);
    },
    rpm : function(val) {
        //does nothing, simply a placeholder for the future
    }
}