# Developer Quick Reference

This contains a few useful bits of information for developers, mostly standard functions/objects.

# DCC Decoder Standard Methods

Decoders are created using the ``new`` keyword, and when created they should also create a ``jmri.throttle`` object for themselves. You can use the code below to create a throttle object:
```
train.all[trainPosition].throttle = new jmri.throttle(address,jmri.throttleName.generate());
//the jmri.throttleName.generate() just creates a name based on the position of the element in the train.
```

Each decoder object should also contain the following code to handle speed:
```
this.speed = {};
this.speed.state = 0;
this.speed.set = function (speed) {
    train.all[trainPosition].throttle.speed.set(speed);
    train.all[trainPosition].dcc.speed.state = speed;
};
this.speed.setMPH = function (mph) {
    var speed = train.all[trainPosition].model.speed(mph);
    train.all[trainPosition].dcc.speed.set(speed);
};
```

Finally, all decoder objects must have an ``f`` object for various functions. It _must_ contain the following hierarchy, which is written in pseudo-JSON:
```
//All the functions, mostly sounds
f : {
    headlight : {
        set : function( Boolean state),
        state : Boolean state,
    },
    bell : {
        set : function ( Boolean state ),
        state : Boolean state,
    },
    horn : {
        set : function ( Boolean state ),
        state : Boolean state,
    },
    compressor : {
        set : function ( Boolean state),
        state : Boolean state,
    },
    airDump : {
        set : function ( Boolean state ),
        state : Boolean state,
    },
    dynBrakes : {
        set : function ( Boolean state ),
        state : Boolean state,
    },
    engine : {
        set : function ( Boolean state ),
        state : Boolean state,
    },
    notch : {
        up : function(),
        down : function(),
        state : Integer[0-8],
    },
},
```