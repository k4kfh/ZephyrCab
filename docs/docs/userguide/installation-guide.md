# Server-Side Installation

---

- locoThrottle.js runs in a browser. This means to use it, you'll need a web server. This server can be anywhere, and does not necessarily need to be on the same network as your JMRI PC since all code is client-side JavaScript.

    - Additionally, since the entire app is static, you can host it on anything you like, including services such as Amazon S3.

* **If you are not an experienced user, we recommend you use the web server already built into JMRI.** You can read more on this at [the JMRI docs.](http://jmri.sourceforge.net/help/en/html/web/)

---

### Using JMRI's Jetty server

**This is the recommended way to install for new users.**

1. **Make sure JMRI's Web Server is functional.** 

    - The default port is 12080, so from your JMRI PC you should be able to visit [http://localhost:12080](http://localhost:12080) and see the web interface.
    
    - Make sure that the web server is set to run on JMRI startup. [Read more about JMRI Web Access here.](http://jmri.sourceforge.net/help/en/html/web/)
    
2. **Extract locoThrottle.js into the ``/web/locoThrottleJS`` directory inside your JMRI install folder.**

    - This is what ultimately determines the URL you must use to access locoThrottle.js, so make sure you do this right.
    
    - You want to extract the contents of the release (from the ZIP) into ``/web/locoThrottleJS``. This should put a whole bunch of files (including ``index.html``) in that folder.
    
3. **Visit the page in your browser**

    - If you did step 2 correctly, you should be able to access locoThrottle.js by adding ``/web/locoThrottleJS`` onto your normal web access folder path.
    
    - For example, if you are viewing this on your JMRI machine, your web access path is ``http://localhost:12080``. Your locoThrottle.js path would be ``http://localhost:12080/web/locoThrottleJS``.
    
    - If you plan on using locoThrottle.js from another PC, or a mobile device, you should set a static IP on your JMRI PC.
    
    - If it worked, you should be left at the "Connection" tab when you open the page in a browser. If you get "Connection Refused" or a similar error, check to be sure that your firewall is set to allow JMRI through. This has not historically been a problem in Linux, but in Windows it could be an issue.
    
---

### Using your own web server

locoThrottle.js is built as an entirely static HTML/CSS/JS app. This means you can install it on any web server, regardless of whether or not it can handle things like PHP, or Python. All the code runs client-side.

To install it on your own server, simply drag and drop the extracted release files into a directory of your choice. It should not matter what directory you put them in, or what network the server is on. As long as the client device is connected to the same network as your JMRI PC, you should have access to JMRI.

We do not provide an official guide for setting it up on your own web server because it's so simple. If you don't know what you're doing, or you want an easier way, use the [Using JMRI's Jetty server](#using-jmris-jetty-server) guide above.



