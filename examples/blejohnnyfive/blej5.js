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
 * Create johnny-five object on each device.
 */

var nrfuart = require('../../index');
var firmata = require('firmata');
var j5 = require('johnny-five');

console.log('blej5');
nrfuart.discoverAll(function(ble_uart) {
    console.log('discoverAll');
    // enable disconnect notifications
    ble_uart.on('disconnect', function() {
        console.log('BLE disconnected!');
    });

    // connect and setup
    ble_uart.connectAndSetup(function() {
        var writeCount = 0;

        console.log('BLE connected!');

        ble_uart.readDeviceName(function(devName) {
            console.log('BLE Device name:', devName);
        });

        var ble_io = new firmata.Board(ble_uart, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("ble firmata ready");
            ble_io.isReady = true;
            ble_io.name = 'bleuart';
            ble_io.transport = 'Bluetooth Low Energy';
            var board = new j5.Board({ io: ble_io  }, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            board.on("ready", function() {
                console.log("johnny-five ready");

                // Blink LED on pin 7
                (new j5.Led(7)).strobe(500);
            });
        });
    });
});
