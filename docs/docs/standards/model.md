# Model Objects: Official Standards

The model object contains a single function:

``speed()``

This function takes in a speed in mph (as its only argument) and returns a speed in percent. It must return it as a decimal representation of a percent.

For example, if you knew your model went 25 scale mph at 10% speed, your code sample should behave like this:

```javascript
mph = 25;
DCCspeed = speed(mph);

console.log(DCCspeed) //This should log 0.10 to the console in this example
```

It doesn't matter how you get that value, but it should be an equation of some sort. (You cannot use an array and lookup things because decimals will not work right)

This is one of the most open standards the project has. It aims to make it easy for people to add support for any model, from RTR to scratch-built.