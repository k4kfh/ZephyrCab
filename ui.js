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
        
    }
    else if (event == "throttleacquired") {
        //this runs when you actually request a throttle
        
    }
    
}
function updateNotchHTML(newnotch) {
    //this varies with your HTML, which is why it's in UI.js
    //this code is called by setNotch() every time it sets a new notch. Put whatever code is needed to update the notch indicator on your HTML here. It shouldn't return anything
    
    //this is how I set the notch indicator for mine, but you can do yours however you like
    //this if statement allows me to have the notch indicator read "Current Notch: 0 (Idling)" instead of just 0.
    if(newnotch == 0) {
        newnotch = "0 (Idling)"
    }
    //this changes the wording to "Run 1" instead of just 1. It's not essential but I like it :P
    else {
        newnotch = "Run " + newnotch
    }
    document.getElementById("notchindicator").innerHTML = "Current Notch: " + newnotch
    
}

//this runs every time a notch is not allowed, with the argument being "timing" if the notch is disallowed because of ProtoEngine's timing
function notchDisallowed(args) {
    if (args == "timing") {
        alert("You can't notch this locomotive until you wait a little bit for the engine to catch up!")
    }
}