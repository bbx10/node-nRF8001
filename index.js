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
 * Adafruit nRF8001 breakout in UART mode. This might also work for other
 * nRF8001 boards but has only been tested with the Adafruit board.
 */

var NobleDevice = require('noble-device');
var events = require('events');
var util = require('util');

var NRFUART_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e';
var NRFUART_NOTIFY_CHAR  = '6e400003b5a3f393e0a9e50e24dcca9e';
var NRFUART_WRITE_CHAR   = '6e400002b5a3f393e0a9e50e24dcca9e';

var nrfuart = function(peripheral) {
    // call nobles super constructor
    NobleDevice.call(this, peripheral);

    // setup or do anything else your module needs here
};

// tell Noble about the service uuid(s) your peripheral advertises (optional)
nrfuart.SCAN_UUIDS = [NRFUART_SERVICE_UUID];

util.inherits(nrfuart, events.EventEmitter);

// and/or specify method to check peripheral (optional)
nrfuart.is = function(peripheral) {
    'use strict';
    //return (peripheral.advertisement.localName === 'UART');
    return true;
};

// inherit noble device
NobleDevice.Util.inherits(nrfuart, NobleDevice);

// Receive data using the 'data' event.
nrfuart.prototype.onData = function(data) {
    'use strict';
    this.emit("data", data);
};

// Send data like this
// nrfuart.write('Hello world!\r\n', function(){...});
// or this
// nrfuart.write([0x02, 0x12, 0x34, 0x03], function(){...});
nrfuart.prototype.write = function(data, done) {
    'use strict';
    if (typeof data === 'string') {
        this.writeDataCharacteristic(NRFUART_SERVICE_UUID, NRFUART_WRITE_CHAR, new Buffer(data), done);
    }
    else {
        this.writeDataCharacteristic(NRFUART_SERVICE_UUID, NRFUART_WRITE_CHAR, data, done);
    }
};

nrfuart.prototype.connectAndSetup = function(callback) {
    'use strict';
    var self = this;

    NobleDevice.prototype.connectAndSetup.call(self, function() {
        self.notifyCharacteristic(NRFUART_SERVICE_UUID,
            NRFUART_NOTIFY_CHAR, true, self.onData.bind(self), callback);
    });
};

// export device
module.exports = nrfuart;
