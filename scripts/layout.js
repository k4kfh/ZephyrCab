/*
LAYOUT.JS - A future home for more advanced layout controls

Currently, this file only holds one thing: the track power status fetch function. Eventually, I plan to add operations control and turnout control here, or I might just combine this with my homemade JMRI library. Either way, here we are currently.
*/
layout = {
    power: {
        //Gets layout power status from jmri object, then updates the checkbox
        fetch: function () {
            var status = jmri.trkpower.state
            $("#jmri.trkpower").checked = status;
        }
    }
}