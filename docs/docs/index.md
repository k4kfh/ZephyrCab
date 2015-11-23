[![ZephyrCab Logo](http://i.imgur.com/n07xxtI.png)](http://k4kfh.github.io/ZephyrCab)

---

*Before you read the full docs, it is suggested that you read README.md, provided [on GitHub](http://github.com/k4kfh/LocoThrottleJS). This quickstart guide is intended for relatively experienced computer users, so follow the more detailed user guide if you don't know what you're doing.*

[![Join the chat at https://gitter.im/k4kfh/LocoThrottleJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/k4kfh/LocoThrottleJS)

---

# Quickstart Guide

---

### Prerequisites

- A DCC layout connected to JMRI

- A web server (you can use the one built into JMRI)

---

### Installation

This installation guide is for technically-minded developer/nerd people. If you need a simplified guide, try [this one.](userguide/installation-guide/)

You can download a release from GitHub. Once you have the release extracted from the ZIP, simply drag all the files into a directory on any web server. When you go to the web server, you should be left at a "Connection Settings" page that looks like this.

![](https://camo.githubusercontent.com/1a15a1515d2340f0f585d2be1e70f97b16408707/687474703a2f2f6576696c67656e697573746563682e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031352f31312f636f6e6e656374696f6e73657474696e67732e706e67)

Before you proceed any further, you need to set up your ``bundles.json`` file. Unfortunately, there is no automated tool to do this as of now. You may see the comments in the code for explanation of how to set it up. Feel free to join the Gitter chat below if you want help!

[![Join the chat at https://gitter.im/k4kfh/LocoThrottleJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/k4kfh/ZephyrCab)

Once you have your ``bundles.json`` set up, you should be able to use the program normally. Connect to your JMRI PC (if you don't know the IP, you will need to find that) using the "Connection" tab, and everything should work. If you run into problems, post an issue on [the project's GitHub page](http://github.com/k4kfh/ZephyrCab).