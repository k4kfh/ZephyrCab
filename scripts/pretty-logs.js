//This is simply a wrapper to add easy filter keywords to the logs
log = {
    jmri : function(string) {
        console.log("JMRI: " + string)
    },
    websockets : function(string) {
        console.log("WEBSOCKETS: " + string)
    },
    bundles : function(string) {
        console.log("BUNDLES: " + string)
    },
    trainbuilder: function(string) {
        console.log("TRAINBUILDER: " + string)
    },
    ui : function(string) {
        console.log("UI: " + string)
    },
    Ui : {
        gauges : function(string){
            console.log("UI.GAUGES: " + string)
        },
        input : function(string) {
            console.log("UI.INPUT: " + string)
        }
    },
    sim : function(string) {
        console.log("SIM: " + string)
    },
    //in addition to the generic catch-all, there are also subcategories
    Sim : {
        wheelslip : function(string){
            console.log("SIM.WHEELSLIP: " + string)
        },
        brakes: function(string){
            console.log("SIM.BRAKES: " + string)
        },
        tractiveeffort: function(string){
            console.log("SIM.TRACTIVEEFFORT: " + string)
        },
        air: function(string){
            console.log("SIM.AIR: " + string)
        }
    },
    decoder : function(string){
        console.log("DECODER: "+string)
    }
    
}

//dump an initial log message to the console for debugging info
console.info("-----------------------------------------------------")
console.info("  ______          _                 _____      _     ")
console.info(" |___  /         | |               / ____|    | |    ")
console.info("    / / ___ _ __ | |__  _   _ _ __| |     __ _| |__  ")
console.info("   / / / _ \ '_ \| '_ \| | | | '__| |    / _` | '_ \ ")
console.info("  / /_|  __/ |_) | | | | |_| | |  | |___| (_| | |_) |")
console.info(" /_____\___| .__/|_| |_|\__, |_|   \_____\__,_|_.__/ ")
console.info("           | |           __/ |                       ")
console.info("           |_|          |___/                        ")
console.info("-----------------------------------------------------")
console.info("LOGGING KEYWORDS:")
console.info("• JMRI")
console.info("• WEBSOCKETS")
console.info("• BUNDLES")
console.info("• TRAINBUILDER")
console.info("• UI")
console.info("  • UI.GAUGES")
console.info("  • UI.INPUT")
console.info("• SIM")
console.info("  • SIM.WHEELSLIP")
console.info("  • SIM.AIR")
console.info("  • SIM.BRAKES")
console.info("  • SIM.TRACTIVEEFFORT")
console.info("• DECODER")
console.info("-----------------------------------------------------")