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
/*
JMRI CORE

This file contains what amounts to a scratchbuilt JMRI interface. I opted to build my own interface for greater flexibility than using the provided JMRI jQuery plugin, which at the time of this file's creation I did not know about.

This is not the lowest level portion of the interface, however. websockets.js contains most of the direct interface, and handles things like the layout connection initiation/termination. This file does not deal directly with the network; it is responsible for relaying info between the rest of ZephyrCab and the JMRI JSON servlet.
*/

var jmri = {};

/*
you can call this with keyword new to create a new throttle object that has all the functions of a working throttle. no decoder-specific anything, just like it would be on a Digitrax throttle or something

example: exampleThrottle = new jmri.throttle(1379, 0)
now I can run exampleThrottle.f.set(0, true) to turn on #1379's headlight. You get the idea.

This function should not be used by anything except the core train builder stuff; if you try and build your own throttle stuff using this it WILL BREAK THINGS!
*/
jmri.throttle = function(address, throttleName) {
    if (link.status === true) {
        //this second if statement makes sure we have our decoder.js script loaded, because this is super duper important and yeah
        link.send('{"type":"throttle","data":{"throttle":"' + throttleName + '","address":' + address + '}}')
        log.jmri("Requested throttle " + throttleName + " for locomotive #" + address)
        this.address = address
        this.name = throttleName; //throttle name should always be the train position just for ease-of-development purposes
        this.speed = {}; //same reason as this.f for existing as a seemingly stupid object
        this.direction = {};
        //called when removing object from the train; it releases the throttle
        this.release = function() {
            releasecmd = '{"type":"throttle","data":{"throttle":"' + throttleName + '","release":null}}';
            link.send(releasecmd);
            debugToast("Sent command : " + releasecmd)
        }
        this.speed.set = function(speed) {
            //set speed to given percent
            link.send('{"type":"throttle","data":{"address":' + address + ', "throttle":"' + throttleName + '", "speed":' + speed + '}}')
        }
        
        //Takes a 1 or a -1 as an argument
        this.direction.set = function(direction) {
            var forwardOrNot = (direction === 1); //create a boolean that's true when forward/false when reverse
            link.send('{"type":"throttle","data":{"address":' + address + ', "throttle":"' + throttleName + '", "forward":' + forwardOrNot + '}}')
        }
        this.f = new Object(); //the reason we did this as an object with only one function was to leave room for future ability to store the states of the functions. I will add it if I need it, but its a pain so I haven't yet.
        this.f.set = function(inputData) {
            var finalCommand = []
            //This long train of IF statements will set each function
            for (i=0; i <= 28; i++) {
                var valueName = "F" + i;
                
                //check to see if we got a definition for this function from the user
                if (inputData[valueName]!=undefined) {
                    var segment = ('"' + valueName + '" : ' + inputData[valueName]);
                    finalCommand.push(segment);               
                }
            }
            
            var finalString = finalCommand.join(", ");
            link.send('{"type":"throttle","data":{"address":' + address + ', "throttle":"' + throttleName + '",' + finalString + '}}')
        }
        
        //TODO - add command here so that when a throttle is acquired, all functions are set to off and the speed to 0
    }
    else {
        Materialize.toast("You need to set up your WebSockets connection first!", 4000)
    }
    
}


//call with state as boolean
jmri.trkpower = function(option) {
    if (option == true) {
        link.send('{"type":"power","data":{"state":2}}')
        log.jmri("Track power set to ON")
    }
    else if (option == false) {
        link.send('{"type":"power","data":{"state":4}}')
        log.jmri("Track power set to OFF")
    }
    
    else if (option == "toggle") {
        //if track power is currently on, turn it off
        if (layoutTrackPower_state == true) {
            link.send('{"type":"power","data":{"state":4}}')
            log.jmri("Track power set to OFF")
        }
        //if its currently off, turn it on
        else if (layoutTrackPower_state == false) {
            link.send('{"type":"power","data":{"state":2}}')
            log.jmri("Track power set to ON")
        }
    }
}

jmri.railroadName = "Railroad" //this is set upon connection
jmri.hellomsg //initial railroad hello message

jmri.handleType = new Object(); //this contains all the non-locomotive/throttle related handler functions
jmri.handleType.power = function(string) {
    var json = string
    if (json.data.state == 2) {
        jmri.trkpower.state = true;
        log.jmri("Updated layout track power status to TRUE");
        $("#track-power").prop("checked", true);
    }
    else if (json.data.state == 4) {
        jmri.trkpower.state = false;
        log.jmri("Updated layout track power status to FALSE");
        $("#track-power").prop("checked", false);
    }
}

jmri.roster = new Object();


/*
This is a special version of the JMRI roster.

The returned value from the JMRI JSON server when you request the roster is the in the form of an array of objects. You cannot look up objects by their name, or by any other property, you can only request their number in the array. This variable is automatically generated as an object with the entry names as keys. The values of these keys are the data attributes of the raw roster. This means you can look up a locomotive by name, and it is part of what helps jmri.roster.matchProperty() work.
*/
jmri.roster.entries = new Object();


/*
This contains the roster, raw, as returned by the JSON servlet. It auto-updates if we recieve any new data at any time.
*/
jmri.roster.raw = new Object();


/*
This function is not to be used by any front-end scripts. This is only called by websockets.js when it recieves updated roster data.

Because of this, jmri.roster.entries is ALWAYS up-to-date with whatever data is in jmri.roster.raw.
*/
jmri.roster.reformat = function(rosterRaw) {
    var newRoster = new Object();
    for (i = 0; i < rosterRaw.length; i++) {
        //run for each element of the raw roster
        var entry = rosterRaw[i];
        var name = entry.data.name
        newRoster[name] = entry.data
    }
    return newRoster;
}


/*
This function is used to find entries in the JMRI roster which match a certain object.

You call it with:
jmri.roster.matchProperty({"property":"value"})

The function returns the name keys of all the entries that have the property with the correct value.

For example, jmri.roster.matchProperty({"decoderFamily":"fakeDecoderFamily"}) would return an array of the names of every locomotive whose decoderFamily attribute equals "fakeDecoderFamily". If nothing fits the query, it will return an empty array, or [].
*/
jmri.roster.matchProperty = function(property) {
    var rosterEntries = Object.keys(jmri.roster.entries) //get an array of all the locomotive names for easy for looping
    var results = []
    for (i = 0; i < rosterEntries.length; i++) {
        //this code runs for each roster entry
        var entryName = rosterEntries[i];
        var key = (Object.keys(property))[0] //we always use the first element in the keys list. this is just some idiot proofing
        var value = property[key]
        if (jmri.roster.entries[entryName][key] == value) {
            results.push(entryName)
        }
    }
    return results;
}
jmri.throttleName = new Object();
jmri.throttleName.object = 0
jmri.throttleName.generate = function() {
    jmri.throttleName.object++
    return jmri.throttleName.object;
}

    