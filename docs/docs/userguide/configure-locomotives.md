# Setting up your Locomotive Roster (unfinished)

Since locoThrottle.js needs quite a bit of information about a locomotive to accurately simulate its physics, we must get additional data about the locomotive that isn't on the JMRI roster. This includes everything from weight, to horsepower, to fuel consumption data.

We also need data on the model, including DCC decoder information (for accurately simulated sounds), and gearing information for the model (so we can run it at the correct speed in scale MPH)

**In all, we need 3 key things for any locomotive:**

- **Model Information:** This links specific DCC speed values to specific speeds in scale MPH. This is what makes sure the locomotive is going at the correct scale speed.

- **Decoder Information:** This tells the program everything about how your DCC decoder behaves. All decoders have basic support, which includes speed, direction, and lighting, but if you want sound your decoder must be specifically supported.

- **Prototype Information:** This tells the physics simulator everything it needs to know about the prototype locomotive. This data is what's responsible for accurately simulating the behavior of the real thing.

---

To tell locoThrottle.js the correct combination of those three items for one of your locomotives, we employ ``bundles.json``. This file contains a series of "bundles" that link model and prototype information to a given JMRI roster entry. locoThrottle.js grabs the decoder information straight from the roster. (Handy, huh?)

Right now, we don't have a pretty graphical tool for editing ``bundles.json``. This means you'll have to edit it yourself on your JMRI PC, or whatever you're hosting locoThrottle.js on.

## Setup

``bundles.json`` contains a single object, written in JSON format. This object contains a child object for each locomotive.

---

### Editing ``bundles.json`` for Dummies

**If you've never edited JSON before, read this guide.** If you're a developer, you should save yourself some time and [read the developer's version below.](#editing-json-for-developers)

1. **In your locoThrottle.js installation directory, go to ``/bundles``.** If you followed our recommended installation method, your directory would be ``/web/locoThrottleJS/bundles`` inside your JMRI install folder.

2. **Open ``bundles.json`` with your text editor of choice.**

    - If you don't have a text editor with syntax highlighting (for example, if you're using Notepad in Windows) I highly recommend using a better one for this. I personally ([k4kfh@github](http://github.com/k4kfh)) use [Brackets](http://brackets.io), but you can take your pick.
    
3. Find the beginning of the ``bundles`` object. This is usually marked by ``bundles = {``.

4. Stop here. This tutorial is unfinished.

---

### Editing JSON for Developers

**This tutorial is shortened for people who already know/understand JSON syntax.**

