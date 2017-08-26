![ZephyrCab Logo](http://i.imgur.com/n07xxtI.png)

---

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
    
9. **Configure ``bundles.json`` with your locomotive roster and DCC decoder information.** This requires some knowledge of JSON syntax, and I am in the process of rewriting docs for this. Currently, the only supported locomotive is the EMD F7-A. For now, [click here to  learn how to set this up.](userguide/configuring-bundles-json/)



Once you have your ``bundles.json`` set up, you should be able to use the program normally. Connect to your JMRI PC (if you don't know the IP, you will need to find that) using the "Connection" tab, and everything should work. If you run into problems, post an issue on [the project's GitHub page](http://github.com/k4kfh/ZephyrCab).