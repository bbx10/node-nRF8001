# nrfuart -- node-nRF8001

node.js support for the
[Adafruit Bluetooth Low Energy nRF8001 breakout board](http://www.adafruit.com/products/1697).
This module also works with the
[Adafruit BLE Friend nRF51822 board](http://www.adafruit.com/products/2267).

Other nRF800x and nRF51822 board may also work.

## Tested configurations

A USB to Bluetooth 4.0 gadget similar to
[this](http://www.adafruit.com/product/1327) is required to add BLE support to
systems without Bluetooth 4.0/BLE hardware.

### Laptop running Ubuntu Linux 14.04

```
Laptop running Ubuntu 14.04 <-> BLE <-> nRF8001 <-> Arduino Uno
```

Ubuntu 14.04 includes bluez 4.101 which is sufficient for this module.
Install the following packages before installing nrfuart.

```sh
sudo apt-get install bluetooth bluez-utils libbluetooth-dev
```

### Raspberry Pi running Raspbian Linux

TODO

## Install this module

```sh
npm install nrfuart
```

## Use this module

This program sends a test pattern and displays anything that comes back.

```javascript
var nrfuart = require('nrfuart');

nrfuart.discoverAll(function(ble_uart) {
    // enable disconnect notifications
    ble_uart.on('disconnect', function() {
        console.log('disconnected!');
    });

    // connect and setup
    ble_uart.connectAndSetup(function() {
        var writeCount = 0;

        console.log('connected!');

        ble_uart.readDeviceName(function(devName) {
            console.log('Device name:', devName);
        });

        ble_uart.on('data', function(data) {
            console.log('received:', data.toString());
        });

        setInterval(function() {
            var TESTPATT = 'Hello world! ' + writeCount.toString();
            ble_uart.write(TESTPATT, function() {
                console.log('data sent:', TESTPATT);
                writeCount++;
            });
        }, 3000);
    });
});
```

## Example 1: node.js and BLE UART

This program writes data to the BLE device and displays everything that comes
back. Run an echo loopkback test on the Arduino to verify data flows in both
directions.


### Setup the Arduino Uno with nRF8001 board

Adafruit BLE UART

Follow the
[Adafruit tutorial](https://learn.adafruit.com/getting-started-with-the-nrf8001-bluefruit-le-breakout/software-uart-service)
to run the Arudino BLE UART driver and the callbackEcho.ino test program.


### Install the nrfuart package

```sh
npm install nrfuart
```

Make sure the Arduino is running callbackEcho.ino and verify it is
working using the Adafruit Bluefruit LE iOS application. When done,
disconnect.

Next run the node.js BLE echo test example program.

```sh
cd node_modules/node-nRF8001/examples/simpleuart
sudo node bleEchoTst.js
```
The output should look like this.

```
connected!
Device name: UART
data sent: Hello world! 0
received: Hello world! 0
data sent: Hello world! 1
received: Hello world! 1
```

## Example 2: node.js and BLE firmata

Firmata allows node.js programs to control the pins on an Arduino Uno.
Adafruit provides BLEFirmata but a few fixes are required so use
the fork described below

### Setup the Uno with BLEFirmata

Install the BLEFirmata fork into your Arduino library directory.

```sh
git clone https://github.com/bbx10/Adafruit_BLEFirmata.git
cd Adafruit_BLEFirmata
git checkout nodejs
```

This fork fixes 3 firmata responses required by node.js firmata and
johnny-five. Burn this into the Arduino Uno and hook up the Adafruit
nRF8001 breakout board as specifed in the 
[Adafruit nRF8001 tutorial](https://learn.adafruit.com/getting-started-with-the-nrf8001-bluefruit-le-breakout/software-bluefruit-firmata).

### Run the node.js firmata test program

```sh
cd node_modules/node-nRF8001/examples/blefirmata
npm install firmata
sudo node blefirmata.js
```

## Example 3: johnny-five and BLE UART

### Setup the Uno with BLEFirmata

See the previous example to install BLEFirmata.

### Run the node.js johnny-five test program

```sh
cd node_modules/node-nRF8001/examples/blejohnnyfive
npm install firmata johnny-five
sudo node blej5.js
```
