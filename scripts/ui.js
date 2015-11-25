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
            },
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
                    train.all[ui.cab.currentLoco].dcc.f.bell.set(arg)
                    ui.cab.bell.state = arg;
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
        
        currentLoco : 0,
        setCurrentLoco : function(name) {
            var number = train.find.all(name);
            ui.cab.currentLoco = number;
            gauge.createAll();
            ui.cab.locoName.update(name);
        }
    },
    
    connection : {
        status : {
            
            //Called when websockets connection is opened.
            set : function(connectionState) {
                if (connectionState == true) {
                    $("#connectionStatus").html("Connected!").css("color", "green")
                }
            }
        }
    },
    
    layout : {
        power : {
            status : {
                update : function() {
                    var status = jmri.trkpower.state
                    document.getElementById("jmri.trkpower").checked = status;
                },
            }
        }
    }
}


//this is a function I made to make a sort of "verbose mode" for the JS toast alerts. I put in lots of Materialize.toast alerts, but when I don't want to hear everything they're annoying. So if you set debugToastMode = false, then the debug alerts cease and only the normal toasts come. Turn it on and off with cfg.debugToasts
function debugToast(toast, time) {
    if (cfg.debugToasts == true) {
        Materialize.toast("Debug: " + toast, time)
    }
}