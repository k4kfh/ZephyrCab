---
title: API Reference

language_tabs:
  - javascript

toc_footers:
  - <a href='http://evilgeniustech.com'>EvilGeniusTech Blog</a>
  - <a href="http://github.com/k4kfh/LocoThrottleJS" target="_blank">locoThrottle.js on GitHub</a>

includes:

search: true
---

# Introduction

Welcome to the locoThrottle.js docs!

# Interfacing with JMRI

## The ``jmri`` Object - Introduction

The ``jmri`` object is responsible for interfacing the rest of the program to your layout via JMRI. It communicates using JMRI's WebSockets JSON service, described [here](http://jmri.sourceforge.net/help/en/html/web/JsonServlet.shtml).

## WebSockets Basics

The code for this is spread amongst two files:

* ``jmri-core.js``
* ``websockets.js``

Naturally, most of the code to do with lower level WebSockets stuff (like connecting, sending raw JSON commands, etc) is in the ``websockets.js`` file. In contrast, most of the code dealing with application-level things, such as the JMRI roster, is contained in ``jmri-core.js``.

### Connecting to JMRI

> The IP address or hostname must be a string, but the port can be a normal JavaScript number.

```javascript
var jmriAddress = "192.168.1.10";
var jmriPort = 12080;

connect(jmriAddress, jmriPort);
```

Connecting to your JMRI PC is very simple. There is a function called ``connect()`` which accepts two arguments:

* ``ip`` - This is the IP address (or hostname; that works too)
* ``port`` - This is whatever port your JMRI web server is running on. The default is 12080, but you can use whatever you want.

This function should not be dealt with by other developers. This should only be dealt with from the "Connection" page within locoThrottle.js, which provides an easy, simple GUI to connect to your layout with. The only reason this function is documented is for reference.


### Sending Commands

> We have to have this variable as a string or it will break things. You should stringify your object if you have an actual object.
> It's also very important to make sure the string contains double quotes. JMRI will return an error complaining that you didn't use double quotes if you try and use ' instead of ", and you'll be unhappy.

```javascript
var someCommand = '{"list":"trains"}';

sendcmd(someCommand);
```
> Since WebSockets is full-duplex, you can't use it like a question-answer style communication system. This function won't return what the server responds with, because the server could respond with anything at any time. There is a function called processReply() that handles this, so if you need to process a reply, you'll probably be out of luck unless you come make an issue on GitHub.

Sending commands in raw JSON is very simple. It is handled by the ``sendcmd()`` function, which behaves similar to the ``ws.send()`` function, but also adds easy errors and user alerts when the connection has problems.

``sendcmd()`` accepts 1 argument: a JSON object, as a string.


## JMRI Roster Basics

locoThrottle.js provides a number of ways for interfacing with the JMRI roster. It also automatically kept up-to-date via the WebSockets service, so if you request roster data it will automatically be fed into all the roster variables and objects.

> Option 1 - Array of entry objects
> An example of this can be seen below.

```json
[
  {
    "type": "rosterEntry",
    "data": {
      "name": "CBQ2",
      "address": "2",
      "isLongAddress": false,
      "road": "Chicago, Burlington, and Quincy",
      "number": "2",
      "mfg": "Bachmann Trains",
      "decoderModel": "LokSound Select EMD 567",
      "decoderFamily": "ESU LokSound Select",
      "model": "",
      "comment": "This is the sound equipped CB&Q loco",
      "maxSpeedPct": "100",
      "image": null,
      "icon": null,
      "shuntingFunction": "",
      "functionKeys": [
        {
          "name": "F0",
          "label": "Light",
          "lockable": true,
          "icon": null,
          "selectedIcon": null
        }
      ]
    }
  }
]
```

> We removed the rest of the function array (above) because it is excessively long, and you'd better get the idea anyway.

> Option 2 - Object with sub-objects for each roster entry. This is for the same roster entry as the previous example, and as you can see the name of its sub-object is the name of the roster entry, which is the string ``"CBQ2"``.

```json
{
"CBQ2":{
      "name": "CBQ2",
      "address": "2",
      "isLongAddress": false,
      "road": "Chicago, Burlington, and Quincy",
      "number": "2",
      "mfg": "Bachmann Trains",
      "decoderModel": "LokSound Select EMD 567",
      "decoderFamily": "ESU LokSound Select",
      "model": "",
      "comment": "This is the sound equipped CB&Q loco",
      "maxSpeedPct": "100",
      "image": null,
      "icon": null,
      "shuntingFunction": "",
      "functionKeys": [
        {
          "name": "F0",
          "label": "Light",
          "lockable": true,
          "icon": null,
          "selectedIcon": null
        },
        {
          "name": "F1",
          "label": "Bell",
          "lockable": true,
          "icon": null,
          "selectedIcon": null
        },
        {
          "name": "F2",
          "label": "Horn",
          "lockable": false,
          "icon": null,
          "selectedIcon": null
        },
        {
          "name": "F3",
          "label": "Coupler Sound",
          "lockable": true,
          "icon": null,
          "selectedIcon": null
        },
      ]
    }
}
```

## Roster Objects

There are two ways you can access the roster in locoThrottle.js, both of which are exemplified to the right:

1. An array of objects, just as it is provided by JMRI, stored in the array ``jmri.roster.raw``.

2. An object with sub-objects for each roster entry, with the roster entry name as the key. This is stored in the object ``jmri.roster.reformat``.

Both of these options are acceptable, and which one is best is highly dependent on your use case. Both options are kept automatically up-to-date by the WebSockets reply processor, so there's really no wrong way to go here.

## Roster Functions

There are several functions built into the ``jmri.roster`` object that make dealing with roster data much easier. Each is listed below, with an explanation, and code samples.

```javascript
var criteria = {"decoderFamily":"Magic DCC Decoder Family That Doesn't Exist"}

//We must be connected to JMRI before we run this, or there will be no roster data to check it against.
matchingEntries = jmri.roster.matchProperty(criteria)

console.log(matchingEntries)
//Would log an array of roster entry names that matched, for example:
//matchingEntries = ["Magical Locomotive That Doesn't exist", "Another Matching One's name"]
//So jmri.roster.reformat["Another Matching One's name"]["decoderFamily"] would yield "Magic DCC Decoder Family That Doesn't Exist" in this use case.
```

### ``jmri.roster.matchProperty(property)``

This function is used to look up roster entries with a specific property. It was created with the purpose of matching DCC decoder information to specific roster entries, but it accepts any property argument so it can be useful in a variety of scenarios.

### Arguments:

* ``property`` - This is a roster entry property as a JavaScript object. It is very important that this object is NOT stringified; if you stringify then the function will not work!

### Returns:

* An array of roster entry names that have matching properties. For example, if you looked up a property and both ``"CBQ2"`` and ``"Challenger #3985"`` have matches, the function would return ``["CBQ2", "Challenger #3985"]``.



