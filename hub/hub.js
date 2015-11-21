hub = new Object();

hub.info = {
    
    //This contains info on what the latest release is, so people can check for updates automatically.
    release : {
        stable : 0.0,
        dev : 0.0,
    },
    
    //This contains any important information
    feed : {
        alert : undefined,
        poll : {title : "User Poll", description : "This is a poll created...because polls.", url : "http://strawpoll.me/"}
    }
}

hub.ui = new Object();

hub.ui.update = function() {
    var html = [
        ""
    ]
}

hub.pushNotification(toast, duration) {
    Materialize.toast("<i class='material-icons left'>info</i>" + toast, duration)
}