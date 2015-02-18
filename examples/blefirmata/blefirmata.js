/****************************************************************************
  The MIT License (MIT)

  Copyright (c) 2015 bbx10node@gmail.com

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 ****************************************************************************/

/*
 * Discover and connect to all nRF8001 devices advertising a UART service.
 * Assume all devices are running firmata. Dump out the board capabilities
 * then blink an LED on pin 7.
 */


var nRFUART = require('../../index');
var firmata = require('firmata');

console.log('blefirmata');
nRFUART.discoverAll(function(ble_uart) {
    console.log('discoverAll');
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

        var board = new firmata.Board(ble_uart, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("firmata connected");

            console.log("Firmware: " + board.firmware.name + "-" + board.firmware.version.major + "." + board.firmware.version.minor);

            // Dump out the board capabilities. This is different from a
            // standard Uno because several pins are used for the nRF8001
            // board. These pins are show with "Modes: NONE" indicating
            // they cannot be used by firmata.
            for (var i=0; i < board.pins.length; i++) {
                console.log('Pin', i);
                var pin = board.pins[i];
                for (var key in pin) {
                    //console.log(key, "=", pin[key]);
                    if (key === "supportedModes") {
                        if (pin[key].length === 0) {
                            console.log('\tModes NONE');
                        }
                        else {
                            var ModesStr = "\tModes: ";
                            for (var j = 0; j < pin[key].length; j++) {
                                var mode = pin[key][j];
                                for (var modekey in board.MODES) {
                                    if (mode === board.MODES[modekey]) {
                                        ModesStr = ModesStr + ' ' + modekey;
                                    }
                                }
                            }
                            console.log(ModesStr);
                        }
                    }
                    else if (key === "mode") {
                        if (typeof pin[key] === 'undefined') {
                            console.log('\tCurrent mode: UNKNOWN');
                        }
                        else {
                            console.log('\tCurrent mode:', pin[key]);
                        }
                    }
                    else if (key === "value") {
                        if (typeof pin[key] === 'undefined') {
                            console.log('\tCurrent value: UNKNOWN');
                        }
                        else {
                            console.log('\tCurrent value:', pin[key]);
                        }
                    }
                    else if (key === "report") {
                        if (typeof pin[key] === 'undefined') {
                            console.log('\tReport: UNKNOWN');
                        }
                        else {
                            console.log('\tReport:', pin[key]);
                        }
                    }
                    else if (key === "analogChannel") {
                        if (typeof pin[key] === 'undefined') {
                            console.log('\tAnalog Chan: UNKNOWN');
                        }
                        else {
                            console.log('\tAnalog Chan:', pin[key]);
                        }
                    }
                }
            }

            var ledOn = true;
            var ledPin = 7;
            board.pinMode(ledPin, board.MODES.OUTPUT);

            setInterval(function() {

                if (ledOn) {
                    console.log("+");
                    board.digitalWrite(ledPin, board.HIGH);
                } else {
                    console.log("-");
                    board.digitalWrite(ledPin, board.LOW);
                }

                ledOn = !ledOn;

            }, 500);
        });
    });
});
