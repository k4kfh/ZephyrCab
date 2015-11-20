# Setting up your Locomotive Roster

Since locoThrottle.js needs quite a bit of information about a locomotive to accurately simulate its physics, we must get additional data about the locomotive that isn't on the JMRI roster. This includes everything from weight, to horsepower, to fuel consumption data.

We also need data on the model, including DCC decoder information (for accurately simulated sounds), and gearing information for the model (so we can run it at the correct speed in scale MPH)

**In all, we need 3 key things for any locomotive:**

- **Model Information:** This links specific DCC speed values to specific speeds in scale MPH. This is what makes sure the locomotive is going at the correct scale speed.

- **Decoder Information:** This tells the program everything about how your DCC decoder behaves. All decoders have basic support, which includes speed, direction, and lighting, but if you want sound your decoder must be specifically supported.

- **Prototype Information:** This tells the physics simulator everything it needs to know about the prototype locomotive. This data is what's responsible for accurately simulating the behavior of the real thing.

---

To tell locoThrottle.js the correct combination of those three items for one of your locomotives, we employ ``bundles.json``. This file contains a series of "bundles" that link model and prototype information to a given JMRI roster entry. locoThrottle.js grabs the decoder information straight from the roster. (Handy, huh?)

Right now, we don't have a pretty graphical tool for editing ``bundles.json``. This means you'll have to edit it yourself on your JMRI PC, or whatever you're hosting locoThrottle.js on.

## Basics

``bundles.json`` contains a single object, written in JSON format. This object contains a child object for each locomotive.

---

## Editing ``bundles.json`` for Dummies

**If you've never edited JSON before, please don't try to set up this file on your own.** Visit the gitter chat and ask one of the developers to help you. I, [k4kfh@github](http://github.com/k4kfh), will always try my best to help you get this running. I know this can be a daunting task, and I'm working on an automated tool for this, but there are other things I have to get done first.

---

## Editing JSON for Developers

**This tutorial is shortened for people who already know/understand JSON syntax.**

- **Open ``bundles.json`` from the `/bundles` directory of your install folder.**

- You should use a syntax-highlighting capable editor for the best experience with this. This JSON object can become rather lengthy, so an editor that supports collapsibles (such as [Brackets](http://brackets.io)) is highly recommended even for developers.

<br/>

#### ``bundles`` object syntax:

The ``bundles`` object is structured in a simple way. It contains a number of subobjects, each named with the roster entry name they represent. For example, I might have a roster entry called "BN 1776". In ``bundles``, that would be represented with:

```javascript
"BN 1776":{"someString":"someValue"}
```

You can have as many of these entries as you want, but make sure you do not have any duplicate entries. There is currently no method in place for having multiple ``bundles`` objects for one locomotive, so be sure you only have one for each.

<br/>

#### What's inside the entries?

By now, you're probably wondering what exactly is inside of the value for a ``bundles`` object. Below is a structure chart that shows, at a high level, what's in there. You'll have to see the standards pages for some objects to see which objects contain which things, and some may not be documented yet due to rapidly progressing development. Bear with us!

Each object is structured like this:

---

- ``"myRosterEntry"`` - This *must* match the name in JMRI exactly (spaces and all) or it will not work!
    - ``model``
        - This will contain a sub-object that takes in a speed in MPH (from the physics engine) and calculates a speed in speed steps. This varies among locomotives due to gearing, so the best way to find out is to test your locomotive with a scale speedometer and see if you can build an equation that scales it automatically.
    - ``prototype``
        - This will contain an entire prototype object, which is in the process of being standardized now.
        
---

See the comments in the code sample below for explanations.

```javascript
"myRosterEntry":{
    model:{
        /*
        This will contain a function that takes in a speed in MPH and converts it to a speed in % for your locomotive. The exact structure of this object is still up in the air a little bit, so it's not documented here until it's finalized.
        */
    },
    
    prototype:{
        /*
        This will contain an entire prototype object. You can see what's included in the prototype object standards by visiting Standards > prototype Objects on the docs.
        */
    }
}
```

