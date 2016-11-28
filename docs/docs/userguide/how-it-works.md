# How ZephyrCab works

![](http://i.imgur.com/1cMqe2G.png)

ZephyrCab ties sophisticated layout control through JMRI with a built-from-scratch physics engine to create realistic controls and behavior for your models. Unfortunately, many of the features listed here are still unstable, or lack proper documentation. Please make an issue on GitHub or join the Gitter chatroom if you have questions.

[![Join the chat at https://gitter.im/k4kfh/LocoThrottleJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/k4kfh/LocoThrottleJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## DCC Decoders

ZephyrCab has an internal abstraction layer for DCC decoder functions, making it easy to support advanced features like manual notching sounds on a variety of DCC decoders. This means that if the air compressor is F21 on a LokSound, and F17 on a Tsunami (making this up) then we can solve that difference in software and both decoders will function just fine.

Unfortunately, this means your decoder _must_ be supported by the abstraction layer. Check the Supported Decoders list to see if your decoder is currently supported.

_Have a decoder you want supported? Building a decoder object simply requires basic JavaScript skills, and helps improve the project dramatically. Make an issue on GitHub for more information!_

## Models

_This feature is still unstable. Scale speed is simply set in DCC speed steps right now. I hope to fix this soon!_

In order to accurately mimic scale speed, ZephyrCab must have a "speed table" for your model.

## Prototype Information

ZephyrCab utilizes a laundry list of data from the prototype locomotive to create a realistic simulation of the locomotive's behavior. These values are stored in JavaScript Objects (JSON), and are each linked to a JMRI roster entry. For more information see [Configuring Locomotives in ``bundles.json``.](/userguide/configuring-bundles-json/)

## Developer Information

- **Layout Communication:** ZephyrCab uses [JMRI's JSON WebSockets server](http://jmri.sourceforge.net/help/en/html/web/JsonServlet.shtml) to communicate with your layout. Any JMRI-connected layout is compatible. Low-level communication is handled in ``scripts/websockets.js`` and higher-level JMRI tasks are handled in ``scripts/jmri-core.js``.
- **DCC Decoders:** ZephyrCab has its own abstraction layer for common DCC decoder functions, allowing support for a wide range of decoders, including advanced features like manual notching. This is handled in ``decoders.js``.
- **Physics Simulation:** ZephyrCab's physics engine is built from scratch. At this time it is unfinished, though I am making progress. It is found in ``scripts/sim.js``.
- **UI CSS/JS Backend:** MaterializeCSS is used for the majority of the UI, with some small modifications and custom scripts. jQuery is used extensively.