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
