[![ZephyrCab Logo](http://i.imgur.com/n07xxtI.png)](http://k4kfh.github.io/ZephyrCab)

*Formerly locoThrottle.js*

* [Visit Main Project Site](http://k4kfh.github.io/ZephyrCab)
* [Project Documentation](http://k4kfh.github.io/ZephyrCab/docs/site)
* [Development Blog](http://blog.evilgeniustech.com)
* [*The Idiot's Guide to Railroad Physics*](http://k4kfh.github.io/idiotsGuideToRailroadPhysics)

[![Join the chat at https://gitter.im/k4kfh/LocoThrottleJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/k4kfh/LocoThrottleJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

ZephyrCab is a web app that simulates prototypically accurate controls for model trains, built on the JMRI model train control software.

> Note: This project is still heavily under development. It is not recommended to try to use the project unless you are the adventurous type, and/or you understand JavaScript/JSON and are willing to tinker.
>
> Read more on [my blog.](http://zephyrcab.tumblr.com)

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

The screenshots below are from a machine running Linux, so they may look a little different, but the procedure will be essentially the same for Windows, Mac, and Linux.

1. [**Download the latest ZephyrCab release here.**](https://github.com/k4kfh/ZephyrCab/releases)
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

## Configuring

Please see [the ZephyrCab documentation](http://k4kfh.github.io/ZephyrCab/docs/site) for detailed information on configuration tasks such as setting up automatic connection, adding locomotives, tweaking brake system defaults, and other options.

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
