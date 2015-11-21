transition = new Object();
transition.slideIn = new Object();
transition.slideIn.x = function(selector, durationARG, startPosition) {
    
    //Make sure opacity is set to 0
    $(selector).css("opacity", 0)
    
    //Make sure it's unhidden
    $(selector).show();
    
    //If duration isn't specified
    if (durationARG == undefined) {
        durationARG = 800;
    }
    //If start position isn't specified, revert to default
    if (startPosition == undefined) {
        startPosition = "-500px";
    }
    
    var time = 0;
    $(selector).velocity(
        { translateX: startPosition},
        { duration: 0 });

    $(selector).velocity(
        { opacity: "1", translateX: "0"},
        { duration: durationARG, delay: time, easing: [60, 10] }
    );
    time += 120;
  };

transition.slideIn.y = function(selector, durationARG, startPosition) {
    
    //Make sure opacity is set to 0
    $(selector).css("opacity", 0)
    
    //Make sure it's unhidden
    $(selector).show();
    
    //If duration isn't specified
    if (durationARG == undefined) {
        durationARG = 800;
    }
    //If start position isn't specified, revert to default
    if (startPosition == undefined) {
        startPosition = "-500px";
    }
    
    var time = 0;
    $(selector).velocity(
        { translateY: startPosition},
        { duration: 0 });

    $(selector).velocity(
        { opacity: "1", translateY: "0"},
        { duration: durationARG, delay: time, easing: [60, 10] }
    );
    time += 120;
  };

wiggleDownArrow = function() {
    $("#downarrow").animate({'padding-top':10}, 300);
    setTimeout(function() {$("#downarrow").animate({'padding-top':0}, 400);}, 350);
}

upDownArrow = function() {
    $("#downarrow").animate({'padding-top':0}, 400);
}

downDownArrow = function() {
    $("#downarrow").animate({'padding-top':10}, 300);
}