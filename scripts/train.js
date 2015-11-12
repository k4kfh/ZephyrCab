//functions dealing with the train go in here, this is for organization
train = [] //first we must define these objects
train.build = new Object();
train.ui = new Object();

//This function is called like so:
//
train.build.add = function(type, number, dccAddress, decoderFamily, decoderModel, modelManufacturer, modelFamily, modelProduct) {
    if (type == "locomotive") {
        //if the type of the item is a locomotive
        var item = prototype.locomotives[number];
        train.push(item);
        console.log("Added " + item + "to train object.");
        train.ui.update();
    }
    if (type == "rollingstock") {
        //if the type of the item is rolling stock
        var item = prototype.rollingstock[number];
        train.push(item);
        console.log("Added " + item + "to train object.");
        train.ui.update();
    }
}

train.build.remove = function(number) {
    //remove the given number from the train array, then update the train display
    train.splice(number, 1)
    train.ui.update();
    console.log("Removed list element #" + number + " from the train object")
}

train.ui.update = function() {
    var newHTML = ""
    var finalHTML = ""
    var finalArray = []
    
    //we go through each train element
    for (i = 0; i < train.length; i++) {
        if (train[i].imageURL == undefined) {
            newHTML = '<div class="chip">' + train[i].builder + " " + train[i].name + "<i onclick=\'train.build.remove(" + i + ")\' class='material-icons right'>close</i></div>"
            finalArray.push(newHTML) //append the newly built HTML for this element to the final product
        }
        if (train[i].imageURL != undefined) {
            newHTML = '<div class="chip"><img src="' + train[i].imageURL + '">' + train[i].builder + " " + train[i].name + "<i class='material-icons right' onclick=\'train.build.remove(" + i + ")\'>close</i></div>"
            finalArray.push(newHTML) //append the newly built HTML for this element to the final product
        }
    }
    
    finalHTML = finalArray.join(""); //join the array elements together into a single HTML string, using "" as a separator (nothing, as opposed to comma which is the default)
    
    document.getElementById("trainDisplay").innerHTML = finalHTML //set inner HTML of div element for displaying train
    
}

train.ui.palette = new Object();

train.ui.palette.build = function() {
    //FIRST LOCOMOTIVES
    var locos = new Object();
    locos.finalHTML = ""
    locos.finalArray = []
    locos.newHTML = ""
    
    //we go through each available locomotive from prototypes.json
    for (i = 0; i < prototype.locomotives.length; i++) {
        if (prototype.locomotives[i].imageURL == undefined) {
            locos.newHTML = '<div class="chip">' + prototype.locomotives[i].builder + " " + prototype.locomotives[i].name + '<i class="material-icons right" onclick="train.build.add(\'locomotive\',' + i + ')">add</i></div>';
            locos.finalArray.push(locos.newHTML); //append the newly built HTML for this element to the final product
        }
        if (prototype.locomotives[i].imageURL != undefined) {
            locos.newHTML = '<div class="chip"><img src="' + prototype.locomotives[i].imageURL + '">' + prototype.locomotives[i].builder + " " + prototype.locomotives[i].name + '<i class="material-icons right" onclick="train.build.add(\'locomotive\',' + i + ')" >add</i></div>';
            locos.finalArray.push(locos.newHTML); //append the newly built HTML for this element to the final product
        }
    }
    
    locos.finalHTML = locos.finalArray.join(""); //join the array elements together into a single HTML string, using "" as a separator (nothing, as opposed to comma which is the default)
    
    document.getElementById("locomotivePalette").innerHTML = locos.finalHTML
    console.log("Locomotive Palette Final HTML: " + locos.finalHTML)
    
    //Now locomotives is done
    //SECOND, ROLLING STOCK
    var rollingstock = new Object();
    rollingstock.finalHTML = ""
    rollingstock.finalArray = []
    rollingstock.newHTML = ""
    
    //we go through each available locomotive from prototypes.json
    for (i = 0; i < prototype.rollingstock.length; i++) {
        if (prototype.rollingstock[i].imageURL == undefined) {
            rollingstock.newHTML = '<div class="chip">' + prototype.rollingstock[i].name + '<i class="material-icons right" onclick="train.build.add(\'rollingstock\',' + i + ')">add</i></div>';
            rollingstock.finalArray.push(rollingstock.newHTML); //append the newly built HTML for this element to the final product
        }
        if (prototype.rollingstock[i].imageURL != undefined) {
            rollingstock.newHTML = '<div class="chip"><img src="' + prototype.rollingstock[i].imageURL + '">' + prototype.rollingstock[i].name + '<i class="material-icons right" onclick="train.build.add(\'rollingstock\',' + i + ')">add</i></div>';
            rollingstock.finalArray.push(rollingstock.newHTML); //append the newly built HTML for this element to the final product
        }
    }
    
    document.getElementById("rollingstockPalette").innerHTML = rollingstock.finalHTML
    
}

train.ui.modal = new Object();


/*
Call this with:
train.ui.locomotive.modal(0)
If you want to build a modal for locomotive 0 in the array.

This will automatically add the modal's HTML to <div id="modalStorage"> so you do not need to do anything with that
*/
train.ui.modal.locomotive = function(prototypeNum) {
    var prototypeObj = prototype.locomotives[prototypeNum];
    var name = prototypeObj.name;
    var builder = prototypeObj.builder;
    var locoName = builder + " " + name //this is for display later, so the code doesn't have to fight with " " and such
    var modalName = "loco-modal-" + prototypeNum;
    
    /*
    This works by going through one line at a time. It builds the HTML in "lines", which are sometimes what would be a line and are sometimes several lines grouped together. The lines are only there for organizational purposes.
    
    After building one line, it uses .push() to add that line to the modalHTML array.
    
    At the end of the function, after all the lines have been added, we run modalHTML.join() and get the resulting string of HTML. It's not pretty, but it's functional.
    */
    
    var modalHTML = [] //define the array HTML variable, which will be combined into a string at the end
    
    var nextline = "" //this is a variable purely for organization, and is redefined every time a new line is made
    
    //main div element for modal
    nextline = '<div id="' + modalName + '" class="modal modal-fixed-footer"><div class="modal-content">';
    modalHTML.push(nextline);
    
    nextline = "<h4>" + locoName + "</h4>";
    modalHTML.push(nextline);
    
    //this is the beginning of the collection thing. I put it separate for organizational purposes
    nextline = '<ul class="collection">';
    modalHTML.push(nextline);
    
    //this is the first element in the collection, which is "Address"
    nextline = '<li class="collection-item"><h5>Address</h5><div class="row"><form class="col s12"><div class="row"><div class="input-field col s3">"';
    modalHTML.push(nextline);
    
    //this is the DCC address input element, plus the corresponding <label>
    nextline = '<input id="dccAddress' + prototypeNum + '" type="number" class="validate" length="4"><label for="dccAddress' + prototypeNum + '" data-error="invalid" data-success="validated">DCC Address</label>';
    modalHTML.push(nextline);
    
    //this is the closing tags for the "Address" collection element
    nextline = ' </div></div></form></div></li>';
    modalHTML.push(nextline);
    
    //this is the opening tags for the next collection element, "Model Information"
    nextline = '<li class="collection-item"><h5>Model Information</h5><div class="row"><div class="input-field col s4">';
    modalHTML.push(nextline);
    
    //postponing the first <select> until I have written a good directory-style select library
    
    return modalHTML; //this is for debugging only!
}