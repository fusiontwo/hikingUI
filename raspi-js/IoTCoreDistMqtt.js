const mqtt = require('mqtt');
const fs = require('fs');
const Gpio = require('pigpio').Gpio; 

// Pin numbers of Ultrasound sensor
const TRIGER = 24;
const ECHO = 23;

// IoT Core Auth File path
const ENDPOINT = "";
const THING_NAME = 'raspberrypi';
const CERTPATH = "/home/team6/pi-ultrasound/raspberrypi.cert.pem"; // cert 파일 경로
const KEYPATH = "/home/team6/pi-ultrasound/raspberrypi.private.key"; // key 파일 경로
const CAROOTPATH = "/home/team6/pi-ultrasound/root-CA.crt"; // RootCaPem 파일 경로
const TOPIC = 'distance_from_obj';

// MQTT client options
const options = {
    clientId: THING_NAME,
    cert: fs.readFileSync(CERTPATH),
    key: fs.readFileSync(KEYPATH),
    ca: fs.readFileSync(CAROOTPATH),
    rejectUnauthorized: true,
    protocol: 'mqtts'
};

// Connect to the MQTT broker
const client = mqtt.connect(`mqtts://${ENDPOINT}:8883`, options);

// Output & Input pin
const trig = new Gpio(TRIGER, { mode: Gpio.OUTPUT });
const echo = new Gpio(ECHO, { mode: Gpio.INPUT, alert: true });

// Ensure trigger is low (Initializing sensor)
trig.digitalWrite(0);

// Block scoped variable
let startTime;
let endTime;

/* 
Event handler of an ultrasound sensor
level: Event level of ultrasound sensor 
(1: send ultrasound / 0: detect reflected ultrasound)
tick: Time when event occurred
*/
echo.on('alert', (level, tick) => {
    if (level === 1) {
        startTime = tick;
    } else if (level === 0) {
        endTime = tick;

        const period = endTime - startTime;
        // Measure distance in two ways
        const dist1 = Math.round(period / 58 * 100) / 100; // dist1 계산
        const dist2 = Math.round(period * 17241 / 1000000 * 100) / 100; // dist2 계산

        // Write MQTT message
        const payload = JSON.stringify({ dist1: dist1, dist2: dist2 });

        /* 
        Publish MQTT message
        Param: topic, message(payload), quality of service(qos)
        */
        client.publish(TOPIC, payload, { qos: 1 });

        console.log("Dist1", dist1, "cm", ", Dist2", dist2, "cm");

        if (dist1 < 10 && dist2 < 10) {
            console.log("detect");
        }
    }
});

// Setting the pulse trigger cycle
const measureDistance = () => {
    trig.trigger(10, 1); // Send a 10µs pulse
};

// Measure distance every 2 seconds
const interval = setInterval(measureDistance, 2000);

// Exit process handler (SIGINT: Ctrl + C)
process.on('SIGINT', () => {
    clearInterval(interval);
    trig.digitalWrite(0);
    client.end(() => {
        console.log('Disconnected from MQTT broker');
        process.exit(0);
    });
});
