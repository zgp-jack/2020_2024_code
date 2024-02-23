/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file Represents a connection (both client and server sides)
 */


var util = __webpack_require__(0),
	events = __webpack_require__(4),
	crypto = __webpack_require__(13),
	InStream = __webpack_require__(11),
	OutStream = __webpack_require__(12),
	frame = __webpack_require__(3),
	Server = __webpack_require__(2)

/**
 * @typedef {Object} Connection~Options
 * @param {string} path
 * @param {string} host
 * @param {?Object<string>} extraHeaders
 * @param {?Array<string>} protocols
 */

/**
 * @class
 * @param {(net.Socket|tls.CleartextStream)} socket a net or tls socket
 * @param {(Server|Connection~Options)} parentOrOptions parent in case of server-side connection,  object in case of client-side
 * @param {Function} [callback] will be added as a listener to 'connect'
 * @inherits EventEmitter
 * @event close the numeric code and string reason will be passed
 * @event error an error object is passed
 * @event text a string is passed
 * @event binary a inStream object is passed
 * @event pong a string is passed
 * @event connect
 */
function Connection(socket, parentOrOptions, callback) {
	var that = this,
		connectEvent

	if (parentOrOptions instanceof Server) {
		// Server-side connection
		this.server = parentOrOptions
		this.path = null
		this.host = null
		this.extraHeaders = null
		this.protocols = []
	} else {
		// Client-side
		this.server = null
		this.path = parentOrOptions.path
		this.host = parentOrOptions.host
		this.extraHeaders = parentOrOptions.extraHeaders
		this.protocols = parentOrOptions.protocols || []
	}

	this.protocol = undefined
	this.socket = socket
	this.readyState = this.CONNECTING
	this.buffer = Buffer.alloc(0)
	this.frameBuffer = null // string for text frames and InStream for binary frames
	this.outStream = null // current allocated OutStream object for sending binary frames
	this.key = null // the Sec-WebSocket-Key header
	this.headers = {} // read only map of header names and values. Header names are lower-cased

	// Set listeners
	socket.on('readable', function () {
		that.doRead()
	})

	socket.on('error', function (err) {
		that.emit('error', err)
	})

	if (!this.server) {
		connectEvent = socket.constructor.name === 'CleartextStream' ? 'secureConnect' : 'connect'
		socket.on(connectEvent, function () {
			that.startHandshake()
		})
	}

	// Close listeners
	var onclose = function () {
		if (that.readyState === that.CONNECTING || that.readyState === that.OPEN) {
			that.emit('close', 1006, '')
		}
		that.readyState = this.CLOSED
		if (that.frameBuffer instanceof InStream) {
			that.frameBuffer.end()
			that.frameBuffer = null
		}
		if (that.outStream instanceof OutStream) {
			that.outStream.end()
			that.outStream = null
		}
	}
	socket.once('close', onclose)
	socket.once('finish', onclose)

	// super constructor
	events.EventEmitter.call(this)
	if (callback) {
		this.once('connect', callback)
	}
}

util.inherits(Connection, events.EventEmitter)
module.exports = Connection

/**
 * Minimum size of a pack of binary data to send in a single frame
 * @property {number} binaryFragmentation
 */
Connection.binaryFragmentation = 512 * 1024 // .5 MiB

/**
 * The maximum size the internal Buffer can grow
 * If at any time it stays bigger than this, the connection will be closed with code 1009
 * This is a security measure, to avoid memory attacks
 * @property {number} maxBufferLength
 */
Connection.maxBufferLength = 2 * 1024 * 1024 // 2 MiB

/**
 * Possible ready states for the connection
 * @constant {number} CONNECTING
 * @constant {number} OPEN
 * @constant {number} CLOSING
 * @constant {number} CLOSED
 */
Connection.prototype.CONNECTING = 0
Connection.prototype.OPEN = 1
Connection.prototype.CLOSING = 2
Connection.prototype.CLOSED = 3

/**
 * Send a given string to the other side
 * @param {string} str
 * @param {Function} [callback] will be executed when the data is finally written out
 */
Connection.prototype.sendText = function (str, callback) {
	if (this.readyState === this.OPEN) {
		if (!this.outStream) {
			return this.socket.write(frame.createTextFrame(str, !this.server), callback)
		}
		this.emit('error', new Error('You can\'t send a text frame until you finish sending binary frames'))
	} else {
		this.emit('error', new Error('You can\'t write to a non-open connection'))
	}
}

/**
 * Request for a OutStream to send binary data
 * @returns {OutStream}
 */
Connection.prototype.beginBinary = function () {
	if (this.readyState === this.OPEN) {
		if (!this.outStream) {
			return (this.outStream = new OutStream(this, Connection.binaryFragmentation))
		}
		this.emit('error', new Error('You can\'t send more binary frames until you finish sending the previous binary frames'))
	} else {
		this.emit('error', new Error('You can\'t write to a non-open connection'))
	}
}

/**
 * Sends a binary buffer at once
 * @param {Buffer} data
 * @param {Function} [callback] will be executed when the data is finally written out
 */
Connection.prototype.sendBinary = function (data, callback) {
	if (this.readyState === this.OPEN) {
		if (!this.outStream) {
			return this.socket.write(frame.createBinaryFrame(data, !this.server, true, true), callback)
		}
		this.emit('error', new Error('You can\'t send more binary frames until you finish sending the previous binary frames'))
	} else {
		this.emit('error', new Error('You can\'t write to a non-open connection'))
	}
}

/**
 * Sends a text or binary frame
 * @param {string|Buffer} data
 * @param {Function} [callback] will be executed when the data is finally written out
 */
Connection.prototype.send = function (data, callback) {
	if (typeof data === 'string') {
		this.sendText(data, callback)
	} else if (Buffer.isBuffer(data)) {
		this.sendBinary(data, callback)
	} else {
		throw new TypeError('data should be either a string or a Buffer instance')
	}
}

/**
 * Sends a ping to the remote
 * @param {string} [data=''] - optional ping data
 * @fires pong when pong reply is received
 */
Connection.prototype.sendPing = function (data) {
	if (this.readyState === this.OPEN) {
		this.socket.write(frame.createPingFrame(data || '', !this.server))
	} else {
		this.emit('error', new Error('You can\'t write to a non-open connection'))
	}
}

/**
 * Close the connection, sending a close frame and waiting for response
 * If the connection isn't OPEN, closes it without sending a close frame
 * @param {number} [code]
 * @param {string} [reason]
 * @fires close
 */
Connection.prototype.close = function (code, reason) {
	if (this.readyState === this.OPEN) {
		this.socket.write(frame.createCloseFrame(code, reason, !this.server))
		this.readyState = this.CLOSING
	} else if (this.readyState !== this.CLOSED) {
		this.socket.end()
		this.readyState = this.CLOSED
	}
	this.emit('close', code, reason)
}

/**
 * Reads contents from the socket and process it
 * @fires connect
 * @private
 */
Connection.prototype.doRead = function () {
	var buffer, temp

	// Fetches the data
	buffer = this.socket.read()
	if (!buffer) {
		// Waits for more data
		return
	}

	// Save to the internal buffer
	this.buffer = Buffer.concat([this.buffer, buffer], this.buffer.length + buffer.length)

	if (this.readyState === this.CONNECTING) {
		if (!this.readHandshake()) {
			// May have failed or we're waiting for more data
			return
		}
	}

	if (this.readyState !== this.CLOSED) {
		// Try to read as many frames as possible
		while ((temp = this.extractFrame()) === true) {}
		if (temp === false) {
			// Protocol error
			this.close(1002)
		} else if (this.buffer.length > Connection.maxBufferLength) {
			// Frame too big
			this.close(1009)
		}
	}
}

/**
 * Create and send a handshake as a client
 * @private
 */
Connection.prototype.startHandshake = function () {
	var str, i, key, headers, header
	key = Buffer.alloc(16)
	for (i = 0; i < 16; i++) {
		key[i] = Math.floor(Math.random() * 256)
	}
	this.key = key.toString('base64')
	headers = {
		Host: this.host,
		Upgrade: 'websocket',
		Connection: 'Upgrade',
		'Sec-WebSocket-Key': this.key,
		'Sec-WebSocket-Version': '13'
	}

	if (this.protocols && this.protocols.length) {
		headers['Sec-WebSocket-Protocol'] = this.protocols.join(', ')
	}

	for (header in this.extraHeaders) {
		headers[header] = this.extraHeaders[header]
	}

	str = this.buildRequest('GET ' + this.path + ' HTTP/1.1', headers)
	this.socket.write(str)
}

/**
 * Try to read the handshake from the internal buffer
 * If it succeeds, the handshake data is consumed from the internal buffer
 * @returns {boolean} - whether the handshake was done
 * @private
 */
Connection.prototype.readHandshake = function () {
	var found = false,
		i, data

	// Do the handshake and try to connect
	if (this.buffer.length > Connection.maxBufferLength) {
		// Too big for a handshake
		if (this.server) {
			this.socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
		} else {
			this.socket.end()
			this.emit('error', new Error('Handshake is too big'))
		}
		return false
	}

	// Search for '\r\n\r\n'
	for (i = 0; i < this.buffer.length - 3; i++) {
		if (this.buffer[i] === 13 && this.buffer[i + 2] === 13 &&
			this.buffer[i + 1] === 10 && this.buffer[i + 3] === 10) {
			found = true
			break
		}
	}
	if (!found) {
		// Wait for more data
		return false
	}
	data = this.buffer.slice(0, i + 4).toString().split('\r\n')
	if (this.server ? this.answerHandshake(data) : this.checkHandshake(data)) {
		this.buffer = this.buffer.slice(i + 4)
		this.readyState = this.OPEN
		this.emit('connect')
		return true
	} else {
		this.socket.end(this.server ? 'HTTP/1.1 400 Bad Request\r\n\r\n' : undefined)
		return false
	}
}

/**
 * Read headers from HTTP protocol
 * Update the Connection#headers property
 * @param {string[]} lines one for each '\r\n'-separated HTTP request line
 * @private
 */
Connection.prototype.readHeaders = function (lines) {
	var i, match

	// Extract all headers
	// Ignore bad-formed lines and ignore the first line (HTTP header)
	for (i = 1; i < lines.length; i++) {
		if ((match = lines[i].match(/^([a-z-]+): (.+)$/i))) {
			this.headers[match[1].toLowerCase()] = match[2]
		}
	}
}

/**
 * Process and check a handshake answered by a server
 * @param {string[]} lines one for each '\r\n'-separated HTTP request line
 * @returns {boolean} if the handshake was sucessful. If not, the connection must be closed
 * @private
 */
Connection.prototype.checkHandshake = function (lines) {
	var key, sha1, protocol

	// First line
	if (lines.length < 4) {
		this.emit('error', new Error('Invalid handshake: too short'))
		return false
	}
	if (!lines[0].match(/^HTTP\/\d\.\d 101( .*)?$/i)) {
		this.emit('error', new Error('Invalid handshake: invalid first line format'))
		return false
	}

	// Extract all headers
	this.readHeaders(lines)

	// Validate necessary headers
	if (!('upgrade' in this.headers) ||
		!('sec-websocket-accept' in this.headers) ||
		!('connection' in this.headers)) {
		this.emit('error', new Error('Invalid handshake: missing required headers'))
		return false
	}
	if (this.headers.upgrade.toLowerCase() !== 'websocket' ||
		this.headers.connection.toLowerCase().split(/\s*,\s*/).indexOf('upgrade') === -1) {
		this.emit('error', new Error('Invalid handshake: invalid Upgrade or Connection header'))
		return false
	}
	key = this.headers['sec-websocket-accept']

	// Check protocol negotiation
	protocol = this.headers['sec-websocket-protocol']
	if (this.protocols && this.protocols.length) {
		// The server must choose one from our list
		if (!protocol || this.protocols.indexOf(protocol) === -1) {
			this.emit('error', new Error('Invalid handshake: no protocol was negotiated'))
			return false
		}
	} else {
		// The server must not choose a protocol
		if (protocol) {
			this.emit('error', new Error('Invalid handshake: no protocol negotiation was expected'))
			return false
		}
	}
	this.protocol = protocol

	// Check the key
	sha1 = crypto.createHash('sha1')
	sha1.end(this.key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
	if (key !== sha1.read().toString('base64')) {
		this.emit('error', new Error('Invalid handshake: hash mismatch'))
		return false
	}
	return true
}

/**
 * Process and answer a handshake started by a client
 * @param {string[]} lines one for each '\r\n'-separated HTTP request line
 * @returns {boolean} if the handshake was sucessful. If not, the connection must be closed with error 400-Bad Request
 * @private
 */
Connection.prototype.answerHandshake = function (lines) {
	var path, key, sha1, headers

	// First line
	if (lines.length < 6) {
		return false
	}
	path = lines[0].match(/^GET (.+) HTTP\/\d\.\d$/i)
	if (!path) {
		return false
	}
	this.path = path[1]

	// Extract all headers
	this.readHeaders(lines)

	// Validate necessary headers
	if (!('host' in this.headers) ||
		!('sec-websocket-key' in this.headers) ||
		!('upgrade' in this.headers) ||
		!('connection' in this.headers)) {
		return false
	}
	if (this.headers.upgrade.toLowerCase() !== 'websocket' ||
		this.headers.connection.toLowerCase().split(/\s*,\s*/).indexOf('upgrade') === -1) {
		return false
	}
	if (this.headers['sec-websocket-version'] !== '13') {
		return false
	}

	this.key = this.headers['sec-websocket-key']

	// Agree on a protocol
	if ('sec-websocket-protocol' in this.headers) {
		// Parse
		this.protocols = this.headers['sec-websocket-protocol'].split(',').map(function (each) {
			return each.trim()
		})

		// Select protocol
		if (this.server._selectProtocol) {
			this.protocol = this.server._selectProtocol(this, this.protocols)
		}
	}

	// Build and send the response
	sha1 = crypto.createHash('sha1')
	sha1.end(this.key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
	key = sha1.read().toString('base64')
	headers = {
		Upgrade: 'websocket',
		Connection: 'Upgrade',
		'Sec-WebSocket-Accept': key
	}
	if (this.protocol) {
		headers['Sec-WebSocket-Protocol'] = this.protocol
	}
	this.socket.write(this.buildRequest('HTTP/1.1 101 Switching Protocols', headers))
	return true
}

/**
 * Try to extract frame contents from the buffer (and execute it)
 * @returns {(boolean|undefined)} false=something went wrong (the connection must be closed); undefined=there isn't enough data to catch a frame; true=the frame was successfully fetched and executed
 * @private
 */
Connection.prototype.extractFrame = function () {
	var fin, opcode, B, HB, mask, len, payload, start, i, hasMask

	if (this.buffer.length < 2) {
		return
	}

	// Is this the last frame in a sequence?
	B = this.buffer[0]
	HB = B >> 4
	if (HB % 8) {
		// RSV1, RSV2 and RSV3 must be clear
		return false
	}
	fin = HB === 8
	opcode = B % 16

	if (opcode !== 0 && opcode !== 1 && opcode !== 2 &&
		opcode !== 8 && opcode !== 9 && opcode !== 10) {
		// Invalid opcode
		return false
	}
	if (opcode >= 8 && !fin) {
		// Control frames must not be fragmented
		return false
	}

	B = this.buffer[1]
	hasMask = B >> 7
	if ((this.server && !hasMask) || (!this.server && hasMask)) {
		// Frames sent by clients must be masked
		return false
	}
	len = B % 128
	start = hasMask ? 6 : 2

	if (this.buffer.length < start + len) {
		// Not enough data in the buffer
		return
	}

	// Get the actual payload length
	if (len === 126) {
		len = this.buffer.readUInt16BE(2)
		start += 2
	} else if (len === 127) {
		// Warning: JS can only store up to 2^53 in its number format
		len = this.buffer.readUInt32BE(2) * Math.pow(2, 32) + this.buffer.readUInt32BE(6)
		start += 8
	}
	if (this.buffer.length < start + len) {
		return
	}

	// Extract the payload
	payload = this.buffer.slice(start, start + len)
	if (hasMask) {
		// Decode with the given mask
		mask = this.buffer.slice(start - 4, start)
		for (i = 0; i < payload.length; i++) {
			payload[i] ^= mask[i % 4]
		}
	}
	this.buffer = this.buffer.slice(start + len)

	// Proceeds to frame processing
	return this.processFrame(fin, opcode, payload)
}

/**
 * Process a given frame received
 * @param {boolean} fin
 * @param {number} opcode
 * @param {Buffer} payload
 * @returns {boolean} false if any error occurs, true otherwise
 * @fires text
 * @fires binary
 * @private
 */
Connection.prototype.processFrame = function (fin, opcode, payload) {
	if (opcode === 8) {
		// Close frame
		if (this.readyState === this.CLOSING) {
			this.socket.end()
		} else if (this.readyState === this.OPEN) {
			this.processCloseFrame(payload)
		}
		return true
	} else if (opcode === 9) {
		// Ping frame
		if (this.readyState === this.OPEN) {
			this.socket.write(frame.createPongFrame(payload.toString(), !this.server))
		}
		return true
	} else if (opcode === 10) {
		// Pong frame
		this.emit('pong', payload.toString())
		return true
	}

	if (this.readyState !== this.OPEN) {
		// Ignores if the connection isn't opened anymore
		return true
	}

	if (opcode === 0 && this.frameBuffer === null) {
		// Unexpected continuation frame
		return false
	} else if (opcode !== 0 && this.frameBuffer !== null) {
		// Last sequence didn't finished correctly
		return false
	}

	if (!opcode) {
		// Get the current opcode for fragmented frames
		opcode = typeof this.frameBuffer === 'string' ? 1 : 2
	}

	if (opcode === 1) {
		// Save text frame
		payload = payload.toString()
		this.frameBuffer = this.frameBuffer ? this.frameBuffer + payload : payload

		if (fin) {
			// Emits 'text' event
			this.emit('text', this.frameBuffer)
			this.frameBuffer = null
		}
	} else {
		// Sends the buffer for InStream object
		if (!this.frameBuffer) {
			// Emits the 'binary' event
			this.frameBuffer = new InStream
			this.emit('binary', this.frameBuffer)
		}
		this.frameBuffer.addData(payload)

		if (fin) {
			// Emits 'end' event
			this.frameBuffer.end()
			this.frameBuffer = null
		}
	}

	return true
}

/**
 * Process a close frame, emitting the close event and sending back the frame
 * @param {Buffer} payload
 * @fires close
 * @private
 */
Connection.prototype.processCloseFrame = function (payload) {
	var code, reason
	if (payload.length >= 2) {
		code = payload.readUInt16BE(0)
		reason = payload.slice(2).toString()
	} else {
		code = 1005
		reason = ''
	}
	this.socket.write(frame.createCloseFrame(code, reason, !this.server))
	this.readyState = this.CLOSED
	this.emit('close', code, reason)
}

/**
 * Build the header string
 * @param {string} requestLine
 * @param {Object<string>} headers
 * @returns {string}
 * @private
 */
Connection.prototype.buildRequest = function (requestLine, headers) {
	var headerString = requestLine + '\r\n',
		headerName

	for (headerName in headers) {
		headerString += headerName + ': ' + headers[headerName] + '\r\n'
	}

	return headerString + '\r\n'
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file Represents a websocket server
 */


function nop() {}

var util = __webpack_require__(0),
	net = __webpack_require__(5),
	tls = __webpack_require__(7),
	events = __webpack_require__(4),
	Connection

/**
 * @callback SelectProtocolCallback
 * @param {Connection} connection
 * @param {Array<string>} protocols
 * @returns {?string}
 */

/**
 * Creates a new ws server and starts listening for new connections
 * @class
 * @param {boolean} secure indicates if it should use tls
 * @param {Object} [options] will be passed to net.createServer() or tls.createServer()
 * @param {Array<string>} [options.validProtocols]
 * @param {SelectProtocolCallback} [options.selectProtocol]
 * @param {Function} [callback] will be added as "connection" listener
 * @inherits EventEmitter
 * @event listening
 * @event close
 * @event error an error object is passed
 * @event connection a Connection object is passed
 */
function Server(secure, options, callback) {
	var that = this

	if (typeof options === 'function') {
		callback = options
		options = undefined
	}

	var onConnection = function (socket) {
		var conn = new Connection(socket, that, function () {
			that.connections.push(conn)
			conn.removeListener('error', nop)
			that.emit('connection', conn)
		})
		conn.on('close', function () {
			var pos = that.connections.indexOf(conn)
			if (pos !== -1) {
				that.connections.splice(pos, 1)
			}
		})

		// Ignore errors before the connection is established
		conn.on('error', nop)
	}

	if (secure) {
		this.socket = tls.createServer(options, onConnection)
	} else {
		this.socket = net.createServer(options, onConnection)
	}

	this.socket.on('close', function () {
		that.emit('close')
	})
	this.socket.on('error', function (err) {
		that.emit('error', err)
	})
	this.connections = []

	// super constructor
	events.EventEmitter.call(this)
	if (callback) {
		this.on('connection', callback)
	}

	// Add protocol agreement handling
	/**
	 * @member {?SelectProtocolCallback}
	 * @private
	 */
	this._selectProtocol = null

	if (options && options.selectProtocol) {
		// User-provided logic
		this._selectProtocol = options.selectProtocol
	} else if (options && options.validProtocols) {
		// Default logic
		this._selectProtocol = this._buildSelectProtocol(options.validProtocols)
	}
}

util.inherits(Server, events.EventEmitter)
module.exports = Server

Connection = __webpack_require__(1)

/**
 * Start listening for connections
 * @param {number} port
 * @param {string} [host]
 * @param {Function} [callback] will be added as "connection" listener
 */
Server.prototype.listen = function (port, host, callback) {
	var that = this

	if (typeof host === 'function') {
		callback = host
		host = undefined
	}

	if (callback) {
		this.on('listening', callback)
	}

	this.socket.listen(port, host, function () {
		that.emit('listening')
	})

	return this
}

/**
 * Stops the server from accepting new connections and keeps existing connections.
 * This function is asynchronous, the server is finally closed when all connections are ended and the server emits a 'close' event.
 * The optional callback will be called once the 'close' event occurs.
 * @param {function()} [callback]
 */
Server.prototype.close = function (callback) {
	if (callback) {
		this.once('close', callback)
	}
	this.socket.close()
}

/**
 * Create a resolver to pick the client's most preferred protocol the server recognises
 * @param {Array<string>} validProtocols
 * @returns {SelectProtocolCallback}
 * @private
 */
Server.prototype._buildSelectProtocol = function (validProtocols) {
	return function (conn, protocols) {
		var i

		for (i = 0; i < protocols.length; i++) {
			if (validProtocols.indexOf(protocols[i]) !== -1) {
				// A valid protocol was found
				return protocols[i]
			}
		}

		// No agreement
	}
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file Utility functions for creating frames
 */


/**
 * Creates a text frame
 * @param {string} data
 * @param {boolean} [masked=false] if the frame should be masked
 * @returns {Buffer}
 * @private
 */
exports.createTextFrame = function (data, masked) {
	var payload, meta

	payload = Buffer.from(data)
	meta = generateMetaData(true, 1, masked === undefined ? false : masked, payload)

	return Buffer.concat([meta, payload], meta.length + payload.length)
}

/**
 * Create a binary frame
 * @param {Buffer} data
 * @param {boolean} [masked=false] if the frame should be masked
 * @param {boolean} [first=true] if this is the first frame in a sequence
 * @param {boolean} [fin=true] if this is the final frame in a sequence
 * @returns {Buffer}
 * @private
 */
exports.createBinaryFrame = function (data, masked, first, fin) {
	var payload, meta

	first = first === undefined ? true : first
	masked = masked === undefined ? false : masked
	if (masked) {
		payload = Buffer.alloc(data.length)
		data.copy(payload)
	} else {
		payload = data
	}
	meta = generateMetaData(fin === undefined ? true : fin, first ? 2 : 0, masked, payload)

	return Buffer.concat([meta, payload], meta.length + payload.length)
}

/**
 * Create a close frame
 * @param {number} code
 * @param {string} [reason='']
 * @param {boolean} [masked=false] if the frame should be masked
 * @returns {Buffer}
 * @private
 */
exports.createCloseFrame = function (code, reason, masked) {
	var payload, meta

	if (code !== undefined && code !== 1005) {
		payload = Buffer.from(reason === undefined ? '--' : '--' + reason)
		payload.writeUInt16BE(code, 0)
	} else {
		payload = Buffer.alloc(0)
	}
	meta = generateMetaData(true, 8, masked === undefined ? false : masked, payload)

	return Buffer.concat([meta, payload], meta.length + payload.length)
}

/**
 * Create a ping frame
 * @param {string} data
 * @param {boolean} [masked=false] if the frame should be masked
 * @returns {Buffer}
 * @private
 */
exports.createPingFrame = function (data, masked) {
	var payload, meta

	payload = Buffer.from(data)
	meta = generateMetaData(true, 9, masked === undefined ? false : masked, payload)

	return Buffer.concat([meta, payload], meta.length + payload.length)
}

/**
 * Create a pong frame
 * @param {string} data
 * @param {boolean} [masked=false] if the frame should be masked
 * @returns {Buffer}
 * @private
 */
exports.createPongFrame = function (data, masked) {
	var payload, meta

	payload = Buffer.from(data)
	meta = generateMetaData(true, 10, masked === undefined ? false : masked, payload)

	return Buffer.concat([meta, payload], meta.length + payload.length)
}

/**
 * Creates the meta-data portion of the frame
 * If the frame is masked, the payload is altered accordingly
 * @param {boolean} fin
 * @param {number} opcode
 * @param {boolean} masked
 * @param {Buffer} payload
 * @returns {Buffer}
 * @private
 */
function generateMetaData(fin, opcode, masked, payload) {
	var len, meta, start, mask, i

	len = payload.length

	// Creates the buffer for meta-data
	meta = Buffer.alloc(2 + (len < 126 ? 0 : (len < 65536 ? 2 : 8)) + (masked ? 4 : 0))

	// Sets fin and opcode
	meta[0] = (fin ? 128 : 0) + opcode

	// Sets the mask and length
	meta[1] = masked ? 128 : 0
	start = 2
	if (len < 126) {
		meta[1] += len
	} else if (len < 65536) {
		meta[1] += 126
		meta.writeUInt16BE(len, 2)
		start += 2
	} else {
		// Warning: JS doesn't support integers greater than 2^53
		meta[1] += 127
		meta.writeUInt32BE(Math.floor(len / Math.pow(2, 32)), 2)
		meta.writeUInt32BE(len % Math.pow(2, 32), 6)
		start += 8
	}

	// Set the mask-key
	if (masked) {
		mask = Buffer.alloc(4)
		for (i = 0; i < 4; i++) {
			meta[start + i] = mask[i] = Math.floor(Math.random() * 256)
		}
		for (i = 0; i < payload.length; i++) {
			payload[i] ^= mask[i % 4]
		}
		start += 4
	}

	return meta
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Server = __webpack_require__(2),
	Connection = __webpack_require__(1),
	net = __webpack_require__(5),
	tls = __webpack_require__(7),
	url = __webpack_require__(14)

/**
 * Create a WebSocket server
 * @param {Object} [options] will be passed to net.createServer() or tls.createServer(), with the additional property 'secure' (a boolean)
 * @param {Function} callback will be added as 'connection' listener
 * @returns {Server}
 */
exports.createServer = function (options, callback) {
	if (typeof options === 'function' || !arguments.length) {
		return new Server(false, options)
	}
	return new Server(Boolean(options.secure), options, callback)
}

/**
 * Create a WebSocket client
 * @param {string} URL with the format 'ws://localhost:8000/chat' (the port can be ommited)
 * @param {Object} [options] will be passed to net.connect() or tls.connect()
 * @param {Function} callback will be added as 'connect' listener
 * @returns {Connection}
 */
exports.connect = function (URL, options, callback) {
	var socket

	if (typeof options === 'function') {
		callback = options
		options = undefined
	}
	options = options || {}

	var connectionOptions = parseWSURL(URL)
	options.port = connectionOptions.port
	options.host = connectionOptions.host

	connectionOptions.extraHeaders = options.extraHeaders
	connectionOptions.protocols = options.protocols

	if (connectionOptions.secure) {
		socket = tls.connect(options)
	} else {
		socket = net.connect(options)
	}

	return new Connection(socket, connectionOptions, callback)
}

/**
 * Set the minimum size of a pack of binary data to send in a single frame
 * @param {number} bytes
 */
exports.setBinaryFragmentation = function (bytes) {
	Connection.binaryFragmentation = bytes
}

/**
 * Set the maximum size the internal Buffer can grow, to avoid memory attacks
 * @param {number} bytes
 */
exports.setMaxBufferLength = function (bytes) {
	Connection.maxBufferLength = bytes
}

/**
 * Parse the WebSocket URL
 * @param {string} URL
 * @returns {Object}
 * @private
 */
function parseWSURL(URL) {
	var parts, secure

	parts = url.parse(URL)

	parts.protocol = parts.protocol || 'ws:'
	if (parts.protocol === 'ws:') {
		secure = false
	} else if (parts.protocol === 'wss:') {
		secure = true
	} else {
		throw new Error('Invalid protocol ' + parts.protocol + '. It must be ws or wss')
	}

	parts.port = parts.port || (secure ? 443 : 80)
	parts.path = parts.path || '/'

	return {
		path: parts.path,
		port: parts.port,
		secure: secure,
		host: parts.hostname
	}
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ws = __webpack_require__(8);
var fs = __webpack_require__(9);

var options = {
    secure: true,
    key: fs.readFileSync('./ssl/hwhy.key'),
    cert: fs.readFileSync('./ssl/hwhy.crt')
};
// All joined sockets
var allSockets = {};

var port = 8002;
// ws.setBinaryFragmentation();
var server = ws.createServer(options, function (conn) {
    var user = conn.path.split('?')[1];
    conn.nikeName = user;
    allSockets[user] = conn;
    // allSockets.push(conn);
    // sendTo(conn, user + '连接成功');
    // 接收到文本消息
    conn.on('text', function (str) {
        var data = JSON.parse(str);
        if (data.t === 'open') {
            // conn.sendTo(conn, data.c + 'join');
        }
        switch (data.event) {
            case 'join':
                var caller = data.callerName + data.channelId;
                console.log('join:' + caller);
                conn.callerName = caller;
                break;
        }
    });
    // 接收到二进制数据
    conn.on("binary", function (inStream) {
        var dataBuffer = Buffer.alloc(0);
        // 读取二进制数据的内容并且添加到buffer中
        inStream.on("readable", function () {
            var newData = inStream.read();
            if (newData) {
                dataBuffer = Buffer.concat([dataBuffer, newData], dataBuffer.length + newData.length);
            }
            // sendBinaryTo(conn, newData, () => {
            //     console.log('发送数据:' + data.length);
            // });
        });
        // 读取完成二进制数据后，处理二进制数据
        inStream.on("end", function () {
            process_my_data(dataBuffer, conn.callerName);
        });
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });

    conn.on("error", function (err) {
        console.log('handler error');
        console.log(err);
    });
});
server.listen(port, function () {
    console.log('websocket server listening on port ' + port);
});
function sendBinaryTo(conn, data, func) {
    if (!!conn) {
        conn.sendBinary(data, func);
    } else {
        //console.log('获取用户失败');
    }
}
function sendTo(conn, data) {
    if (!!conn) {
        conn.send(data);
    } else {
        //console.log('获取用户失败');
    }
}

function process_my_data(data, caller) {
    var conn = allSockets[caller];
    sendBinaryTo(conn, data, function () {
        // console.log('发送数据:' + data.length);
    });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file Simple wrapper for stream.Readable, used for receiving binary data
 */


var util = __webpack_require__(0),
	stream = __webpack_require__(6)

/**
 * Represents the readable stream for binary frames
 * @class
 * @event readable
 * @event end
 */
function InStream() {
	stream.Readable.call(this)
}

module.exports = InStream

util.inherits(InStream, stream.Readable)

/**
 * No logic here, the pushs are made outside _read
 * @private
 */
InStream.prototype._read = function () {}

/**
 * Add more data to the stream and fires "readable" event
 * @param {Buffer} data
 * @private
 */
InStream.prototype.addData = function (data) {
	this.push(data)
}

/**
 * Indicates there is no more data to add to the stream
 * @private
 */
InStream.prototype.end = function () {
	this.push(null)
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file Simple wrapper for stream.Writable, used for sending binary data
 */


var util = __webpack_require__(0),
	stream = __webpack_require__(6),
	frame = __webpack_require__(3)

/**
 * @class Represents the writable stream for binary frames
 * @param {Connection} connection
 * @param {number} minSize
 */
function OutStream(connection, minSize) {
	var that = this
	this.connection = connection
	this.minSize = minSize
	this.buffer = Buffer.alloc(0)
	this.hasSent = false // Indicates if any frame has been sent yet
	stream.Writable.call(this)
	this.on('finish', function () {
		if (that.connection.readyState === that.connection.OPEN) {
			// Ignore if not connected anymore
			that.connection.socket.write(frame.createBinaryFrame(that.buffer, !that.connection.server, !that.hasSent, true))
		}
		that.connection.outStream = null
	})
}

module.exports = OutStream


util.inherits(OutStream, stream.Writable)

/**
 * @param {Buffer} chunk
 * @param {string} encoding
 * @param {Function} callback
 * @private
 */
OutStream.prototype._write = function (chunk, encoding, callback) {
	var frameBuffer
	this.buffer = Buffer.concat([this.buffer, chunk], this.buffer.length + chunk.length)
	if (this.buffer.length >= this.minSize) {
		if (this.connection.readyState === this.connection.OPEN) {
			// Ignore if not connected anymore
			frameBuffer = frame.createBinaryFrame(this.buffer, !this.connection.server, !this.hasSent, false)
			this.connection.socket.write(frameBuffer, encoding, callback)
		}
		this.buffer = Buffer.alloc(0)
		this.hasSent = true
		if (this.connection.readyState !== this.connection.OPEN) {
			callback()
		}
	} else {
		callback()
	}
}

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })
/******/ ]);