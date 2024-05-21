const Gpio = require('pigpio').Gpio;
const sleep = require('util').promisify(setTimeout);

const TRIGER = 24;
const ECHO = 23;

const trig = new Gpio(TRIGER, { mode: Gpio.OUTPUT });
const echo = new Gpio(ECHO, { mode: Gpio.INPUT, alert: true });

trig.digitalWrite(0);

let startTime;
let endTime;

echo.on('alert', (level, tick) => {
  if (level === 1) {
    startTime = tick;
  } else if (level === 0) {
    endTime = tick;
    const period = endTime - startTime
    const dist1 = Math.round(period / 58 * 100) / 100;
    const dist2 = Math.round(period * 17241 / 1000000 * 100) / 100; 

    console.log("Dist1", dist1, "cm", ", Dist2", dist2, "cm");

    if (dist1 < 10 && dist2 < 10) {
      console.log("detect");
    }
  }
});

const measureDistance = () => {
  trig.trigger(10, 1); // Send a 10µs pulse
};

// Measure distance every 2 seconds
const interval = setInterval(measureDistance, 2000);

process.on('SIGINT', () => {
  clearInterval(interval); // Clear the interval on exit
  trig.digitalWrite(0);
  process.exit();
});
