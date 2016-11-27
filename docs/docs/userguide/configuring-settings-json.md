# Configuring Basic Settings with ``settings.json``

ZephyrCab has a few basic configuration options in ``/cfg/settings.json``.

The config file _does not_ require any programming knowledge to edit; simply follow this guide. Be sure to match the syntax exactly (i.e. put quotes where there are quotes, semicolons where there are semicolons, etc)

## Automatic Layout Connection

ZephyrCab can automatically connect to your layout each time you open it. This is convenient (nobody likes to remember IP addresses).

To enable this feature, simply add the IP address of your JMRI computer and the port of your JMRI web server. By default, the JMRI web server runs on port 12080. Make sure to end each line with a semicolon. If you don't know your computer's IP address, you can find it with the ``ipconfig`` command in Windows or the ``ifconfig`` command on Linux.

```javascript
cfg.ip = "192.168.1.12";
cfg.port = 12080;
```

To disable this feature, simply remove the right side of those two lines, as shown below. This will allow you to specify an IP address and connect manually.

```javascript
cfg.ip;
cfg.port;
```

## Default Brake System Pressure (feed valve)

North American freight train brakes operate based on an inverse relationship between brake line pressure and brake cylinder pressure. When the brake line pressure decreases, the brake cylinder pressure increases, applying the brakes.

All brake systems have a maximum brake line pressure, which will release the brakes completely. This is set via the feed valve in the locomotive cab. ZephyrCab's default feed valve setting is 90psi, the most common pressure. However, some railroads use different pressures, and if you are modeling such a railroad it may be inconvenient for you to change the feed valve pressure every time you use ZephyrCab.

**By adjusting the ``cfg.brakes.defaultFeedValveSetting`` option, you can change the default feed valve pressure of 90psi.** Simply edit the integer value. In the example below, we change the default feed valve pressure to 110psi.

```javascript
cfg.brakes.defaultFeedValveSetting = 110;
```
_Do not include "psi" on the end of your number!_

## Disable Push Notifications

_This is an experimental feature and has not been documented yet, as it may be removed in future releases._

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