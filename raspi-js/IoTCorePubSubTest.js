const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// File paths
const ENDPOINT = "";
const THING_NAME = 'raspberrypi';
const CERTPATH = "/home/team6/pi-ultrasound/raspberrypi.cert.pem"; // cert 파일 경로
const KEYPATH = "/home/team6/pi-ultrasound/raspberrypi.private.key"; // key 파일 경로
const CAROOTPATH = "/home/team6/pi-ultrasound/root-CA.crt"; // RootCaPem 파일 경로
const TOPIC = 'test'; // 주제

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

client.on('connect', () => {
console.log('connected!!');

let i = 0;
setInterval(() => {
    const payload = JSON.stringify({ action: i * 0.1 }); // 메시지 포맷
    client.publish(TOPIC, payload, { qos: 1 }); // 메시지 발행
    i += 1;
}, 2000);
});

client.on('error', (error) => {
    console.error('Connection error:', error);
});

process.on('SIGINT', () => {
    client.end(() => {
        console.log('Disconnected from MQTT broker');
        process.exit(0);
    });
});