//functions dealing with the train go in here, this is for organization
train = []; //first we must define these objects
train.build = new Object();
train.ui = new Object();

locomotives = [];

/*
This function adds the roster information to the bundles file entries, and builds the train builder selection UI system thing based on all that information.
*/
train.ui.setup = function() {
    //First we go through the keys of the bundles to build a list of available locomotive bundles.
    var locomotivesList = new Object();
    locomotivesList = Object.keys(bundles);
    
    
    /*
    This loop goes through each element of the list and finds the corresponding roster entry from the JMRI roster.
    Then it adds that entire roster object to bundles.thatThing.roster
    */
    for(i=0; i < locomotivesList.length; i++) {
        bundles[locomotivesList[i]].roster = jmri.roster.entries[locomotivesList[i]]
    }
    
    /*
    At this point we can confidently use the bundles object to generate anything to do with locomotive availability. It now has all the JMRI roster stuff, so we can get the decoder info from it.
    
    Now we need to start building the HTML for the train builder. We will store this in an array because it is easier to add to those than a string. At the end, we'll use .join() to combine all of it into a single string and publish it to the DOM.
    */
    
    train.ui.update()
    
    
}

/*
This function updates the entire train builder area. It should be called whenever a part of the train is edited, or whenever bundles.json is edited.

It is called with no arguments.
*/
train.ui.update = function() {
    /*
    The first thing we need to tackle is displaying the actual train.
    
    The train display (the current thing, not the available options) is contained inside document.getElementById("trainDisplay").innerHTML.
    It is handled using MaterializeCSS's "chip" feature.
    */
    var finalHTML = [] //This variable is going to be combined using join() later on.
    for (i=0; i < train.length; i++) {
        /*
        This loop cycles through every single element in the train and generates HTML for each one.
        
        Right now, the chip element only displays the name of the locomotive and a close button.
        
        TODO: Once a standardized place to find images is agreed on, I'd like to make use of the great-looking "img" option of these chips.
        */
        var newHTML = "<div class='chip'>" + train[i].roster.name + "<i class='material-icons right' onclick='train.build.remove(" + i + ")'>close</i></div>";
        finalHTML.push(newHTML)
    }
    document.getElementById("trainDisplay").innerHTML = finalHTML.join('') //The quotes are here so it doesn't put commas between the elements
    
    /*
    Now we need to tackle the locomotive palette, which is based on the bundles object.
    
    We'll use the same method as above (joining an array into a string of HTML)
    */
    var finalHTML = [] //using the same finalHTML variable as above, but we reset it first
    var bundlesKeys = Object.keys(bundles)
    for (i=0; i < bundlesKeys.length; i++) {
        /*
        This loop cycles through every single key from bundles and generates HTML for each one.
        
        TODO: Once a standardized place to find images is agreed on, I'd like to make use of the great-looking "img" option of these chips.
        */
        var currentBundle = bundles[bundlesKeys[i]] //This will equal the inside of the entire object we're dealing with
        
        var newHTML = []
        //This HTML is so complex we generate it in an array instead of a single string.
        var newHTMLstring = "<div class='chip'>"
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = currentBundle.roster.name;
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = "<i onclick='train.build.add("
        newHTML.push(newHTMLstring)
        
        var newHTMLstring = 'bundles["'
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
    console.log(finalHTML.join(''))
}

/*
This function is for adding a bundle object to the train. It doesn't matter if the bundle object is one straight from the bundle files, or if it is one from 
*/
train.build.add = function(object) {
    /*
    First we need to define the decoder model and family straight from the roster object. We only do this for convenience.
    
    After we have this information, we begin actually constructing the new object.
    */
    var decoderModel = object.roster.decoderModel;
    var decoderFamily = object.roster.decoderFamily;
    
    var address = object.roster.address; //We need this because the DCC decoder constructor and the throttle need this
    
    var trainPosition = train.length; //this is necessary because the DCC decoder constructor accepts a trainPosition argument
    
    train.push(object)
    /*
    Because of the magical things built into the decoder constructor function spec, we don't need to call a separate create throttle thing. The throttle subobject is automatically created when we add the DCC decoder thing.
    
    
    */
    var decoderConstructor = decoders[decoderFamily][decoderModel]
    console.log("Decoder Constructor")
    console.dir(decoderConstructor)
    
    train[trainPosition].dcc = new decoderConstructor(address, trainPosition)
    
    //Now we need to update the train ui
    train.ui.update()
}