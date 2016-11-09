/*

UI

This file, as the name suggests, deals with the components of the ZephyrCab UI. While most of the objects here handle the various inputs in the cab, there are also other UI components present here, such as the layout power switch's backend, and a few shortcut functions for various UI/UX things.

One very important function located here is debugToast, which is for use in debugging the program. If you have enabled debugToasts in settings.json, the toasts fed into the debugToast function will appear just like normal toasts. However, when disabled, there is no indication of these toasts ever being attempted. This is an excellent way to enable/disable a debug mode for your work quickly, without disturbing users.
*/
ui = {
    cab : {
        gauges : {
            speedometer : {
                create : function() {},
                update : function() {},
            },
            rpm : {
                create : function() {},
                update : function() {},
            },
            ammeter : {
                create : function() {},
                update : function() {},
            }
        },
        
        notch : {
            set : function() {
                var newNotch = document.getElementById("notch").value;
                var returned = notch.set(newNotch)
                $("#notch").val(returned)
            }
        },
        
        engine : {
            start : {
                set : function(arg) {
                    if (train.all[ui.cab.currentLoco] != undefined) {
                        ui.cab.engine.start.state = arg;
                        document.getElementById("ui.cab.engine.start").checked = arg;
                    }
                    else {
                        document.getElementById("ui.cab.engine.start").checked = ui.cab.engine.start.state;
                        return ui.cab.engine.start.state;
                    }
                },
                state : false, //Boolean to represent the state of the engine on all the trains
            },
        },
        
        locoName : {
            update : function(name) {
                if (jmri.roster.entries[name] != undefined) {
                    //This function sets the locomotive name in the CAB tab
                    if (jmri.roster.entries[name].road != undefined && jmri.roster.entries[name].number != undefined) {
                        //If the roadname and road number are not undefined
                        var display = jmri.roster.entries[name].road + " #" + jmri.roster.entries[name].number + " (" + name + ")"
                    }
                    else {
                        var display = name;
                    }
                }
                else {
                    var display = "No Lead Locomotive Found!";
                }
                
                document.getElementById("ui.locoName").innerHTML = display;
            }
        },
        
        headlight : {
            set : function(arg) {
                //Because of the way the consist system (or lack thereof, in all technicality) works, we must set the headlight on ONLY the lead locomotive. First, we check and make sure we actually HAVE a lead locomotive
                if (train.all[ui.cab.currentLoco] != undefined) {
                    //Turn the headlight on on the lead loco, and also change the state we have stored locally
                    train.all[ui.cab.currentLoco].dcc.f.headlight.set(arg);
                    ui.cab.headlight.state = arg;
                    document.getElementById("ui.cab.headlight").checked = arg;
                }
                else {
                    //If we don't have a lead loco, revert back the state we have.
                    document.getElementById("ui.cab.headlight").checked = ui.cab.headlight.state;
                }
            },
            
            state : false,
        },
        
        reverser : {
            set : function(arg) {
                if(train.all.length != 0) {
                    //If there is something on the train
                    reverser = arg;
                    console.log("Set reverser to " + reverser)
                }
                else {
                    Materialize.toast("<i class='material-icons left'>warning</i>You have nothing on your train!", 3000)
                    reverser = arg;
                    console.log("Set reverser to " + reverser + ", but there is nothing on the train!")
                }
            }
        },
        
        bell : {
            set:function(arg) {
                if (train.all[ui.cab.currentLoco] != undefined) {
                    //If we have a lead locomotive
                    ui.cab.bell.state = arg;
                    var operatingPressure = train.all[ui.cab.currentLoco].prototype.air.device.bell.operatingPressure
                    var allowed = air.reservoir.main.pressureCheck(operatingPressure, ui.cab.currentLoco)
                    if (allowed == true) {
                        ui.cab.bell.state = arg
                        train.all[ui.cab.currentLoco].dcc.f.bell.set(arg)
                    }
                    else {
                        ui.cab.bell.state = false;
                        train.all[ui.cab.currentLoco].dcc.f.bell.set(false)
                    }
                    document.getElementById("ui.cab.bell").checked = ui.cab.bell.state;
                    return ui.cab.bell.state;
                }
                else {
                    //If there's no lead locomotive
                    Materialize.toast("You can't turn on the bell until you add a lead locomotive.", 3000)
                    document.getElementById("ui.cab.bell").checked = ui.cab.bell.state;
                    return ui.cab.bell.state;
                }
            },
            state : false,
        },
        
        horn : {
            set : function(arg) {
                if (train.all[ui.cab.currentLoco] != undefined) {
                    train.all[ui.cab.currentLoco].dcc.f.horn.set(arg)
                    ui.cab.horn.state = arg;
                }
                //Since this is a button, not a checkbox, we don't have to do anything if there's no lead loco.
            },
            
            state : false,
        },
        
        airDump : {
            set : function(arg) {
                if (train.all[ui.cab.currentLoco] != undefined) {
                    //If we have a lead locomotive
                    train.all[ui.cab.currentLoco].dcc.f.airDump.set(arg)
                    sim.f.air.dump(ui.cab.currentLoco, arg)
                    ui.cab.airDump.state = arg;
                    ui.cab.shutOffAir(); //turns off all the air appliances in sequence with a short break in between each one
                    return ui.cab.airDump.state;
                }
                else {
                    //If there's no lead locomotive
                    Materialize.toast("You don't have a lead locomotive.", 3000)
                    document.getElementById("ui.cab.airDump").checked = ui.cab.airDump.state;
                    return ui.cab.airDump.state;
                }
            },
            
            state : false //when true, the compressor won't kick on
        },
        
        shutOffAir: function() {
            setTimeout(function(){train.all[ui.cab.currentLoco].dcc.f.bell.set(false, true)},100);
        },
        
        currentLoco : 0,
        setCurrentLoco : function(name) {
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
            
            //This resets all the switches (engine startup, bell, etc.) to their ACTUAL values as opposed to the last value they were at.
            document.getElementById("ui.cab.engine.start").checked = train.all[ui.cab.currentLoco].dcc.f.engine.state;
            document.getElementById("ui.cab.bell").checked = train.all[ui.cab.currentLoco].dcc.f.bell.state;
            document.getElementById("ui.cab.headlight").checked = train.all[ui.cab.currentLoco].dcc.f.headlight.state;
        }
    },
}


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

//Reverser
$('#reverser').change( function() {
    //play sound
    (new buzz.sound("/soundfx/click.mp3")).play()
    //Change indicator
    if ($(this).val() == 0) {
        $("#reverser-indicator").html("NEU");
    }
    else if ($(this).val() == 1) {
        $("#reverser-indicator").html("FWD");
    }
    else if ($(this).val() == -1) {
        $("#reverser-indicator").html("REV");
    }
});

//Throttle
$('#throttle').change( function() {
    //play sound effect
    (new buzz.sound("/soundfx/click.mp3")).play()
    //Change indicator
    if($(this).val() == 0) {
        $("#throttle-indicator").html("IDLE")
    }
    else if ($(this).val() > 0 && $(this).val() <= 8) {
        $("#throttle-indicator").html("RUN" + $(this).val())
    }
    
    //call simulation functions
    notch.set($(this).val())
    console.debug("Setting notch to " + $(this).val())
});

//Bell
$('#bell').change( function() {
    //play sound
    (new buzz.sound("/soundfx/switch.mp3")).play()
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