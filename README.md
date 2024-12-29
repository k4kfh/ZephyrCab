[![ZephyrCab Logo](http://i.imgur.com/n07xxtI.png)](http://k4kfh.github.io/ZephyrCab)

# Project Status:
> I am no longer actively maintaining this project (as of 2024), due to a lack of public interest and my own movement away from the hobby (for now...it probably won't last). If you are interested in picking up the project, please get in touch with me via GitHub.
> - Hampton

For information on the underlying physics math I used, please see: [*The Idiot's Guide to Railroad Physics*](http://k4kfh.github.io/idiotsGuideToRailroadPhysics)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

ZephyrCab is a web app that simulates prototypically accurate controls for model trains, built on the JMRI model train control software.


# Quickstart Guide

ZephyrCab is ready for you to test drive! It is fairly early in development, so if you run into issues please hop in the Gitter chat and I will help you out.

[![Join the chat at https://gitter.im/k4kfh/LocoThrottleJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/k4kfh/LocoThrottleJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Prerequisites

- **A DCC layout connected to JMRI.**

No seriously. That's it.

## Installation

The screenshots below are from a machine running Linux, so they may look a little different, but the procedure will be essentially the same for Windows, Mac, and Linux.

1. [**Download the latest ZephyrCab release here.**](https://github.com/k4kfh/ZephyrCab/archive/master.zip)
2. **Find your JMRI profile directory.** You can do this by opening JMRI and clicking Help > Locations, as shown below.

    ![](http://imgur.com/enSiiful.png)

3. **Open your JMRI profile directory.** You can just click "Open profile location" from inside the JMRI Locations dialog. In my case, my profile directory was ``/home/hampton/.jmri/My_JMRI_Railroad``, but yours may be a little different.

    ![](http://imgur.com/HwbhQ8nl.png)

4. **Create a folder called ``web`` inside the profile location.** Your system may already have this folder, but if it doesn't, just make a new folder called ``web``.

    <br>
    
    ![](http://imgur.com/TqVgcEbl.png)

5. **Extract the ZephyrCab download into the ``web`` folder.** When you downloaded ZephyrCab, you should have gotten a ZIP file, so just extract its contents into ``/wherever/your/JMRI/profile/is/web``.

6. **Rename the folder to ``zephyrcab``.** This step is technically optional, but makes things easier, so I recommend it.

7. **If you haven't used it before, start your JMRI web server.** You can do this in Edit > Preferences > Web Server. Check the box for "Start automatically with application".

    ![](http://i.imgur.com/5R3EMtE.png)
    
8. **Open your ZephyrCab in a web browser.** Google Chrome is officially supported, though Firefox will probably work. No promises otherwise.
    - If you're opening it from your JMRI machine, you can just use [``http://localhost:12080/web/zephyrcab``](http://localhost:12080/web/zephyrcab)
    - Otherwise, the URL will be ``http://your-jmri-ip-address:12080/web/zephyrcab`` if you've followed this guide correctly.
    - If you don't know your JMRI PC's IP address, [click here to learn how to find it.](http://www.howtogeek.com/236838/how-to-find-any-devices-ip-address-mac-address-and-other-network-connection-details/) It will probably be in the form ``192.168.1.something`` or ``172.16.something.something``, but could be different.
    
9. **Create bundles for your locomotives.** Bundles are the small data files that tell ZephyrCab all the physics information about your locomotive. They also bind it to an actual model on your JMRI roster. You'll need to create a new bundle for your first locomotive, which will probably require a data sheet for information like weight, tractive effort, and horsepower. The "Setup" page within ZephyrCab has an easy tool for creating bundles.

10. **Install your bundles.** Once you've created and downloaded the bundle files, you'll need to place them in the ``/cfg/bundles`` folder within ZephyrCab. You _also_ need to add the file names to the ``/cfg/bundles.list.json`` file, otherwise ZephyrCab won't know to load them. So for example, if I created a bundles file called ``BN1379.zephyrcab``, I would first place it in the ``/cfg/bundles`` folder. Then I would edit the list at the bottom of ``bundles.list.json`` to look like this.

```javascript
bundles.files = [
    "BN1379.zephyrcab",
]
```

Once you get your bundles set up, ZephyrCab should be ready to go. Simply go to the "Train Settings" tab and add your locomotive/cars. Note that some locomotives have more advanced sound support than others (for example, ZephyrCab knows how to use the prime mover manual notching feature on certain ESU decoders). All decoders will work, but you may only get speed/direction/lighting control on decoders that I haven't had a chance to properly code for yet. If you run into problems, post an issue on [the project's GitHub page](http://github.com/k4kfh/ZephyrCab), or join the support chat [on Gitter](https://gitter.im/k4kfh/ZephyrCab).

## Additional Help

Please see [the ZephyrCab documentation](http://k4kfh.github.io/ZephyrCab/docs/site) for more detailed information on configuration tasks such as setting up automatic connection, adding locomotives, tweaking brake system defaults, and other options. You can also ask questions by creating an issue on GitHub, or [joining the Gitter chat.](https://gitter.im/k4kfh/ZephyrCab)

## Built With

* [MaterializeCSS](http://materializecss.com)
* [jQuery](http://jquery.com)
* [JMRI](http://jmri.org)
* [mkDocs](http://www.mkdocs.org/)
* [mkDocs Material Theme by squidFunk](http://squidfunk.github.io/mkdocs-material/)

## Contributing

Any and all contributions are welcome. I am working on better documentation for contributors, but in the meantime feel free to make an issue if you have questions about contributing.

## Acknowledgments

Hats off to:
- [Mr. Bruce Kingsley](http://brucekmodeltrains.com), for _incredible_ help and insight on the physics
- Mr. Al Krug, for excellent reading material, particularly on railway brakes
- [JMRI](http://jmri.org), for the excellent JSON/WebSockets API that makes this project possible
- [MaterializeCSS](http://materializecss.com), for a wonderful free Material Design CSS framework
