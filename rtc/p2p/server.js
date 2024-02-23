var express = require('express');
var app = express();
var https = require('https');
var path = require('path');
var fs = require('fs');
var IO = require('socket.io');
var axios = require('axios');
var { API_PORT, API_SERVER_ROOT } = require('./configure');
// 导入nodejs-websocket模块
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

var options = {
    key: fs.readFileSync('./build/hwhy.key'),
    cert: fs.readFileSync('./build/hwhy.crt')
};

let camera_cnt = 0;     // 记录摄像头socket连接的序号
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

app.use(express.static('dist'));

var server = https.createServer(options, app).listen(API_PORT);
console.log('The HTTPS server is up and running');

var io = IO(server);
console.log('Socket Secure server is up and running.');

// 用户
var allUsers = {};
//申请发言用户
var applyUsers = {};
// All joined sockets
var allSockets = {};
var room = {};
// axios.get('http://192.168.2.83:8001/user/query')
// .then(res => {
//   // console.log(res);
//   if(!!res.data) {
//     for (const item of res.data) {
//       allUsers[item.username] = item.status
//     }
//   }
//   // console.log(allUsers);
// })

io.on('connect', function (socket) {
    console.log('new connect:', socket.id);
    socket.on('message', function (dataV) {
        console.log('new message:', dataV);
        if (dataV.event === 'StartRecord' || dataV.event === 'WriteRecord' || dataV.event === 'EndRecord') {
            return streamHandle(dataV)
        }
        var data = JSON.parse(dataV);
        switch (data.event) {
            // When has new user join in
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
                allUsers[user] = 1; // '0'-离线 '1'-在线 '2'-通话中
                allSockets[user] = socket;
                socket.name = user;
                showUserInfo(allUsers);
                sendTo(socket, {
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
                // }
                break;
            case 'setMode':
                socket.mode = data.mode;
                switch (data.mode) {
                    case 'speech':
                        for (const user in allUsers) {
                            let conn = allSockets[user];
                            if (conn != null) {
                                sendTo(conn, {
                                    event: 'speech',
                                });
                            }
                        }
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
            //创建房间
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
                if (conn != null) {
                    showUserInfo(allUsers);
                    // Setting that UserA connected with UserB
                    socket.otherName = data.offerUser;
                    sendTo(conn, {
                        event: 'offer',
                        offer: data.offer,
                        name: data.offerUser,
                        answerUser: data.answerUser,
                        streamType: data.streamType,
                        single: data.single
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
                    showUserInfo(allUsers);
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
                showUserInfo(allUsers);
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
                showUserInfo(allUsers);
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
    });
    socket.on('reconnect', (timeout) => {

        console.log('reconnect' + timeout);
    });
    socket.on('disconnect', (reason) => {
        console.log(socket.name, ' Disconnect' + ' reason:' + reason);

        if (socket.name) {
            // var reConnect = allSockets[socket.name];
            // console.log(reConnect);
            // if(reConnect) {
            //   sendTo(reConnect, {
            //     type: 'disconnect',
            //   });
            // }
            delete allUsers[socket.name];
            if (reason === 'ping timeout') {
                delete allSockets[socket.name];
            }
            showUserInfo(allUsers);
            if (socket.otherName) {
                var conn = allSockets[socket.otherName];
                allUsers[socket.otherName] = 1;
                socket.otherName = null;
                if (conn != null) {
                    sendTo(conn, {
                        type: 'leave',
                    });
                }
            }
        }
    });
});

function showUserInfo(allUsers) {
    sendTo(io, {
        event: 'show',
        allUsers: allUsers,
    });
}

function sendTo(connection, message) {
    if (!!connection) {
        connection.send(message);
    } else {
        console.log('连接失败');
    }
}


// 将webm转为mp4
function webmToMp4(file_name) {
    // webm转mp4
    let command = ffmpeg('./videoRecord/' + file_name + '.webm')
    command.on('start', function (str) {
        console.log('start trans webm to mp4...', str)
        console.log('please waiting...')
    })
    command.on('progress', function (progress) {
        console.log("trans " + file_name + " ing...", progress.timemark)
    })
    command.on('end', function (str) {
        console.log('trans to mp4 done! filename = ', file_name + '.mp4', str)
        fs.unlinkSync('./videoRecord/' + file_name + '.webm')
    })
    command.save('./videoRecord/mp4/' + file_name + '.mp4')
}
// 处理录像流
let file_name = null;
let writerStream = null;
let startTime;
function streamHandle(data) {
    if (data.event == 'StartRecord') {
        console.log('StartRecord')
        startTime = data.time;
        camera_cnt++;
        file_name = camera_cnt + '_camera'
        writerStream = fs.createWriteStream('./videoRecord/' + file_name + '.webm', { flags: 'w' });
    } else if (data.event == 'WriteRecord') {
        writerStream.write(data.data)
    } else if (data.event == 'EndRecord') {
        console.log('EndRecord')
        setTimeout(() => {
            writerStream.end();
            axios.defaults.headers["access-token"] = data.token;
            axios.post(`${API_SERVER_ROOT}/api/video/record/uploadFilePath`,
                { userId: data.id, associationId: 2, associationId: 0, startTime: startTime, endTime: data.time, filePath: path.resolve(__dirname, 'videoRecord'), fileName: file_name + '.webm' })
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
