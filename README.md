[![ZephyrCab Logo](http://i.imgur.com/n07xxtI.png)](http://k4kfh.github.io/ZephyrCab)

*Formerly locoThrottle.js*

* [Visit Main Project Site](http://k4kfh.github.io/ZephyrCab)
* [Project Documentation](http://k4kfh.github.io/ZephyrCab/docs/site)
* [Development Blog](http://zephyrcab.tumblr.com)
* [*The Idiot's Guide to Railroad Physics*](http://k4kfh.github.io/idiotsGuideToRailroadPhysics)

[![Join the chat at https://gitter.im/k4kfh/LocoThrottleJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/k4kfh/LocoThrottleJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

ZephyrCab is a web app that simulates prototypically accurate controls for model trains, built on the JMRI model train control software.

> Note: This project is still heavily under development. It is not recommended to try to use the project unless you are the adventurous type, and/or you understand JavaScript/JSON and are willing to tinker.
>
> Read more on [my blog.](http://zephyrcab.tumblr.com)

## Installation

### Prerequisites

- Understand very basic JSON/JavaScript syntax
- A simple web server. lighttpd, nginx, or Apache should all work fine.
- A layout connected to JMRI with the JMRI JSON WebSockets service enabled

The simplest way to install ZephyrCab is to download the ZIP from this page and extract it onto a web server of your choice. There is no server-side code, so you do not need a sophisticated web server to run it. Once you have extracted it to a directory of your choice, see the setup procedure below.

## Setup

**Note that the documentation linked below is being rewritten. Some docs may be inaccurate or outdated at this time. If you have trouble, make an issue. Sorry for the inconvenience.**

Before using the program:

- You MUST set up ``bundles.json``. Follow [this guide](http://k4kfh.github.io/ZephyrCab/docs/site/userguide/configure-locomotives/) to learn how.

- It is recommended that you set up ``settings.json``. This file makes your life easier by allowing you to configure some general settings, such as autoconnection to JMRI. See [this guide](http://k4kfh.github.io/ZephyrCab/docs/site/userguide/general-configuration/) for setup information.

## Usage

When you first log in after setting up `bundles.json`, you'll need to connect to your JMRI PC (unless you set up autoconnection, which I highly recommend. [See this guide.](http://k4kfh.github.io/ZephyrCab/docs/site/userguide/general-configuration/)). You can do this by inputting the IP of the PC, with the port of the JMRI web interface. By default, locoThrottle.js uses port 12080, which is the default for JMRI.
