var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var IO = require('socket.io');
var axios = require('axios');
var { API_PORT } = require('./configure');

var options = {
  key: fs.readFileSync('./build/hwhy.key'),
  cert: fs.readFileSync('./build/hwhy.crt')
};

app.use(express.static('dist'));

var server = https.createServer(options, app).listen(API_PORT);
console.log('The HTTPS server is up and running');

var io = IO(server);
console.log('Socket Secure server is up and running.');

// 用户
var allUsers = {};
//申请发言用户
var applyUsers = {};
//集群通话状态
var multiCall = false;
// All joined sockets
var allSockets = {};
var room = [];
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



io.on('connect', function(socket) {
  var user = ''; // current joined user

  socket.on('message', function(data) {
    var data = JSON.parse(data);
    switch (data.event) {
      // When has new user join in
      case 'join':
        user = data.name;
        // Duplicated user name is not allowed
        // if (allUsers[user]) {
        //   sendTo(socket, {
        //     event: 'join',
        //     message: '该用户名已存在, 请重新输入',
        //     success: false,
        //   });
        // } else {
          console.log('User joined', data.name);
          // Save users info  
          allUsers[user] = 1; // '0'-离线 '1'-在线 '2'-通话中
          allSockets[user] = socket;
          socket.name = user;
          showUserInfo(allUsers);
          sendTo(socket, {
            event: 'join',
            allUsers: allUsers,
            success: true,
            multiCall: multiCall
          });
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
      case 'createRoom':
        room[data.caller] = {
          partner: data.partner,
          inside: [data.caller],
          outside: data.partner
        };
        if(!!data.partner) {
          data.partner.forEach(user => {
            var conn = allSockets[user];
            sendTo(conn, {
              event: 'call',
              roomId: data.caller,
              streamType: data.streamType
            });
          })
        }
        break;
      case 'enterTheRoom':
        console.log(room);
        const index = room[data.roomId].outside.findIndex(user => user == data.name)
        if(index > 0) {
          room[data.roomId].inside.push(data.name)
          room[data.roomId].outside.splice(index, 1);
        }
        const inside = room[data.roomId].inside;
        inside.forEach(user => {
          if(user === data.name) {
            return true;
          }
          var conn = allSockets[user];
          sendTo(conn, {
            event: 'enterTheRoom',
            accept: true,
            name: data.name
          });
        })
        
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
        console.log('Sending offer to: ', data.offerUser);
        //if UserB exists then send him offer details
        var conn = allSockets[data.offerUser];
        allUsers[user] = 2;
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
        multiCall = true;
        var conn = allSockets[data.user];
        sendTo(conn, {
          event: 'multiVideo',
          source: data.source
        });
        break;
      case 'answer':
        console.log('Sending answer to: ', data.answerUser);
        var conn = allSockets[data.answerUser];
        allUsers[user] = 2;
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
        multiCall = false;
        console.log('Disconnecting ' + data.user);
        if(!!data.user) {
          let conn = allSockets[data.user];
          let conn1 = allSockets[data.remoteUser];
          allUsers[data.user] = 1;
          // allUsers[data.remoteUser] = 1;
          if(!!conn) {
            sendTo(conn, {
              event: 'leave',
              user: data.remoteUser
            });
          }
          if(!!conn1) {
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
            if(applyUsers[user] === true) {
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

  socket.on('disconnect', function() {
    multiCall = false;
    if (socket.name) {
      delete allUsers[socket.name];
      delete allSockets[socket.name];
      showUserInfo(allUsers);
      if (socket.otherName) {
        console.log('Disconnecting from ', socket.otherName);
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
  if(!!connection) {
    connection.send(message);
  } else {
    console.log('连接失败');
  }
}
