stats = {
  data : {

  },
  updateData: function() {
    stats.data = {
      "username" : cfg.anomyousDataUsername,
      "browser" : {
        productSub: navigator.productSub,
        vendor: navigator.vendor,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
      },
      "cfg" : cfg,
      "roster" : jmri.roster.entries,
    }
  },
  send : function() {
    log.stats("Sending usage data (you can disable this in /cfg/settings.json)")
    stats.updateData();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://zephyrcab-stats.evilgeniustech.com:1189", true);
    /*
    fun fact, for anyone who is far enough into the code that they're reading this:
    there are two reasons I used TCP 1189 as the port for the stats server:
    (a) I needed an arbitary port that was sufficiently obscure so as to not interfere with other things
    (b) The idea for ZephyrCab originally came to me in the cab of Wabash F7-A #1189

    For anyone concerned about privacy, I do NOT give this data to any third parties. I'm not using it for ad revenue or anything. I'm using it to figure out what kind of user base I have so I can tailor the program to that.

    For the technically minded, the server end of this little stunt is just a simple NodeJS app that pretties up the JSON, timestamps it, adds a public IP address (purely for rough geolocation) and writes that to a JSON log file.
    */
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(JSON.stringify(stats.data))
  }
}
