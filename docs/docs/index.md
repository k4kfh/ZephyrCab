![ZephyrCab Logo](http://i.imgur.com/n07xxtI.png)

---

# Quickstart Guide

**If you have experience with railway equipment and/or the physics behind it, your knowledge can help improve the software. Please make an account on [GitHub](https://github.com) and [make an issue](https://github.com/k4kfh/ZephyrCab/issues/new) to introduce yourself and ask for help. I will be glad to help you get a copy of ZephyrCab working for evaluation and testing if you can critique the program based on real railway experience.**

**However, if you are a normal user and you are not sure how to set up a web server, I do not recommend trying ZephyrCab at this time. It will only cause you immense frustration, as it is not ready for production use yet.**

## Prerequisites

- **A DCC layout connected to JMRI.**

- **A web server.** I recommend using a Linux machine (such as the Raspberry Pi) for this, but you can run it on any OS you like.
    - [How to set up Apache web server on Windows](https://www.sitepoint.com/how-to-install-apache-on-windows/)
    - [How to set up lighttpd web server on Linux](https://help.ubuntu.com/community/lighttpd) - Ignore the part about installing PHP
    - Mac OSX is not covered in this guide, but if you install any simple web server it should work fine.
- **Basic JavaScript/JSON knowledge.** Due to the work-in-progress nature of the project, you will have to edit a few JSON files to configure it.

## Installation

1. Download ZephyrCab from GitHub as a zipped archive.
2. Extract with your favorite archiving program, and save the contents in your web server root. On Linux this is typically ``/var/www``.
3. Test by visiting ``localhost`` in a web browser. You should be greeted with a "Connection Settings" page. If so, you've installed ZephyrCab correctly!

## Setup

Some JavaScript/JSON knowledge is highly recommended. Eventually I will bundle tools for easy setup, but right now the project is still very much under development, and requires editing some JSON files to configure it.

**1. Make sure JMRI's web server is running.** See [JMRI Documentation](http://jmri.org/help/en/html/web/) for more information.

**2. Configure automatic connection to your layout in ``/cfg/settings.json``.** Simply edit the ``cfg.ip`` and ``cfg.port`` lines like this:
```javascript
cfg.ip = "10.10.39.85";
cfg.port = 12080;
```
Once that's done, ZephyrCab should automatically connect to your JMRI install every time you open it.

**3. Configure ``bundles.json`` with your locomotive roster and DCC decoder information.** This requires some knowledge of JSON syntax, and I am in the process of rewriting docs for this. Currently, the only supported locomotive is the EMD F7-A. I will update the documentation once the process of configuring ``bundles.json`` has been refined.

---

Once you have your ``bundles.json`` set up, you should be able to use the program normally. Connect to your JMRI PC (if you don't know the IP, you will need to find that) using the "Connection" tab, and everything should work. If you run into problems, post an issue on [the project's GitHub page](http://github.com/k4kfh/ZephyrCab).