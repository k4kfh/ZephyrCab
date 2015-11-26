# General Configuration

While you still have to configure settings separately for things like locomotives, decoders, and other things, there is a central place to set up general program settings. Inside your installation directory, ``/cfg/settings.json`` contains a number of useful settings/options for general use.

---

**You will not need any programming knowledge to edit this file. If you can read and follow directions, you can set this up.**

---

## Options Available:

- **WebSockets Auto-Connect** - This feature allows you to specify an IP/Port in ``settings.json`` and have all your clients auto-connect to that. They will get to skip the "Connection" tab completely, and will be dropped directly in the "Train Settings" tab. Since locoThrottle.js performs all the normal connection functions, this means your roster data, layout information, and other things will already be downloaded, parsed, and ready to go. Incredibly handy feature!

- **Disable Push Notifications** - This feature disables the push notifications feature we created. This feature is for alerting users when major program changes are made, and just as a communication tool for our users who don't regularly visit GitHub. Setting this configuration option to ``true`` will not disable the "HUB" feature completely, it will only disable the push notifications feature.

- **Enable Debug Toasts** - This feature enables a "debug mode" of sorts. 90% of users should leave this set to ``false``. When you enable this, you will recieve more detailed information from many functions about what's going on. Developers can make use of this feature with the ``debugToast()`` function, which behaves exactly the same as the ``Materialize.toast()`` function, except it appends "Debug: " to the beginning of the toast, and it only works when the ``cfg.debugToasts`` is ``true``.

- **Log all WebSockets messages** - This will log every piece of WebSockets data to the console, including heartbeats, as a string. Sent commands will be prefaced with ``SENT : ``, and recieved data with ``RECIEVED : ``. This is for developers only, and will make your console a bit messy. If you'd rather log the objects directly as opposed to stringified, you can tweak your ``websockets.js`` pretty easily if you know basic JavaScript. [Get in touch with me](http://k4kfh.github.io) if you need help with this.

---

## Example ``settings.json``

The following is an example of settings.json with every option we currently support. See the comments in the code (marked by ``/*`` and ``*/``) for detailed information on usage.

```javascript
cfg = new Object(); //DO NOT REMOVE THIS LINE!

/*
This file is used to store settings server-side. This is capable of storing an IP address to connect to automatically, as well as other things.
*/

/*
These two settings are for the WebSockets Auto-Connect feature mentioned above.

cfg.ip - Set to a string (either an IP or hostname)
cfg.port - Set to a port number (not a string)

If you do not wish to use the autoconnect feature, simply comment these out by adding // at the begining of each line. This will revert the program back to its original ask-for-connection-details behavior.

Example disabled autoconnect:

//cfg.ip = "10.10.39.85";
//cfg.port = 12080;

*/
cfg.ip = "10.10.39.85";
cfg.port = 12080;

/*
This setting, as explained above, disables the "HUB" push notifications feature when set to true.
*/
cfg.disablePushNotifications = false; //this leaves push notifications on

cfg.debugToasts = true;

cfg.logallmessages = false; //This will log EVERY WebSockets message that is sent or recieved to the console as a string. This is meant for copying/pasting into GitHub issues and such. It prefaces messages we send with "SENT : " and messages from JMRI with "RECIEVED : "
```

---