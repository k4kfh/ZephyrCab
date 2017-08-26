# Configuring ZephyrCab

ZephyrCab is configured with ``/cfg/settings.json``.

You don't need any programming knowledge, simply follow this guide. If you run into a problem, join the Gitter chat and I'll help you.

### Automatic Layout Connection

**_Not recommended for most users!_**

By default, ZephyrCab assumes it's running on a JMRI web server, and it will automatically connect to that. If for some reason you're running ZephyrCab on an external web server, you can configure automatic connection by setting the following values:

```
cfg.webServer = "external"; //not setting this or setting it to "jmri" invokes the default behavior
cfg.ip = "192.168.1.10"; //your JMRI PC's IP address
cfg.port = 12080; //your JMRI web server's port
```

### Default Brake System Pressure (feed valve)

North American freight train brakes operate based on an inverse relationship between brake line pressure and brake cylinder pressure. When the brake line pressure decreases, the brake cylinder pressure increases, applying the brakes.

All brake systems have a maximum brake line pressure, which will release the brakes completely. This is set via the feed valve in the locomotive cab. ZephyrCab's default feed valve setting is 90psi, the most common pressure. However, some railroads use different pressures, and if you are modeling such a railroad it may be inconvenient for you to change the feed valve pressure every time you use ZephyrCab.

**By adjusting the ``cfg.brakes.defaultFeedValveSetting`` option, you can change the default feed valve pressure of 90psi.** Simply edit the integer value. In the example below, we change the default feed valve pressure to 110psi.

```javascript
cfg.brakes.defaultFeedValveSetting = 110;
```
_Do not include "psi" on the end of your number!_

## Developer Options
The options below are specifically geared towards developers tinkering with the program. Normal users shouldn't need these features.

## Log All WebSockets Messages

This is useful in debugging communication between JMRI and ZephyrCab. When ``cfg.logallmessages === true``, ZephyrCab will dump all WebSockets messages to the console via ``console.log()``. A timestamp is also included for each log entry.

To enable WebSockets logging, set ``cfg.logallmessages`` to ``true``, as shown below.

```javascript
cfg.logallmessages = true;
```

It is not recommended to enable this unless you need it, as it sometimes creates an absurd amount of ``console.log()`` calls, and may bog down your browser.

## Debugging Toasts

ZephyrCab utilizes the excellent [MaterializeCSS Framework](http://materializecss.org), which provides a notification function called a toast. You can create a toast with ``Materialize.toast()``. See this page on the Materialize documentation to learn more.

### What are debug toasts?
ZephyrCab has a small global function called ``debugToast`` that is a wrapper for the toast function. It is used to give the user information in instances where ``console.log`` is not ideal. When the ``cfg.debugToasts`` boolean is ``false``, the function simply does nothing. However, when ``cfg.debugToasts`` is set to ``true``, the debug toasts are passed through to ``Materialize.toast()`` as normal.

**In short, setting ``cfg.debugToasts`` to ``true`` will turn on small pop-up debugging messages built in to some parts of the ZephyrCab code.** If you are using ZephyrCab locally in a development environment, I recommend leaving debugToasts on, as they are relatively unobtrusive and provide useful information.

```javascript
cfg.logallmessages = true; //enables debug toasts

cfg.logallmessages = false; //disables debug toasts
```

---

## Troubleshooting

If ZephyrCab misbehaves after an edit to the config file, please double check your syntax.

If you encounter a problem with your config file, please [make an issue on GitHub](https://github.com/k4kfh/ZephyrCab/issues/new) and I will do my best to assist you.

## Feature Requests

If you have something you'd like to add to ``settings.json``, please [make an issue on GitHub](https://github.com/k4kfh/ZephyrCab/issues/new) with your feature request, or better yet build it yourself and fork/pull request. All contributions are welcome!