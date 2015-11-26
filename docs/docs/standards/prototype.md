# Prototype Object: Official Standards

**Note: **It is important to note that the prototype object standards are the most rapidly changing standards in the whole program right now. If you are serious about building a prototype object, it would benefit you to read through the comments in the ``bundles.json`` file bundled with ZephyrCab.

---

## Introduction

Just for clarification purposes, please make sure you understand the following:

- The ``prototype`` object has nothing to do with the physical model or DCC decoder.

- The ``prototype`` object is stored as a subobject of a train element. For example, ``train.all[0].prototype`` would be a prototype object for the first element in the train.

- The prototype object is different for locomotives and rolling stock.

---

## Locomotives

Locomotive prototype objects are by far the most complex. They tell everything that ``sim.js`` needs to know about the prototype locomotive, as well as all the information to build a reasonably realistic cab UI.

### Example Structure:

The prototype object below is for an EMD F7-A. This is a GitHub GIST, so if you know of anything wrong with this standard, please feel free to fix it and create a pull request. I ([k4kfh](http://k4kfh.github.io)) do my best to keep it up to date, but sometimes I add something new and forget to update it or don't get time to update it.

<script src="https://gist.github.com/k4kfh/615aba5fd882777596dc.js"></script>

---

## Rolling Stock

This feature has not been implemented yet. Sorry!