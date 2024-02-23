var ws = require("nodejs-websocket");
var fs = require('fs');

var options = {
	secure: true,
    key: fs.readFileSync('./ssl/hwhy.key'),
    cert: fs.readFileSync('./ssl/hwhy.crt')
};
// All joined sockets
var allSockets = {};

var port = 8002;
// ws.setBinaryFragmentation();
var server = ws.createServer(options, (conn) => {
	var user = conn.path.split('?')[1];
	conn.nikeName = user;
	allSockets[user] = conn;
	// allSockets.push(conn);
	// sendTo(conn, user + '连接成功');
    // 接收到文本消息
    conn.on('text', (str) => {
        var data = JSON.parse(str);
        if(data.t === 'open') {
            // conn.sendTo(conn, data.c + 'join');
        }
		switch (data.event) {
            case 'join':
                var caller = data.callerName + data.channelId;
                console.log('join:' + caller);
                conn.callerName = caller;
            break;
        }
    })
    // 接收到二进制数据
    conn.on("binary", (inStream) => {
        var dataBuffer = Buffer.alloc(0)
        // 读取二进制数据的内容并且添加到buffer中
        inStream.on("readable", () => {
            var newData = inStream.read()
            if (newData) {
                dataBuffer = Buffer.concat([dataBuffer, newData], dataBuffer.length + newData.length)
            }
            // sendBinaryTo(conn, newData, () => {
            //     console.log('发送数据:' + data.length);
            // });
        })
        // 读取完成二进制数据后，处理二进制数据
        inStream.on("end", () => {
            process_my_data(dataBuffer, conn.callerName);
        })
    })
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	})
	
	conn.on("error",function(err) {
		console.log('handler error')
		console.log(err)
	})
})
server.listen(port, function() {
	console.log('websocket server listening on port ' + port)
})
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
    sendBinaryTo(conn, data, () => {
        // console.log('发送数据:' + data.length);
    });
}