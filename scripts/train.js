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

train.ui.buildPalette = function() {
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