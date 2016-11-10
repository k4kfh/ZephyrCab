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
        (new buzz.sound("/soundfx/click.mp3")).play()
        //Change indicator
        if ($(this).val() == 0) {
            $("#reverser.indicator").html("NEU");
            //change actual reverser global
            reverser = 0;
        }
        else if ($(this).val() == 1) {
            $("#reverser.indicator").html("FWD");
            //change actual reverser global
            reverser = 1;
        }
        else if ($(this).val() == -1) {
            $("#reverser.indicator").html("REV");
            //change actual reverser global
            reverser = -1;
        }
    });
    //Throttle
    $('#throttle').change( function() {
        //play sound effect
        (new buzz.sound("/soundfx/click.mp3")).play();    
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

    //Bell
    $('#bell').change( function() {
        //play sound
        (new buzz.sound("/soundfx/switch.mp3")).play()
        //make sure we have a cab locomotive before doing anything else
        if (cab.current !== undefined) {
            //check if we have enough air pressure to run the bell
            var operatingPressure = train.all[cab.current].prototype.air.device.bell.operatingPressure
            var allowed = air.reservoir.main.pressureCheck(operatingPressure, cab.current);
            if (allowed == true) {
                train.all[cab.current].dcc.f.bell.set(arg)
            }
            else {
                train.all[cab.current].dcc.f.bell.set(false)
            }
        }
    });

    //Engine Start
    $('#engine-start').change( function() {
        //play sound
        (new buzz.sound("/soundfx/switch.mp3")).play()

    });

    //Track Power
    $('#track-power').change( function() {
        //play sound
        (new buzz.sound("/soundfx/switch.mp3")).play();
        jmri.trkpower($('#track-power').is(":checked"));
    });

    //Sand
    $('#sand').change( function() {
        //play sound
        (new buzz.sound("/soundfx/switch.mp3")).play()
    });

    //Headlight
    $('#headlight').change( function() {
        //play sound
        (new buzz.sound("/soundfx/switch.mp3")).play()
    });
    
    //WebSockets Connect Button
    $('#link-connect').bind("click", function() {
        //Grab information from the form inputs
        var ip = $('#link-ip').val(),
            port = $('#link-port').val()
        
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
            (new buzz.sound("/soundfx/switch.mp3")).play()
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
            (new buzz.sound("/soundfx/switch.mp3")).play()
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
            (new buzz.sound("/soundfx/switch.mp3")).play()
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
            (new buzz.sound("/soundfx/switch.mp3")).play()
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
            
            ui.cab.currentLoco = number;
            gauge.createAll();
            ui.cab.locoName.update(name);
            Materialize.toast("<i class='material-icons left'>directions_railway</i>Entered cab of " + name, 2500)
            
            /*
            //This resets all the switches (engine startup, bell, etc.) to their ACTUAL values as opposed to the last value they were at.
            document.getElementById("ui.cab.engine.start").checked = train.all[ui.cab.currentLoco].dcc.f.engine.state;
            document.getElementById("ui.cab.bell").checked = train.all[ui.cab.currentLoco].dcc.f.bell.state;
            document.getElementById("ui.cab.headlight").checked = train.all[ui.cab.currentLoco].dcc.f.headlight.state;
            */
    }
}