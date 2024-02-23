var ws = require("nodejs-websocket");
var fs = require('fs');
var axios = require('axios');
var path = require('path');

var options = {
    secure: true,
    key: fs.readFileSync('./ssl/hwhy.key'),
    cert: fs.readFileSync('./ssl/hwhy.crt')
};

// 用户
var allUsers = [];
//申请发言用户
var applyUsers = {};
// All joined sockets
var allSockets = {};
var room = {};
var device = {};
var dataBuffer = Buffer.alloc(0);
var writerStream = null;
var writerShare = [];
var timer = null;

var port = 8001;
// ws.setBinaryFragmentation();
var server = ws.createServer(options, (socket) => {
    const user = socket.path.split('?')[1];
    socket.nikeName = user;
    allSockets[user] = socket;
    console.log(socket.path);
    //message上线
    if(user === 'message') {
        broadcast(server, {
            event: 'messageOpen',
        });
    }
    // 接收到文本消息
    socket.on('text', (str) => {
        if (str === 'heartCheck') {
            broadcast(server, 'heartCheck');
            return;
        }
        var data = JSON.parse(str);
        if (data.event === 'StartRecord' || data.event === 'WriteRecord' || data.event === 'EndRecord') {
            return streamHandle(data)
        }
        switch (data.event) {
            // When has new user join in
            case 'StartShare':
                const conS = allSockets[data.shareName];
                sendTo(conS, {
                    event: 'share',
                    name: data.name,
                    shareName: data.shareName
                });
                break;
            case 'closeShare':
                const con = allSockets[data.shareName];
                if (writerShare.length) {
                    writerShare = writerShare.filter(item => item.name != data.shareName)
                }
                sendTo(con, {
                    event: 'closedShare',
                    name: data.name,
                    shareName: data.shareName
                });
                break;
            case 'join':
                let user = data.name;
                console.log('User joined', data.name);
                //集群通话状态
                let waitRoom = null;
                try {
                    for (const id in room) {
                        if (Object.hasOwnProperty.call(room, id)) {
                            const r = room[id];
                            if (!!r && !!r.offline && r.offline.length > 0 && r.offline.indexOf(data.name) >= 0) {
                                console.log('呼叫');
                                waitRoom = r;
                            }
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                // Save users info 
                if (allUsers.findIndex(u => u.name === user) < 0) {
                    allUsers.push({ name: user, status: 1, subName: data.subName }); // '0'-离线 '1'-在线 '2'-通话中
                }
                broadcast(server, {
                    event: 'join',
                    allUsers: allUsers,
                    success: true,
                    multiCall: false
                });
                if (!!waitRoom) {
                    setTimeout(() => {
                        sendTo(socket, {
                            event: 'call',
                            roomId: waitRoom.caller,
                            streamType: waitRoom.streamType,
                            needAccept: true,
                            multiCall: true
                        });
                    })
                }
                if (writerShare.length) {
                    writerShare.forEach(data => {
                        if (data.name == user) {
                            const conn = allSockets[data.name];
                            socket.otherName = data.name;
                            sendTo(conn, data);
                        }
                    })
                }
                // }
                break;
            case 'setMode':
                socket.mode = data.mode;
                switch (data.mode) {
                    case 'speech':
                        broadcast(server, {
                            event: 'speech',
                        })
                        // for (const user in allUsers) {
                        //     let conn = allSockets[user];
                        //     if (conn != null) {
                        //         sendTo(conn, {
                        //             event: 'speech',
                        //         });
                        //     }
                        // }
                        break;
                    default: break;
                }
                break;
            //直连设备取流
            case 'connectUser':
                if (!!room[data.caller]) {
                    room[data.caller]['partner'].push(data.partner);
                    room[data.caller]['inside'].push(data.partner);
                } else {
                    room[data.caller] = {
                        caller: data.caller,
                        partner: [data.partner],
                        inside: [data.caller, data.partner],
                        outside: [],
                        streamType: 'video'
                    };
                }
                var conn = allSockets[data.partner];
                sendTo(conn, {
                    event: 'connectUser',
                    caller: data.caller,
                    streamType: data.streamType
                });
                break;
            //sdk设备列表
            case 'sdkList':
                var conn = allSockets['message'];
                console.log(data.caller + ' retrun sdkList')
                sendTo(conn, {
                    event: 'sdkList',
                    list: data.list
                });
                break;
            //sdk播放
            case 'sdkCall':
                var conn = allSockets['message'];
                console.log(data.caller + ' sdkCall message')
                sendTo(conn, {
                    event: 'sdkCall',
                    caller: data.caller,
                    deviceIp: data.deviceIp,
                    devicePort: data.devicePort,
                    deviceUser: data.deviceUser,
                    devicePassword: data.devicePassword
                });
                break;
                // 开始拉流
            case 'wfsCall':
                var conn = allSockets['message'];
                console.log(data.caller + ' wfsCall message')
                sendTo(conn, {
                    event: 'wfsCall',
                    caller: data.caller,
                    deviceId: data.deviceId,
                    channelId: data.channelId,
                });
                break;
            // 停止拉流
            case 'wfsStop':
                var conn = allSockets['message'];
                console.log('wfsStop message')
                sendTo(conn, {
                    event: 'wfsStop',
                    caller: data.caller,
                    deviceId: data.deviceId,
                    channelId: data.channelId,
                });
                break;
            case 'cameraControl':
                var conn = allSockets['message'];
                sendTo(conn, {
                    event: 'cameraControl',
                    action: data.action,
                    caller: data.caller,
                    deviceId: data.deviceId,
                    channelId: data.channelId,
                    speed: data.speed
                });
            break;
            case 'createRoom':
                if (data.mode !== 'unilaterally') {
                    room[data.caller] = {
                        caller: data.caller,
                        partner: data.partner,
                        offline: data.offline,
                        inside: [data.caller],
                        outside: data.partner,
                        mode: data.mode,
                        streamType: data.streamType,
                        groupId: data.groupId
                    };
                    if (!!data.partner) {
                        data.partner.forEach(user => {
                            var conn = allSockets[user];
                            sendTo(conn, {
                                event: 'call',
                                roomId: data.caller,
                                streamType: data.streamType,
                                needAccept: true,
                                groupId: data.groupId,
                                groupName: data.groupName,
                                multiCall: data.mode === 'cross'
                            });
                        })
                    }
                }
                console.log('createRoom', room[data.caller]);
                break;
            //修改房间
            case 'updateRoom':
                if (!!room[data.roomId]) {
                    room[data.roomId].partner = room[data.roomId].partner.concat(data.jion);
                    room[data.roomId].offline = room[data.roomId].offline.concat(data.offline);
                    room[data.roomId].outside = room[data.roomId].outside.concat(data.jion);
                    console.log('updateRoom', room[data.roomId]);
                    data.jion.forEach(user => {
                        var conn = allSockets[user];
                        sendTo(conn, {
                            event: 'call',
                            roomId: room[data.roomId].caller,
                            streamType: room[data.roomId].streamType,
                            needAccept: true,
                            groupId: room[data.roomId].groupId,
                            groupName: room[data.roomId].groupName,
                            multiCall: room[data.roomId].mode === 'cross'
                        });
                    })
                }
                break;
            //加入房间
            case 'enterTheRoom':
                if (!data.accept) {
                    console.log(data.name + ' reject called');
                    return false;
                }
                let o_inside = room[data.roomId].inside; //房间内的成员
                let o_outside = room[data.roomId].outside; //房间外的成员
                const outIndex = o_outside.findIndex(user => user == data.name);
                if (outIndex >= 0) {
                    o_inside.push(data.name)
                    o_outside.splice(outIndex, 1);
                }
                console.log(`[${data.name}] enter the room`);
                console.log(`inside:${o_inside}|outside:${o_outside}`);
                //通知所有房间内成员新成员加入
                o_inside.forEach(user => {
                    if (user === data.name) {
                        return true;
                    }
                    var conn = allSockets[user];
                    sendTo(conn, {
                        event: 'enterTheRoom',
                        accept: true,
                        name: data.name,
                        mode: room[data.roomId].mode
                    });
                })
                break;
            //
            case 'closeVideo':
                var conn = allSockets[data.closer];
                sendTo(conn, {
                    event: 'leaveTheRoom',
                    name: data.caller
                });
                break;
            case 'leaveTheRoom':
                if (!!room[data.roomId]) {
                    let l_inside = room[data.roomId].inside;
                    let l_outside = room[data.roomId].outside;
                    const inIndex = l_inside.findIndex(user => user == data.name)
                    if (inIndex >= 0) {
                        l_outside.push(data.name)
                        l_inside.splice(inIndex, 1);
                    }
                    l_inside.forEach(user => {
                        var conn = allSockets[user];
                        sendTo(conn, {
                            event: 'leaveTheRoom',
                            name: data.name
                        });
                    })
                    console.log(`[${data.name}] leave the room`);
                    console.log(`inside:${l_inside}|outside:${l_outside}`);
                    //房间内没有用户，关闭房间
                    if (l_inside.length <= 1) {
                        console.log('close room');
                        room[data.roomId] = null;
                    }
                }
                break;
            case 'call':
                var conn = allSockets[data.connectedUser];
                sendTo(conn, {
                    event: 'call',
                    name: socket.name,
                    streamType: data.streamType
                });
                break;

            case 'offer':
                // i.e. UserA wants to call UserB
                console.log(data.answerUser + 'Sending offer to: ' + data.offerUser);
                //if UserB exists then send him offer details
                var conn = allSockets[data.offerUser];
                // allUsers[user] = 2;
                if (!conn && data.isScreen) {
                    writerShare.push({
                        event: 'offer',
                        offer: data.offer,
                        name: data.offerUser,
                        answerUser: data.answerUser,
                        streamType: data.streamType,
                        single: data.single,
                        isScreen: data.isScreen
                    })
                }
                if (conn != null) {
                    // broadcast(server, allUsers);
                    // Setting that UserA connected with UserB
                    socket.otherName = data.offerUser;
                    sendTo(conn, {
                        event: 'offer',
                        offer: data.offer,
                        name: data.offerUser,
                        answerUser: data.answerUser,
                        streamType: data.streamType,
                        single: data.single,
                        isScreen: data.isScreen
                    });
                } else {
                    sendTo(socket, {
                        event: 'msg',
                        message: 'Not found this name',
                    });
                }
                break;
            case 'accept':
                var conn = allSockets[data.connectedUser];
                if (conn != null) {
                    if (data.accept) {
                        sendTo(conn, {
                            event: 'accept',
                            accept: true,
                            name: socket.name
                        });
                    } else {
                        allUsers[data.connectedUser] = true;
                        sendTo(conn, {
                            event: 'accept',
                            accept: false,
                            name: socket.name
                        });
                    }
                }
                break;
            case 'discuss':
                var conn = allSockets[data.user];
                sendTo(conn, {
                    event: 'discuss',
                    source: data.source
                });
                break;
            case 'multiVideo':
                var conn = allSockets[data.user];
                sendTo(conn, {
                    event: 'multiVideo',
                    source: data.source
                });
                break;
            case 'answer':
                console.log(data.connectedUser + 'Sending answer to: ' + data.answerUser);
                var conn = allSockets[data.answerUser];
                // allUsers[user] = 2;
                if (conn != null) {
                    // broadcast(server, allUsers);
                    socket.otherName = data.answerUser;
                    sendTo(conn, {
                        event: 'answer',
                        answer: data.answer,
                        name: data.connectedUser
                    });
                }
                break;

            case 'candidate':
                var conn1 = allSockets[data.otherName];
                var conn2 = allSockets[data.connectedUser];
                if (conn1 != null) {
                    sendTo(conn1, {
                        event: 'candidate',
                        candidate: data.candidate,
                        name: data.connectedUser
                    });
                } else {
                    sendTo(conn2, {
                        event: 'candidate',
                        candidate: data.candidate,
                        name: data.otherName
                    });
                }
                break;

            case 'leave':
                console.log(data.user + 'leave the room');
                if (!!data.user) {
                    let conn = allSockets[data.user];
                    let conn1 = allSockets[data.remoteUser];
                    allUsers[data.user] = 1;
                    // allUsers[data.remoteUser] = 1;
                    if (!!conn) {
                        sendTo(conn, {
                            event: 'leave',
                            user: data.remoteUser
                        });
                    }
                    if (!!conn1) {
                        sendTo(conn1, {
                            event: 'leave',
                            user: data.user
                        });
                    }
                } else {
                    for (const user in allUsers) {
                        let conn = allSockets[user];
                        allUsers[user] = 1;
                        if (conn != null) {
                            sendTo(conn, {
                                event: 'leave',
                            });
                        }
                    }
                }
                // broadcast(server, allUsers);
                break;
            //申请发言
            case 'speechApply':
                //
                applyUsers[data.name] = true;
                break;
            case 'releaseSpeech':
                for (const user in allUsers) {
                    let conn = allSockets[user];
                    allUsers[user] = 1;
                    if (conn != null) {
                        sendTo(conn, {
                            event: 'leave',
                        });
                    }
                }
                // broadcast(server, allUsers);
                setTimeout(() => {
                    for (const user in allUsers) {
                        if (applyUsers[user] === true) {
                            // console.log('Get Speech from ', user);
                            let conn = allSockets[user];
                            sendTo(conn, {
                                event: 'getSpeech',
                            });
                            applyUsers[user] = false;
                            break;
                        }
                    }
                }, 1000)
        }
    })
    // 接收到二进制数据
    socket.on("binary", (inStream) => {
        // dataBuffer = Buffer.alloc(0)
        // 读取二进制数据的内容并且添加到buffer中
        inStream.on("readable", () => {
            var newData = inStream.read()
            if (newData) {
                dataBuffer = Buffer.concat([dataBuffer, newData], dataBuffer.length + newData.length)
                writerStream.write(newData)
                // socket.send(newData)
            }
            // sendBinaryTo(conn, newData, () => {
            //     console.log('发送数据:' + data.length);
            // });
        })
        // 读取完成二进制数据后，处理二进制数据
        inStream.on("end", () => {
            // process_my_data(dataBuffer, socket.callerName);
        })
    })
    socket.on("close", function (code, reason) {
        console.log("Connection closed")
    })

    socket.on("error", function (err) {
        console.log('handler error')
        console.log(err)
    })
})
server.listen(port, function () {
    console.log('websocket server listening on port ' + port)
})
function sendTo(conn, message) {
    if (!!conn) {
        conn.sendText(JSON.stringify(message));
    } else {
        console.log('获取用户失败');
    }
}
function broadcast(server, info) {
    server.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify(info))
    })
}
// 处理录像流
let file_name = null;
let startTime;
let today;
function streamHandle(data) {
    if (data.event == 'StartRecord') {
        console.log('StartRecord');
        startTime = data.time;
        //文件名
        today = new Date();
        let yy = today.getFullYear();
        let mm = today.getMonth();
        let dd = today.getDay();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        let ss = today.getMilliseconds();
        let camera_cnt = `${yy}${mm}${dd}${h}${m}${s}_${ss}`;
        file_name = camera_cnt + '_camera'

        dataBuffer = Buffer.alloc(0)
        writerStream = fs.createWriteStream('./videoRecord/' + file_name + '.webm', { flags: 'w' });
    } else if (data.event == 'WriteRecord') {
        writerStream.write(dataBuffer)
    } else if (data.event == 'EndRecord') {
        console.log('EndRecord');
        setTimeout(() => {
            writerStream.end();
            dataBuffer = Buffer.alloc(0)
            axios.defaults.headers["access-token"] = data.token;
            axios.post(`http://localhost:18080/api/video/record/uploadFilePath`,
                { userId: data.id, associationId: 2, associationId: 0, startTime: startTime, endTime: data.time, filePath: 'videoRecord/', fileName: file_name + '.webm' })
                .then(res => {
                    if (res.code == 0) {
                        console.log(res.data.data.message)
                    }
                })
                .catch(err => {
                    console.log(err.data)
                })
        }, 1000)
    }
}