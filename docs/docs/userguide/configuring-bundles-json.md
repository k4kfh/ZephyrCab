# Adding your locomotives with ``bundles.json``

ZephyrCab requires a substantial amount of information for each locomotive in order to produce an accurate simulation. Everything from weight, horsepower, length, drivetrain efficiency, and more is taken into account. It also requires information on DCC decoder functions to produce the correct sound/lighting on your model, and a speed table for your model to produce scale speeds*.

## What's a bundle?

ZephyrCab stores this information in "bundles," which are each linked to a specific roster entry in your JMRI roster. This allows ZephyrCab to easily bind all the required information to a single locomotive on your layout, making it quick and easy to select a locomotive.

## Setting up a locomotive bundle

Bundles are stored in JSON (JavaScript Object Notation). Basic syntax is shown below, and you can [learn more about JSON here.](http://www.w3schools.com/js/js_json_intro.asp)

```json
{
    "item":"value",
    "parent-item": {
        "child":"some string of text",
        "anotherchild":42,
    },
    "some boolean":true,
}
```

As you may have guessed, ``/cfg/bundles.json`` contains all your bundles. However, the information stored here doesn't tell everything. ZephyrCab relies on ``/cfg/decoders.js`` for the DCC decoder abstraction layer, so you'll need to make sure your decoder is supported.

## Example Setup

Here, I'll go through the entire process for adding a locomotive to your ``bundles.json`` file.

Make a copy of your ``bundles.json`` and save it somewhere else in case you need to undo your changes.

**1. Determine if your combination of prototype, model, and DCC decoder are supported.** For this example, I have a Bachmann F7-A with a LokSound Select DCC decoder in it. So my specs are:

- **Model:** Bachmann F7-A
- **Prototype:** EMD F7-A
- **DCC Decoder:** LokSound Select with EMD 567 Sound File

By checking the Supported Locomotives/Decoders table, I confirm my specs are supported.

**2. Create a JSON object with your prototype bundle and your model's JMRI roster name.** You'll need to use a text editor to do this. If you're on Windows, use [Notepad++](https://notepad-plus-plus.org/). If you're not familiar with basic JSON syntax, it would help you to [read this.](http://www.w3schools.com/js/js_json_intro.asp)

The object should be structured like this (remember that lines with ``//`` are comments):

```json
"Your JMRI Roster Entry Name":{
    type:"locomotive",
    model:{
        //Scale speed function. This is a WIP
        speed:function(mph) {
            speed = mph;
            return speed;
        }
    }
    //prototype entry stuff
}
```

Once I add the appropriate information, my code looks like this. I cut off the majority of the prototype code to save space on the page, but you get the idea.

```json

"CBQ2" : { //my JMRI roster name is "CBQ2" (without the quotes)
        type: "locomotive",
        model:{
            speed:function(mph) {
                mph = speed; //totally not correct but it is a functional example
                return speed;
            }
        },
        
        //This begins the actual prototype object, which you'll probably want to copy and paste from one of our supported locomotives, though it is possible to make your own.
        prototype:{
            "builder" : "EMD", //This is displayed to the client and can be anything
            "name" : "F7-A", //This is also displayed to the client and can be anything
            "type" : "locomotive", //This must be "locomotive"
            "weight" : 250000, //Weight of the locomotive in lbs
            "maxHP" : 1500, //Horsepower of the locomotive
            "notchRPM" : [300, 362, 425, 487, 550, 613, 675, 738, 800],
            "notchMaxSpeeds" : [null, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60],
            "engineRunning": 0, //0 or 1 - 1 is on, 0 is off
            fuel : {
                usage : [3.5, 6.5, 14.5, 23.4, 33.3, 45.7, 59.6, 75.3, 93.1], //array in gal/hr, by notch
                capacity : 1200, //fuel tank in GAL
            },
            
            //tons more code in here; I cut it out for readability
        },
    },
    
```

Now we have the code to add to the ``bundles.locomotives`` object.

**3. Add the code to the ``bundles.locomotives`` object, inside ``cfg/bundles.json``.**

This is where it's helpful to know basic JSON syntax. The hierarchy here is something like this:

```json
bundles.locomotives = {
    "Some Roster Entry":{
        //all the information
    },
    "Another Roster Entry":{
        //information
    }
}
```

Just add the code above into your file. Mine looked like this (sample below shows only the top).

```json
bundles.locomotives = {
    "CBQ2" : {
        type: "locomotive",
        model:{
            speed:function(mph) {
                mph = speed; //totally not correct but it is a functional example
                return speed;
            }
        },
        prototype:{
            "builder" : "EMD", //This is displayed to the client and can be anything
            "name" : "F7-A", //This is also displayed to the client and can be anything
            "type" : "locomotive", //This must be "locomotive"
            "weight" : 250000, //Weight of the locomotive in lbs
            "maxHP" : 1500, //Horsepower of the locomotive
```

Now you should be able to load up ZephyrCab and connect to your layout. Once you've connected, a list of whatever roster entries you've added will appear as locomotives you can add to your train. Roster entries you don't set up in ``bundles.json`` will simply be ignored. You should be able to add the locomotive to your train and start driving it. Have fun!

---

If you encounter a problem at any point in this guide, please [make an issue on GitHub](https://github.com/k4kfh/ZephyrCab/issues/new), and I'll be glad to assist you.