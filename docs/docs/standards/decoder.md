# Decoder Constructor: Official Standards

Decoder objects are actually constructor functions that, when called, will create an object in the ``train`` object capable of controlling the DCC decoder in a decoder-agnostic way. This is not to be confused with ``jmri.throttle`` objects, which control the decoder at a lower level.

## Basics:

- All decoder objects are located in subobjects of the ``decoders`` object.

- The ``decoders`` object is located in ``decoders.js``, which is in ``/cfg``.

- The decoders are sorted using the same system JMRI uses: ``decoderFamily`` and ``decoderModel``.

- Each ``decoderFamily`` is a subobject of ``decoders``, and ``decoderModel`` objects are the subobjects of the families that contain the actual constructor functions. Both subobjects should match the corresponding values from JMRI *exactly*.

## Location

The main ``decoders`` object contains all the decoder constructors. This object is located in ``/cfg/decoders.js``. It is already added by default to ``index.html``, there is no need to add a ``<script>`` tag or anything of that nature. It is designed to "just work" with minimal effort required to add decoders.

This file can be redownloaded in the event of an accident from the [ZephyrCab GitHub.](http://github.com/k4kfh/ZephyrCab) This should rarely happen, especially when used with a proper editor. Something that supports collapsible objects (such as [Brackets](http://brackets.io)) should work quite well for this.

## Object Structure

The structure of ``decoders`` is hierarchical. It works like so:

```
decoders ---> decoderFamily ---> decoderModel
```

``decoderFamily`` and ``decoderModel`` are both strings. For the program's automatic decoder selector to work correctly, these must *exactly* match the strings stored in the JMRI roster. They *are* case sensitive!

## Constructor Contents

So now that you know where to find the constructor for a specific decoder, you're probably wondering what these complex constructors have inside them.

Every constructor should have the same functions. Even if your decoder does not support a certain feature, you should put the functions in the constructor (just make them dummy functions). This modular approach means we don't have to deal with variables being undefined; we can just call a function and know that (if standards are being followed) then the decoder will cooperate.

The bullet list hierarchy below shows the standard contents of a decoder constructor object. Keep in mind that when writing these functions, you will need to make use of JavaScript's ``this`` variable to make the structure apply to the object being created.

---

### Structure

- ``f``
    - ``horn``
        - ``set()``
        - ``state``
    - ``bell``
        - ``set()``
        - ``state``
    - ``compressor``
        - ``set()``
        - ``state``
    - ``airdump``
        - ``set()``
        - ``state``
    - ``dynbrakes``
        - ``set()``
        - ``state``
    - ``engine``
        - ``set()``
        - ``state``
    - ``notch``
        - ``up()``
        - ``down()``
- ``speed``
    - ``set()``
    - ``state``

---

Do not forget that **all decoder objects must contain every standard function, and should not contain any non-standard functions.** If the decoder object structure becomes nonstandardized, the useful modularity of ZephyrCab is lost.

The reason it is built like this is to allow support for everything from generic DCC decoders to the best sound decoders in the world. The ``decoders`` object provides a "layer" that makes the rest of ZephyrCab decoder agnostic, so it is important that standards are followed.

---

## Function Logic

Obviously since we're talking about constructor functions here, they're not just variables, they perform tasks. Your decoder constructor function will be called by the train builder UI when a user adds a locomotive with the corresponding decoder to their train.

## Arguments

**ALL decoder constructors must accept the following arguments:**

- ``address``

- ``trainPosition``

No function should accept any additional arguments, as this will only cause problems.

## Tasks

So what exactly should this function do?

Here is a summary of the tasks a decoder constructor must perform.

---

- Create all the necessary objects for DCC functions

- Call ``jmri.throttle`` to create a throttle object for the new train element (see the example below for an implementation)

---

## Example Object

An example ``decoders`` object is shown below, with annotations.

```javascript
decoders = {
    //This is the decoder family attribute from JMRI's roster
    "ESU LokSound Select":{
        //This is the decoderModel attribute from JMRI's roster
        "LokSound Select EMD 567" : function(address, trainPosition) {
            //ESU LokSound Select V4
            //decoder object for ESU official EMD 567 Sound project
            //By Hampton Morgan - k4kfh@github - May 2015
            //evilgeniustech.com
            train[trainPosition].throttle = new jmri.throttle(address, trainPosition) //we use the train position as the throttle name for future lookup purposes
            
            //FUNCTIONS
            this.f = new Object();
            //bell
            this.f.bell = new Object();
            this.f.bell.set = function(state) {
                train[trainPosition].throttle.f.set(1, state)
                train[trainPosition].dcc.f.bell.state = state;
            }
            this.f.bell.state = false;
                
            //horn
            this.f.horn = new Object();
            this.f.horn.set = function(state) {
                train[trainPosition].throttle.f.set(2, state)
                train[trainPosition].dcc.f.horn.state = state;
            }
            this.f.horn.state = false;
                
            //compressor
            this.f.compressor = new Object();
            this.f.compressor.set = function(state) {
                train[trainPosition].throttle.f.set(20, state)
                train[trainPosition].dcc.f.compressor.state = state;
            }
            this.f.compressor.state = false;
                
            //air release
            this.f.airdump = new Object();
            this.f.airdump.set = function(state) {
                    
            }
            this.f.airdump.state = false;
                
            //dyn brake fans
            this.f.dynbrakes = new Object();
            this.f.dynbrakes.set = function(state) {
                    
                }
            this.f.dynbrakes.state = false;
                
            //engine on/off
            this.f.engine = new Object();
            this.f.engine.set = function(state) {
                train[trainPosition].throttle.f.set(8, state)
                train[trainPosition].dcc.f.engine.state = state;
            }
            this.f.engine.state = false;
                
            //notch up
            this.f.notchup = new Object();
            this.f.notchup.set = function(state) {
                    
            }
            this.f.notchup.state = false;
                
            //notch down
            this.f.notchdown = new Object();
            this.f.notchdown.set = function(state) {
                    
            }
            this.f.notchdown.state = false;
                
            
            //SPEED SETTING
            this.speed = new Object();
            this.speed.state = 0;
            this.speed.set = function(speed) {
                train[trainPosition].throttle.speed.set(speed)
                train[trainPosition].dcc.speed.state = speed;
            }
            this.speed.setMPH = function(mph) {
                var speed = train[trainPosition].model.speed(mph)
                train[trainPosition.dcc.speed.set(speed)]
            }
                
                
        }
    }
}
```