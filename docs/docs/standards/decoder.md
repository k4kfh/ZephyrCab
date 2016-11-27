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
    - ``headlight``
        - ``set()``
        - ``state``
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
        - ``state``
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

- Call ``jmri.throttle`` to create a throttle object for the new train element. Please make sure to use ``jmri.throttleName.generate()`` as your throttle name argument. This makes sure every throttle has a unique name; a JMRI requirement. (see the example below for an implementation)

---

## Example Object

An example ``decoders`` object is shown below, with annotations.

This example is a GitHub Gist, so feel free to contribute if you see fit. You may also use any of this code in your own ``decoder`` objects; it is totally open for anyone to use.

<script src="https://gist.github.com/k4kfh/beb7341004ff95bf277a.js"></script>