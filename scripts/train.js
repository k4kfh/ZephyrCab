//functions dealing with the train go in here, this is for organization
train = new Object(); //first we must define these objects
train.all = []; //THIS IS THE MAIN TRAIN LIST
train.build = new Object();
train.ui = {
    locomotives : {},
    rollingstock : {},
}

/*
This function adds the roster information to the bundles.locomotives file entries, and builds the train builder selection UI system thing based on all that information.
*/
train.ui.setup = function() {
    //First we go through the keys of the bundles.locomotives to build a list of available locomotive bundles.locomotives.
    var locomotivesList = new Object();
    locomotivesList = Object.keys(bundles.locomotives);
    
    
    /*
    This loop goes through each element of the list and finds the corresponding roster entry from the JMRI roster.
    Then it adds that entire roster object to bundles.locomotives.thatThing.roster
    */
    for(i=0; i < locomotivesList.length; i++) {
        bundles.locomotives[locomotivesList[i]].roster = jmri.roster.entries[locomotivesList[i]];
    }
    
    //Real quick we need to add the rolling stock names to a list
    train.ui.rollingstock.names = Object.keys(bundles.rollingstock)
    
    /*
    At this point we can confidently use the bundles.locomotives object to generate anything to do with locomotive availability. It now has all the JMRI roster stuff, so we can get the decoder info from it.
    
    Now we need to start building the HTML for the train builder. We will store this in an array because it is easier to add to those than a string. At the end, we'll use .join() to combine all of it into a single string and publish it to the DOM.
    */
    
    train.ui.update()
    
    
}

/*
These new objects here are for making sure you can't add a locomotive twice. One contains used locomotive roster names, one contains unused ones. This will make it impossible to add a locomotive twice, which would cause the universe to implode.
*/
train.ui.locomotives = new Object();
train.ui.locomotives.used = [];
train.ui.locomotives.unused = Object.keys(bundles.locomotives); //we set it to this initially because obviously when this script is first loaded, no locomotives from bundles.locomotives have been used

/*
This function updates the entire train builder area. It should be called whenever a part of the train is edited, or whenever bundles.locomotives.json is edited.

It is called with no arguments.
*/
train.ui.update = function() {
    /*
    The first thing we need to tackle is displaying the actual train.
    
    The train display (the current thing, not the available options) is contained inside document.getElementById("trainDisplay").innerHTML.
    It is handled using MaterializeCSS's "chip" feature.
    */
    var finalHTML = [] //This variable is going to be combined using join() later on.
    for (i=0; i < train.all.length; i++) {
        /*
        This loop cycles through every single element in the train and generates HTML for each one.
        
        Right now, the chip element only displays the name of the locomotive and a close button.
        
        TODO: Once a standardized place to find images is agreed on, I'd like to make use of the great-looking "img" option of these chips.
        */
        
        var newHTML = [];
        
        var newHTMLstring = "<div class='chip hoverable'>";
        newHTML.push(newHTMLstring);
        
        //LOCOMOTIVES ONLY: This builds the "enter cab" link.
        if (train.all[i].type == "locomotive") {
            console.log("MARKER FOR TYPE==LOCOMOTIVE")
            var newHTMLstring = "<i class='material-icons left'>train</i>"
            newHTML.push(newHTMLstring)
            var newHTMLstring = "<a onclick='";
            newHTML.push(newHTMLstring);
        
            var newHTMLstring = 'ui.cab.setCurrentLoco("';
            newHTML.push(newHTMLstring);
        
            var newHTMLstring = train.all[i].roster.name;
            newHTML.push(newHTMLstring);
        
            var newHTMLstring = '")';
            newHTML.push(newHTMLstring);
        
            var newHTMLstring = "' style='cursor:pointer'>";
            newHTML.push(newHTMLstring);
        
            var newHTMLstring = train.all[i].roster.name;
            newHTML.push(newHTMLstring);
        
            var newHTMLstring = "</a>";
            newHTML.push(newHTMLstring);
        }
        //This only shows the name, it doesn't bother with any kind of clickable links, at least not yet.
        else if (train.all[i].type == "rollingstock") {
            var newHTMLstring = train.all[i].roster.name;
            newHTML.push(newHTMLstring)
        }
        var newHTMLstring = "<i class='material-icons right' ";
        newHTML.push(newHTMLstring);
        
        var newHTMLstring = 'onclick=\'train.build.remove("';
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = train.all[i].roster.name;
        newHTML.push(newHTMLstring);
        
        var newHTMLstring = '")\'';
        newHTML.push(newHTMLstring);
        
        var newHTMLstring = ">close</i></div>";
        newHTML.push(newHTMLstring);
        
        finalHTML.push(newHTML.join(''));
    }
    document.getElementById("trainDisplay").innerHTML = finalHTML.join(''); //The quotes are here so it doesn't put commas between the elements
    
    /*
    Now we need to tackle the locomotive palette, which is based on the bundles.locomotives object.
    
    We'll use the same method as above (joining an array into a string of HTML)
    */
    var finalHTML = [] //using the same finalHTML variable as above, but we reset it first
    for (i=0; i < train.ui.locomotives.unused.length; i++) {
        /*
        This loop cycles through every single key from train.ui.locomotives.unused and generates HTML for each one. It will only generate HTML for available locos.
        */
        var currentBundle = bundles.locomotives[train.ui.locomotives.unused[i]] //This will equal the inside of the entire object we're dealing with
        
        /*
        This is my chosen complex-but-functional method of building HTML with JavaScript. I do it one line at a time, splitting it into chunks so I can spend minimal time fighting with quotes and escape characters. At the end of the build process, I combine all those array elements into a single HTML string with .join(''), and in this instance I take the various versions of that (one for each locomotive) and push them into the final HTML variable, which is later combined using .join() and put into the DOM.
        */
        var newHTML = []
        var newHTMLstring = "<div class='chip'>"
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = currentBundle.roster.name;
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = "<i onclick='train.build.add("
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = 'bundles.locomotives["'
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = currentBundle.roster.name; //This is the name from the roster
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = '"]'
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = ")'"
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = "class='material-icons right'>add</i>"
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = "</div>"
        newHTML.push(newHTMLstring)
        
        finalHTML.push(newHTML.join(''))
    }
    document.getElementById("locomotivePalette").innerHTML = finalHTML.join(''); //The quotes are here so it doesn't put commas between the elements
    //console.log(finalHTML.join(''))
    
    /*
    Next, we display the rolling stock palette.
    */
    var finalHTML = [] //reset this from above
    /*
    This loop goes through the list of rolling stock names, then generates HTML for their add buttons. You don't have a finite number of rolling stock, so these buttons never go away.
    
    In the future, integration with JMRI's OperationsPro rolling stock roster is planned. This will require a pretty significant amount of work, but it is not impossibly difficult with this implementation (I think/hope).
    */
    for (i=0; i < train.ui.rollingstock.names.length; i++) {
        var name = train.ui.rollingstock.names[i];
        var newHTML = '<div class="chip">'
        finalHTML.push(newHTML);
        var newHTML = "<i class='material-icons' onclick='"
        finalHTML.push(newHTML);
        var newHTML = 'train.build.add(bundles.rollingstock["' + name + '"])\'' //this line is really ugly, but the \ just escapes the quotation so the onclick attribute works properly. Sue me.
        finalHTML.push(newHTML)
        var newHTML = '>add</i>' + name + "</div>";
        finalHTML.push(newHTML)
    }
    console.log("FINAL HTML: " + finalHTML.join(''))
    $("#rollingstockPalette").html(finalHTML.join(''))
    
    
    /*
    New Feature: Display locomotive name in CAB tab
    
    This feature looks at the roster entry name of the lead locomotive and displays it in the CAB tab's spot for names.
    
    The IF statement is so that if there IS no lead locomotive, we can set the name to "Not Set"
    */
    if (train.all[0] != undefined) {
        var locoName = train.all[ui.cab.currentLoco].roster.name;
    }
    else {
        var locoName = "No Lead Locomotive Found";
    }
    ui.cab.locoName.update(locoName)
}

/*
This function is for adding a bundle object to the train. It doesn't matter if the bundle object is one straight from the bundle files, or if it is one from somewhere else. The beauty of this approach is that this function doesn't care if  you're adding locomotives, rolling stock, or some crazy insane new type of thing you made up while half-asleep the other day.
*/
train.build.add = function(object) {
    if (object.type == "locomotive") { //This if statement checks if the input object is a locomotive or something else
        /*
        First we need to define the decoder model and family straight from the roster object. We only do this for convenience.
    
        After we have this information, we begin actually constructing the new object.
        */
        var decoderModel = object.roster.decoderModel;
        var decoderFamily = object.roster.decoderFamily;
    
        var address = object.roster.address; //We need this because the DCC decoder constructor and the throttle need this
    
        var trainPosition = train.all.length; //this is necessary because the DCC decoder constructor accepts a trainPosition argument
    
        train.all.push(object)
        /*
        Because of the magical things built into the decoder constructor function spec, we don't need to call a separate create throttle thing.     The throttle subobject is automatically created when we add the DCC decoder thing.
    
        This series of IF/ELSE statements is the mechanism for generic decoder fallback. If ZephyrCab doesn't have a specific object file for a given decoderModel/decoderFamily, it falls back to generic/generic. Otherwise, it just sets the variable decoderConstructor to the appropriate constructor object.
        */
        if (decoders[decoderFamily] == undefined) {
            decoderConstructor = decoders["generic"]["generic"]
        }
        else {
            var decoderConstructor = decoders[decoderFamily][decoderModel]
        }
    
        train.all[trainPosition].dcc = new decoderConstructor(address, trainPosition) //decoderConstructor here is just shorthand for the actual constructor. It's defined in the IF/ELSE statement above.
    
        //Now that the entire new object is done, we need to move the locomotive name to the used list
        train.ui.locomotives.used.push(object.roster.name)
    
        //Removing the locomotive from the unused list:
        var index = train.ui.locomotives.unused.indexOf(object.roster.name)
        train.ui.locomotives.unused.splice(index, 1)
    }
    //If the input object is rolling stock, do this:
    else if (object.type == "rollingstock") {
        train.all.push(object) //since there's no decoder or executable object for rolling stock, we literally just add the object as-is
    }
    
    //Now we need to update the train ui
    train.ui.update();
    
    //We only call the gauges.createAll() function when we ADD something, because if there's nothing on the train it'll break things.
    gauge.createAll();
}

train.build.remove = function(entryName) {
    
    var index = train.find.all(entryName)
    var type = train.all[index].type
    train.all.splice(index, 1) //remove 1 element at the index, basically saying remove the index
    debugToast("Removing " + entryName + " from train.");
    
    //If the object to be removed is a locomotive, we need to update the list of used/unused locomotives. Otherwise, we're basically done.
    if (type == "locomotive") {
        //Now we have to update the used/unused locomotive lists
        var index = train.ui.locomotives.used.indexOf(entryName);
        train.ui.locomotives.used.splice(index, 1);
        //Now we've removed it from the used list, so we need to add it to the unused list.
        train.ui.locomotives.unused.push(entryName)
    }
    
    train.ui.update();
}


/*
This is basically a jerry-rigged version of .indexOf(), but it works with the weird objects-inside-array format of the train.all array. It accepts a name argument and will return the position of the object with that roster.name attribute.
*/
train.find = new Object();
train.find.all = function(entryName) {
    var position; //Go ahead and define this so it's in the right scope
    
    for (i = 0; i < train.all.length; i++ ) {
        var name = train.all[i].roster.name
        console.log("Name = " + name)
        if (name == entryName) {
            position = i;
            break;
        }
    }
    return position;
}