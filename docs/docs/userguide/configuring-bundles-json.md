# Adding your locomotives with ``bundles.json``

ZephyrCab requires a substantial amount of information for each locomotive in order to produce an accurate simulation. Everything from weight, horsepower, length, drivetrain efficiency, and more is taken into account. It also requires information on DCC decoder functions to produce the correct sound/lighting on your model, and a speed table for your model to produce scale speeds*.

## What's a bundle?

ZephyrCab stores this information in "bundles," which are each linked to a specific roster entry in your JMRI roster. This allows ZephyrCab to easily bind all the required information to a single locomotive on your layout, making it quick and easy to select a locomotive.

## Setting up a locomotive bundle

Bundles are stored in JSON (JavaScript Object Notation). Basic syntax is shown below, and you can [learn more about JSON here.](http://www.w3schools.com/js/js_json_intro.asp). **Luckily, you don't need to write any JSON yourself to create a bundle!**

```json
{
    "item":"value",
    "parent-item": {
        "child":"some string of text",
        "anotherchild":42,
    },
    "some boolean":true,
}
```

Each bundle is stored in it's own individual file, inside the ``/cfg/bundles/`` directory. ZephyrCab now provides an easy tool for creating these bundles. You simply fill out a data sheet on your locomotive, then click "Download." You'll be given a bundle file (such as ``BN1379.zephyrcab``) which you'll need to put inside the ``/cfg/bundles/`` folder. Once you've done that, you need to edit ``/cfg/bundles.list.json`` and add your filename to the list at the bottom. This tells ZephyrCab which bundles to load. So for the ``BN1379.zephyrcab`` file, you'd place the file inside ``/cfg/bundles/`` directory, then edit the bottom of ``bundles.list.json`` to look something like this:

```
bundles.files = [
    "BN1379.zephyrcab",
]
```

---

If you encounter a problem at any point in this guide, please [make an issue on GitHub](https://github.com/k4kfh/ZephyrCab/issues/new), and I'll be glad to assist you.
