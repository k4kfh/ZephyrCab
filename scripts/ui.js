ui = {
    cab : {
        notch : {
            set : function() {
                var newNotch = document.getElementById("notch").value;
                var returned = notch.set(newNotch)
                console.log("Returned " + returned)
            }
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


//this is a function I made to make a sort of "verbose mode" for the JS toast alerts. I put in lots of Materialize.toast alerts, but when I don't want to hear everything they're annoying. So if you set debugToastMode = false, then the debug alerts cease and only the normal toasts come.
debugToastMode = false
function debugToast(toast, time) {
    if (debugToastMode == true) {
        Materialize.toast("Debug: " + toast, time)
    }
}