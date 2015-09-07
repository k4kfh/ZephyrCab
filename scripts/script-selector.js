//this function is called when we need to select our prototype.json, decoder.js, model.js, and other scripts
function selScript(type, filename) {
    if (type == "prototype") {
        //selecting prototype.json file
        var scriptFullPath = "prototypes/" + filename
        debugToast("prototype.json path found to be " + scriptFullPath, 4000)
        document.getElementById("prototypejson").src = scriptFullPath
        
    }
    if (type == "decoder") {
        var scriptFullPath = "decoders/" + filename
        debugToast("decoder.js path found to be " + scriptFullPath, 4000)
        document.getElementById("decoderjs").src = scriptFullPath
    }
    else if (type == "model") {
        var scriptFullPath = "models/" + filename
        debugToast("model.js path found to be " + scriptFullPath, 4000)
        document.getElementById("modeljs").src = scriptFullPath
    }
}

var decoderJSstatus
var modelJSstatus

function scriptLoaded(scriptname) {
    if (scriptname == "decoderjs") {
        if (modelJSstatus == true) {
            //set button to disabled
            document.getElementById("loadScript-decoderandmodel").addClass = "disabled"
            document.getElementById("loadScript-decoderandmodel").value = "Scripts Loaded!"
            
            debugToast("Both model.js and decoder.js are loaded now.", 4000)
        }
        decoderJSstatus = true
    }
    if (scriptname == "modeljs") {
        if (decoderJSstatus == true) {
            //set button to disabled
            document.getElementById("loadScript-decoderandmodel").addClass = "disabled"
            document.getElementById("loadScript-decoderandmodel").value = "Scripts Loaded!"
            
            debugToast("Both model.js and decoder.js are loaded now.", 4000)
        }
        modelJSstatus = true
    }
}