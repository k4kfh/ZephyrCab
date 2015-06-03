function pageUpdate() {
        //this code keeps the page updated with the latest variables, and runs basically constantly.
        
}


//this function runs with no arguments on page load
function init(event) {
    console.log("Running init()")
    if (event == "pageload") {
        //this runs on page load
        
    }
    else if (event == "connect") {
        //this runs on connection to layout
        updateHTML("layoutTrackPower_state")
        
    }
    else if (event == "throttleacquired") {
        //this runs when you actually request a throttle
        
    }
    
}


//every time a variable is updated this function is called with updateHTML(variable name as a string)
//you can put your custom code to update your page HTML for that variable in there
//this can be called with:
//layoutTrackPower_state
//locoBrake
//notch
//reverser
function updateHTML(variable) {
    if (variable == "notch") {
        
        if(notch == 0) {
            var HTMLnotch
            HTMLnotch = "0 (Idling)"
        }
    //this changes the wording to "Run 1" instead of just 1. It's not essential but I like it :P
        else {
            HTMLnotch = "Run " + notch
        }
        document.getElementById("notchindicator").innerHTML = "Current Notch: " + HTMLnotch
        
    }
    else if (variable == "layoutTrackPower_state") {
        if (layoutTrackPower_state == true) {
            //if track power is on, turn the button green
            document.getElementById("trkpower-button").style.backgroundColor = "lightgreen"
        }
        else if (layoutTrackPower_state == false) {
            //if track power is on, turn the button green
            document.getElementById("trkpower-button").style.backgroundColor = "red"
        }
            
        
    }
    else if (variable == "locoBrake") {
        document.getElementById("locoBrakeIndicator").innerHTML = locoBrake + "%"
    }
    else if (variable == "reverser") {
        if (reverser == "forward") {
            document.getElementById("reverserIndicator").innerHTML = "Current Reverser Setting: FORWARD"
        }
        if (reverser == "neutral") {
            document.getElementById("reverserIndicator").innerHTML = "Current Reverser Setting: NEUTRAL"
        }
        if (reverser == "reverse") {
            document.getElementById("reverserIndicator").innerHTML = "Current Reverser Setting: REVERSE"
        }
    }
    
}





//this runs every time a notch is not allowed, with the argument being "timing" if the notch is disallowed because of ProtoEngine's timing
function notchDisallowed(args) {
    if (args == "timing") {
        alert("You can't notch this locomotive until you wait a little bit for the engine to catch up!")
    }
}