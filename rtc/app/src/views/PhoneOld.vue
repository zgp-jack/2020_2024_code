<template>
    <div class="page-content">
      <CallPending v-if="isPending"></CallPending>
      <van-nav-bar :title="title" />
      <router-view></router-view>
      <!-- <p v-for="device in deviceList">{{ device.kind + ": " + device.label }}</p> -->
      <!-- <p v-for="item,key of encodingList">----{{ key + '---' + item }}----</p> -->
      <van-tabbar v-model="active">
          <van-tabbar-item icon="home-o" @click="toPage('/device', 'device', '设备')">
            <span>设备</span>
            <template #icon="props">
              <i class="iconfont icon-shebeixinxi"></i>
            </template>
          </van-tabbar-item>
          <van-tabbar-item icon="search" @click="toPage('/users', 'users','集群')">
            <span>集群</span>
            <template #icon="props">
              <i class="iconfont icon-jiqun"></i>
            </template>
          </van-tabbar-item>
          <van-tabbar-item icon="friends-o" @click="toPage('/user', 'user','人员')">人员</van-tabbar-item>
      </van-tabbar>
    </div>
  </template>
  <script>
    import * as config from '../../configure';
    import Bus from './Bus';
    import { Dialog, Notify } from 'vant';
  
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
    window.RTCSessionDescription =
      window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
    
    const socket = io.connect(config.API_ROOT);
    const configuration = {
      iceServers: [config.DEFAULT_ICE_SERVER],
    };
    const audioConfig = {echoCancellation : true, noiseSuppression: true, sampleSize: 24, sampleRate: 192000};
    const videoConfig = {facingMode: 'user'}; //frameRate: {ideal: 10, max: 15}, width: {min: 240, ideal: 240, max: 240}
  
    let audioStream, videoStream, peerConn;
    export default {
      components: {
        CallPending: () => import('./CallPending.vue'),
      },
      data() {
        return {
          title: '设备',
          user_name: sessionStorage.user_name || 'zw',
          call_username: '',
          users: [],
          callStreamType: 'video',
          maxBitrate: 500 * 1024,
          encodingList: null,
          isPending: false,
          deviceList: []
        };
      },
      computed: {
        active: {
          get() {
            return this.$store.state.active
          },
          set(val) {
            this.$store.commit('setActive', val);
          }
        }
      },
      mounted() {
        navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          this.deviceList = devices;
          devices.forEach((device) => {
            
          });
        })
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
        });
        this.$store.commit('setActive', parseInt(sessionStorage.active) || 0);
        //语音呼叫
        Bus.$off('audioCall').$on('audioCall',user => {
          this.isPending = true;
          this.audioCall(user);
        })
        //视频呼叫
        Bus.$off('videoCall').$on('videoCall',user => {
          this.isPending = true;
          this.videoCall(user);
        })
        Bus.$off('multiVideoCall').$on('multiVideoCall', () => {
          this.multiVideoCall();
        })
        Bus.$off('multiAudioCall').$on('multiAudioCall', () => {
          this.discussCall();
        })
        //挂断
        Bus.$off('hangUpVideo').$on('hangUpVideo', () => {
          this.hangUpVideo();
        })
        //未接通挂断
        Bus.$off('pendingLeave').$on('pendingLeave', () => {
          this.isPending = false;
        })
        Bus.$off('changeFacingMode').$on('changeFacingMode', data => {
          try{
            // const track = videoStream.getVideoTracks()[0];
            // const setting = track.getSettings();
            let newMode = data.facingMode === 'user' ? 'environment' : 'user';
            videoStream.clone().getVideoTracks().forEach(track => {
              track.stop();
            })
            // videoStream = undefined;
            navigator.mediaDevices
              .getUserMedia({ video: {facingMode: newMode}, audio: audioConfig })
              .then((stream) => {
                // videoStream = stream;
                console.log('changeFacingMode', data.enabled);
                stream.getAudioTracks().forEach(t => {
                  t.enabled = data.enabled;
                })
                const track1 = stream.getVideoTracks()[0];
                for (const user in peerConn) {
                  const pc = peerConn[user];
                  if(!!pc) {
                    pc.getSenders().find(s => {
                      if(s.track.kind === track1.kind) {
                        s.replaceTrack(track1);
                        videoConfig.facingMode = newMode;
                        if(typeof data.func === 'function') {
                          data.func();
                        }
                      }
                    })
                  }
                }
                Bus.$emit('replaceVideoURL', {elementId: 'localVideo', stream: stream});
                // videoStream = stream;
              })
              .catch(function(err) {
                alert(err.name + ': ' + err.message);
              });
          }catch(e) {
            alert('catchError', e);
          }
          
        })
        Bus.$off('videoMuted').$on('videoMuted', enabled => {
          // const track = videoStream.getVideoTracks()[0];
          // const setting = track.getSettings();
          videoStream.getAudioTracks().forEach(t => {
            t.enabled = enabled;
          })
        })
        //   navigator.mediaDevices
        //     .getUserMedia({ video: setting, audio: audioConfig })
        //     .then((stream) => {
        //       videoStream = stream;
        //       const track1 = videoStream.getAudioTracks()[0];
        //       //静音
        //       track1.enabled = enabled;
        //       for (const user in peerConn) {
        //         const pc = peerConn[user];
        //         if(!!pc) {
        //           pc.getSenders().find(s => {
        //             if(s.track.kind === track1.kind) {
        //               s.replaceTrack(track1);
        //             }
        //           })
        //         }
        //       }
        //       Bus.$emit('replaceVideoURL', {elementId: 'localVideo', stream: videoStream});
        //     })
        //     .catch(function(err) {
        //       console.log(err.name + ': ' + err.message);
        //     });
        // })
        
        this.send({
            event: 'join',
            name: this.user_name,
        });
        socket.on(
          'message',
          function(data) {
            console.log(data);
            switch (data.event) {
              case 'show':
                this.setUserList(data.allUsers);
                break;
              case 'join':
                this.handleLogin(data);
                break;
              case 'call':
                this.handleCall(data);
                break;
              case 'discuss':
                this.handleDiscussAccept(data);
                break;
              case 'multiVideo':
                this.handleMultiVideoAccept(data);
                break;
              case 'speech':
                this.isSpeechCall = true;
                break;
              case 'accept':
                this.handleAccept(data);
                break;
              case 'offer':
                this.handleOffer(data);
                break;
              case 'candidate':
                this.handleCandidate(data);
                break;
              case 'msg':
                this.handleMsg(data);
                break;
              case 'answer':
                this.handleAnswer(data);
                break;
              case 'leave':
                this.handleLeave(data.user);
                break;
              case 'getSpeech':
                this.speechCall();
                break;
              default:
                break;
            }
          }.bind(this)
        );
        // this.initCreate();
      },
      methods: {
        checkAudioPermission(func1) {
          try{
            let permission = plus.navigator.checkPermission('RECORD');
            switch (permission) {
              case 'authorized':   // 允许
                func1()
              break;
              case 'denied':    // 拒绝
                this.requestPermission(func1)
              break;
              case 'undetermined':    // 询问
                this.requestPermission(func1)
              break;
              case 'unknown':    // 未知
                func1()
              break;
              default:
                Notify('设备不支持录音')
              break;
            }
          } catch(e) {
            func1();
          }
        },
        requestPermission(func1) {
            // eslint-disable-next-line
          plus.android.requestPermissions(['android.permission.RECORD_AUDIO'], (e) => {
            if (e.deniedAlways.length > 0) { // 权限被永久拒绝
              Notify({ type: 'danger', message: '录音权限被永久拒绝，请到设置权限里找到应用手动开启权限，否则将不能通话此功能。' });
            }
            if (e.deniedPresent.length > 0) { // 权限被临时拒绝
              Dialog.confirm({
                title: '警告',
                message: '拒绝开启录音权限，将不能使用此功能！确定拒绝开启吗？',
              })
                .then(() => {
                  // on confirm
                  Notify({ type: 'danger', message: '录音权限被永久拒绝，请到设置权限里找到应用手动开启权限，否则将不能通话此功能。' });
                })
                .catch(() => {
                  // on cancel
                  this.requestPermission();
                });
            }
            if (e.granted.length > 0) { // 权限被允许
              func1();
            }
          }, function (e) {
            Notify({ type: 'danger', message: '录音权限被永久拒绝，请到设置权限里找到应用手动开启权限，否则将不能通话此功能。' });
          })
        },
        handleClose() {},
        toPage(path, name, title) {
          this.$router.push({path: path, params: {name: name}});
          this.title = title;
        },
        handleLogin(data) {
          this.setUserList(data.allUsers);
          this.$store.commit('setUserList', {data: this.users});
          peerConn = {};
          setTimeout(() => {
            //手动获取权限
            this.checkAudioPermission(() => {
              //是否正在进行集群通话
              this.multiVideoCallStatus = data.multiCall;
              this.initCreate();
            })
          }, 500);
        },
        send(message) {
          socket.send(JSON.stringify(message));
        },
        setUserList(users) {
          let userList = [];
          for (const key in users) {
            if (Object.hasOwnProperty.call(users, key)) {
              userList.push({name: key, status: users[key], check: false});
            }
          }
          this.users = userList;
          this.$store.commit('setUserList', {data: this.users});
        },
        audioCall(name) {
          this.call_username = name;
          this.call(true);
        },
        videoCall(name) {
          this.call_username = name;
          this.call();
        },
        discussCall() {
          let self = this;
          for (var i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            if(user.name !== this.user_name && user.status === 1) {
              this.createConnection(user.name, true);
              this.handleAccept({name: user.name, accept: true}, 'audio');
              
              //延时执行-fixbug循环执行时，会重复建立连接发起offer
              (function (t, name) {
                  setTimeout(function () {
                    self.handleDiscuss({name: user.name}, 'audio');
                  }, 500 * t);	
              })(i, user.name)
            }
          }
        },
        handleDiscuss(data, streamType) {
          this.send({
            event: 'discuss',
            user: data.name,
            source: this.user_name
          })
        },
        multiVideoCall() {
          let self = this;
          for (var i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            if(user.name !== this.user_name && user.status === 1) {
              this.createConnection(user.name, false, false, true, true);
              this.handleAccept({name: user.name, accept: true}, 'video');
              //延时执行-fixbug循环执行时，会重复建立连接发起offer
              (function (t, name) {
                  setTimeout(function () {
                    self.handleMultiVideo({name: name}, 'video')
                  }, 500 * t);	
              })(i, user.name)
            }
          }
        },
        //讨论
        handleDiscussAccept(data) {
          this.users.forEach(user => {
            if(user.name !== this.user_name && user.name !== data.source && !peerConn[user.name]) {
              console.log('handleDiscussAccept', user.name);
              this.createConnection(user.name, true);
              this.handleAccept({name: user.name, accept: true}, 'audio');
            }
          })
        },
        //集群视频
        handleMultiVideoAccept(data) {
          this.users.forEach(user => {
            if(user.name !== this.user_name && user.name !== data.source && !peerConn[user.name]) {
              console.log('handleMultiVideoAccept', user.name);
              this.createConnection(user.name, false, false, true, true);
              this.handleAccept({name: user.name, accept: true}, 'video');
            }
          })
        },
        handleMultiVideo(data, streamType) {
          this.send({
            event: 'multiVideo',
            user: data.name,
            source: this.user_name
          })
        },
        initCreate() {
          const self = this;
          //视频流
          navigator.mediaDevices
            .getUserMedia({ audio: audioConfig, video: videoConfig })
            .then((stream) => {
              videoStream = stream;
              const tracks = videoStream.getAudioTracks();
              //正在集群视频通话
              if(this.multiVideoCallStatus) {
                this.handleMultiVideoAccept({});
              }
              // tracks[0].enabled = false;
            })
            .catch(function(err) {
              console.log(err.name + ': ' + err.message);
            });
            //音频流
            navigator.mediaDevices.getUserMedia({ audio: audioConfig, video: false })
            .then((stream) => {
              audioStream = stream;
            })
            .catch(function(err) {
              console.log(err.name + ': ' + err.message);
            });
            //屏幕流
            //TODO
        },
        call(audio) {
          if (this.call_username.length > 0) {
            if (this.users.find(user => user.name === this.call_username).status === 1) {
              // connectedUser = this.call_username;
              this.createConnection(this.call_username, audio);
              this.send({
                event: 'call',
                connectedUser: this.call_username,
                streamType: audio ? 'audio': 'video'
              });
              this.callStreamType = audio ? 'audio': 'video';
            } else {
              this.isPending = false;
              Notify('您呼叫的用户正在通话中');
            }
          } else {
            this.isPending = false;
            Notify('您呼叫的用户暂不在线');
          }
        },
        addAudioURL(elementId, stream) {
          Bus.$emit('addAudioURL', {elementId, stream});
          Bus.$emit('setCallName', {name: this.call_username});
        },
        addVideoURL(elementId, stream) {
          Bus.$emit('addVideoURL', {elementId, stream});
          Bus.$emit('addVideoURL', {elementId: 'localVideo', stream: videoStream});
        },
        createConnection(remoteUser, audio, dontInput, multiVideo) {
          peerConn[remoteUser] = new RTCPeerConnection(configuration);
          let localStream = !!audio ? audioStream : videoStream;
          peerConn[remoteUser].addStream(localStream);
          peerConn[remoteUser].streamType = !!audio ? 'audio' : 'video';
          
          peerConn[remoteUser].onaddstream = e => {
            if(dontInput) {
              // this.showAudioContrl = true;
              return;
            }
            if(!!audio) {
              this.addAudioURL('audio' + Math.random()*1000, e.stream)
            } else {
              if(multiVideo) {
                this.addVideoURL('video' + Math.random()*1000, e.stream)
              } else {
                this.addVideoURL('playVideo', e.stream);
              }
            }
          };
          peerConn[remoteUser].onicecandidate = event => {
            console.log( 'onicecandidate');
            setTimeout(() => {
              if (event.candidate) {
                this.send({
                  event: 'candidate',
                  candidate: event.candidate,
                  otherName: remoteUser,
                  connectedUser: this.user_name
                });
              }
            });
          };
        },
        handleMsg(data) {
          console.log(data.message);
        },
        handleCall(data) {
          this.callStreamType = data.streamType;
          this.call_username = data.name;
          Dialog.confirm({
            title: '邀请',
            message: `${data.name}请求${data.streamType==='video' ? '视频' : '语音'}通话，是否接受?`,
          })
            .then(() => {
              this.accept();
            })
            .catch(() => {
              this.reject();
            });
        },
        reject() {
          this.send({
            event: 'accept',
            accept: false,
          });
        },
        accept() {
          this.send({
            event: 'accept',
            accept: true,
            connectedUser: this.call_username
          });
        },
        handleAccept(data, streamType) {
          let self = this;
          if(data.accept) {
            self.isPending = false;
            streamType = streamType || this.callStreamType;
            // Create an offer
            peerConn[data.name].createOffer(
              offer => {
                this.send({
                  event: 'offer',
                  offer: offer,
                  offerUser: data.name,
                  answerUser: self.user_name,
                  streamType: streamType
                });
                peerConn[data.name].setLocalDescription(offer);
              },
              error => {
                Notify('建立连接失败');
              }
            );
          } else {
            Bus.$emit('rejection');
            console.log('对方拒接');
          }
        },
        insertStr (str, index, insertStr) {
          if(index < 0) {
            return str;
          }
          return str.substring(0, index) + insertStr + str.substring(index)
        },
        handleOffer(data) {
          console.log(data);
          this.call_username = data.answerUser;
          if(!peerConn[data.answerUser] && data.answerUser != this.user_name) {
            this.createConnection(data.answerUser, data.streamType === 'audio', data.single);
          }
          //判断是否为视频流
          if(peerConn[data.answerUser].streamType === 'video') {
            //a=rtcp-fb:96 transport-cc x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150
            data.offer.sdp = this.insertStr(data.offer.sdp, data.offer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150\r\n')
          }
          peerConn[data.answerUser].setRemoteDescription(new RTCSessionDescription(data.offer));
          // Create an answer to an offer
          peerConn[data.answerUser].createAnswer(
            answer => {
              peerConn[data.answerUser].setLocalDescription(answer);
              this.send({
                event: 'answer',
                answer: answer,
                answerUser: data.answerUser, //offer发起者
                connectedUser: data.name
              });
            },
            error => {
              Notify('建立连接失败');
            }
          );
        },
        handleAnswer(data) {
          if(peerConn[data.name].streamType === 'video') {
            data.answer.sdp = this.insertStr(data.answer.sdp, data.answer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150\r\n')
          }
          peerConn[data.name].setRemoteDescription(new RTCSessionDescription(data.answer));
        },
        handleCandidate(data) {
          // ClientB 通过 PeerConnection 的 AddIceCandidate 方法保存起来
          console.log(peerConn, data.name, 'handleCandidate');
          peerConn[data.name].addIceCandidate(new RTCIceCandidate(data.candidate));
        },
        hangUpVideo() {
          for (const name in peerConn) {
            if(!!peerConn[name]) {
              this.send({
                event: 'leave',
                user: this.user_name,
                remoteUser: name
              });
            }
          }
        },
        handleLeave(user) {
          if(!!user && !!peerConn[user]) {
            peerConn[user].close();
            peerConn[user].onicecandidate = null;
            peerConn[user].onaddstream = null;
            peerConn[user] = null;
          } else {
            for (const name in peerConn) {
              if(!!peerConn[name]) {
                peerConn[name].close();
                peerConn[name].onicecandidate = null;
                peerConn[name].onaddstream = null;
                peerConn[name] = null;
                this.send({
                  event: 'leave',
                  user: this.user_name,
                  remoteUser: name
                });
              }
            }
          }
          const allClose = this.allClose();
          if(allClose) {
            Bus.$emit('handleLeave');
          }
        },
        allClose() {
          let allClose = true;
          for (const key in peerConn) {
            if (Object.hasOwnProperty.call(peerConn, key)) {
              const conn = peerConn[key];
              if(!!conn) {
                allClose = false;
              }
            }
          }
          return allClose;
        }
      },
      beforeDestroy() {
        
      },
      watch: {
        active: function(val) {
          sessionStorage.setItem('active', val);
          // this.handleLeave();
        }
      }
    }
  </script>
  <style lang="css">
  .page-content {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #f7f8fa;
    color: #323233;
    font-size: 16px;
  }
  .el-icon-menu{
    font-size: 36px;
  }
    .el-aside{
      background-color: #000;
      font-size: 4rem;
      padding-top: 3rem;
    }
    .drawer-menu{
      background-color: #000 !important;
      color: #fff;
      font-size: 8rem;
      padding-top: 4rem;
    }
    .drawer-menu .menu-item{
      height: 30rem;
    }
    .drawer-menu .menu-item i{
      font-size: 8rem;
    }
    .drawer-menu .menu-item p{
      font-size: 4rem;
      font-weight: bold;
    }
    .box-title{
      margin: 0;
      padding: 16px 16px 16px;
      color: rgba(69, 90, 100, 0.6);
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      text-align: left;
      vertical-align: middle;
  }
  .van-button::before{
    border: 0;
  }
  </style>