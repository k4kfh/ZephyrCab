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

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You'll need a computer running [JMRI](http://jmri.org). You can run JMRI and ZephyrCab on the same computer, or you can use two separate computers, but they _must_ be on the same network. ZephyrCab can't traverse the Internet. You'll also need some OS-specific stuff, listed below.

### Linux (Debian/Ubuntu)

You'll need a simple web server. No extensions/modules are needed, as ZephyrCab is totally client-side. It's also helpful to have ``git``.
```
sudo apt-get install apache2 git
```

### Windows

You'll need to download a web server, such as Apache. (IIS might work, no promises) For ease of installation I recommend [Apache Portable](https://sourceforge.net/projects/apache2portable/). You won't need any modules since ZephyrCab is entirely static, client-side code.

## Installing

### Windows

If you installed Apache Portable as recommended above, [download the latest development copy of ZephyrCab](https://github.com/k4kfh/ZephyrCab/archive/master.zip) and unzip it to your web server directory. Then just use Chrome to open ``http://localhost`` and you should get ZephyrCab's "Connection Settings" screen.

### Mac OSX

I don't own a Mac, so I can't give specific instructions for Mac users. (If you own a Mac, feel free to fork/PR an update to this README!) The general idea is:
1. Install a  web server
2. Unzip ZephyrCab to web server
3. Open web server in a browser (preferably Chrome)

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
