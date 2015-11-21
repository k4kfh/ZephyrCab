# General Configuration

While you still have to configure settings separately for things like locomotives, decoders, and other things, there is a central place to set up general program settings. Inside your installation directory, ``/cfg/settings.json`` contains a number of useful settings/options for general use.

---

## Options Available:

- **WebSockets Auto-Connect** - This feature allows you to specify an IP/Port in ``settings.json`` and have all your clients auto-connect to that. They will get to skip the "Connection" tab completely, and will be dropped directly in the "Train Settings" tab. Since locoThrottle.js performs all the normal connection functions, this means your roster data, layout information, and other things will already be downloaded, parsed, and ready to go. Incredibly handy feature!

- **Disable Push Notifications** - This feature disables the push notifications feature we created. This feature is for alerting users when major program changes are made, and just as a communication tool for our users who don't regularly visit GitHub. Setting this configuration option to ``true`` will not disable the "HUB" feature completely, it will only disable the push notifications feature.

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
```

---