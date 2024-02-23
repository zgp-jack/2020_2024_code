<template>
  <div class="page-content">
    <CallPending v-if="isPending"></CallPending>
    <van-nav-bar :title="title" />
    <router-view></router-view>
    <!-- <p v-for="device in deviceList">{{ device.kind + ": " + device.groupId + device.deviceId }}</p> -->
    <!-- <p v-for="item,key of encodingList">----{{ key + '---' + item }}----</p> -->
    <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o" @click="toPage('/device', 'device', '设备')">
          <span>设备</span>
          <template #icon="props">
            <i class="iconfont icon-shebeixinxi"></i>
          </template>
        </van-tabbar-item>
        <van-tabbar-item icon="search" @click="toPage('/group', 'group','集群')">
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
  let videoConfig = {facingMode: {exact: 'environment'}}; //frameRate: {ideal: 10, max: 15}, width: {min: 240, ideal: 240, max: 240}

  let audioStream, videoStream;
  let peerConn = {}
  export default {
    components: {
      CallPending: () => import('./CallPending.vue'),
    },
    data() {
      return {
        title: '设备',
        user_name: sessionStorage.user_name || 'zw',
        callingUsername: '',
        users: [],
        callingStreamType: 'video',
        maxBitrate: 500 * 1024,
        encodingList: null,
        isPending: false,
        deviceList: [],
        trackList: '',
        callingRoomId: '',
        multiCall: false
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
      Bus.$off('multiVideoCall').$on('multiVideoCall', group => {
        this.multiVideoCall(group);
      })
      Bus.$off('multiAudioCall').$on('multiAudioCall', group => {
        this.multiVideoCall(group, 'audio');
      })
      //挂断
      Bus.$off('hangUpVideo').$on('hangUpVideo', () => {
        this.leaveTheRoom();
      })
      Bus.$off('hangUpAudio').$on('hangUpAudio', () => {
        this.leaveTheRoom();
      })
      //未接通挂断
      Bus.$off('pendingLeave').$on('pendingLeave', () => {
        this.isPending = false;
      })
      Bus.$off('changeFacingMode').$on('changeFacingMode', data => {
        try{
          // const track = videoStream.getVideoTracks()[0];
          // const setting = track.getSettings();
          let newMode = data.facingMode;
          videoStream.getVideoTracks().forEach(track => {
            track.stop();
          })
          let deviceIndex = data.deviceIndex;
          let videoParam = {}
          if(!!newMode) {
            if(newMode === 'environment') {
              if(!!localStorage.deviceid) {
                videoParam.deviceId = localStorage.deviceid;
              } else {
                videoParam.facingMode = {exact: 'environment'}; //{exact: 'environment'};
              }
            } else {
              videoParam.facingMode = 'user';
            }
          } else {
            const videoInput = this.deviceList.filter(d => d.kind === 'videoinput');
            videoParam.deviceId = videoInput[deviceIndex].deviceId;
            deviceIndex++;
            if(deviceIndex >= videoInput.length || deviceIndex >=3) {
              deviceIndex = 1;
            }
            localStorage.setItem('deviceid', videoParam.deviceId)
          }
          if(typeof data.func === 'function') {
            data.func(deviceIndex);
          }
          // videoStream = undefined;
          navigator.mediaDevices
            .getUserMedia({ video: videoParam, audio: audioConfig })
            .then((stream) => {
              stream.getAudioTracks().forEach(t => {
                t.enabled = data.enabled;
              })
              
              const [videoTrack] = stream.getVideoTracks();
              for (const user in peerConn) {
                const pc = peerConn[user];
                if(!!pc) {
                  const sender = pc.getSenders().find(s => s.track.kind === videoTrack.kind);
                  sender.replaceTrack(videoTrack);
                  if(!!newMode) {
                    videoConfig.facingMode = newMode;
                  }
                }
              }
              Bus.$emit('replaceVideoURL', {elementId: 'localVideo', stream: stream});
              videoStream = stream;
            })
            .catch(function(err) {
              if(typeof data.func === 'function') {
                data.func(1);
              }
              alert(err.name + ': ' + err.message);
            });
        }catch(e) {
          alert('catchError', e);
        }
        
      })
      Bus.$off('videoMuted').$on('videoMuted', enabled => {
        videoStream.getAudioTracks().forEach(t => {
          t.enabled = enabled;
        })
        const [audioTrack] = videoStream.getAudioTracks();
        for (const user in peerConn) {
          const pc = peerConn[user];
          if(!!pc) {
            const sender = pc.getSenders().find(s => s.track.kind === 'audio');
            sender.replaceTrack(audioTrack);
          }
        }
      })
      Bus.$off('addUserToGroupSuccess').$on('addUserToGroupSuccess', list => {
        this.addUserToGroupSuccess(list);
      })
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
            case 'multiVideo':
              this.handleMultiVideoAccept(data);
              break;
            case 'speech':
              this.isSpeechCall = true;
              break;
            case 'connectUser':
              this.handleConnectUser(data);
              break;
            case 'enterTheRoom':
              this.handleEnterTheRoom(data);
              break;
            case 'leaveTheRoom':
              this.handleLeaveTheRoom(data);
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
            case 'disconnect':
              Notify('网络异常，您已断开连接，请重新登录');
              setTimeout(() => {
                this.$router.push({path: '/login'});
              }, 500)
              break;
            default:
              break;
          }
        }.bind(this)
      );
      // this.initCreate();
      socket.on('disconnect', (reason) => {
        console.log('disconnect reason:' + reason);
      })
      socket.on('reconnect', (timeout) => {
        this.send({
            event: 'join',
            name: this.user_name,
        });
      });
    },
    methods: {
      handleConnectUser(data) {
        this.createConnection(data.caller, false, true);
        this.handleAccept({name: data.caller, accept: true}, 'video');
      },
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
      addUserToGroupSuccess(insertList) {
        //如果存在房间
        console.log(insertList);
        const users = this.users;
        let offline = [];
        insertList.forEach(u => {
          offline.push(u.label);
        })
        if(!!this.callingRoomId) {
          this.send({
            event: 'updateRoom',
            roomId: this.callingRoomId,
            jion: offline,
            offline: offline
          })
        }
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
        this.callingUsername = name;
        this.callingStreamType = 'audio';
        this.call(true);
      },
      videoCall(name) {
        if(!!name) {
          this.callingUsername = name;
        }
        this.callingStreamType = 'video';
        this.call();
      },
      multiVideoCall(group, streamType) {
        let self = this;
        streamType = streamType || 'video';
        this.callingUsername = group.name;
        //呼叫的用户
        let userList = [];
        //不在线的用户
        let offlineUserList = [];
        const groupUser = group.children;
        groupUser.forEach(user => {
          if(user.name !== this.user_name) {
            userList.push(user.name);
            if(!user.online) {
              offlineUserList.push(user.name);
            }
          }
        })
        this.callingStreamType = streamType;
        this.callingRoomId = this.user_name;
        this.send({
          event: 'createRoom',
          caller: this.user_name,
          offline: offlineUserList,
          partner: userList,
          streamType: streamType,
          mode: 'cross', //unilaterally单向 bidirectional双向 cross互相
          specific: [], //指定特殊连接用户
          specificMode: 'bidirectional', //指定用户连接模式
          groupId: group.id,
          groupName: group.name
        })
        if(streamType === 'video') {
          Bus.$emit('addVideoURL', {elementId: 'localVideo', stream: videoStream});
        } else {
          this.isPending = true;
        }
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
      handleEnterTheRoom(data) {
        // this.showMulitVideoContrl = true;
        this.createConnection(data.name, false, false, data.mode === 'cross');
        this.handleAccept({name: data.name, accept: true}, 'video');
      },
      handleLeaveTheRoom(data) {
        if(!!data.name && !!peerConn[data.name]) {
          peerConn[data.name].close();
          peerConn[data.name].onicecandidate = null;
          peerConn[data.name].onaddstream = null;
          peerConn[data.name] = null;
        }
        const allClose = this.allClose();
        if(allClose) {
          setTimeout(() => {
            if(this.callingStreamType === 'video') {
              Bus.$emit('handleLeaveVideo');
            } else {
              Bus.$emit('handleLeaveAudio');
            }
          }, 100);
        }
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
        // const videoInput = this.deviceList.filter(d => d.kind === 'videoinput');
        // videoConfig.deviceId = videoInput[2].deviceId;
        let videoParam = {};
        if(!!localStorage.deviceid) {
          videoParam.deviceId = localStorage.deviceid;
        } else {
          videoParam.facingMode = videoConfig.facingMode;
        }
        //视频流
        navigator.mediaDevices
          .getUserMedia({ audio: audioConfig, video: videoParam })
          .then((stream) => {
            videoStream = stream;
            // const [tracks] = videoStream.getVideoTracks();
            
            // const conss = {focusMode: {exact: 'manual'}, focusDistance: {exact: 0.33}};
            // tracks.applyConstraints(conss);
            // const consObj = navigator.mediaDevices.getSupportedConstraints();
            // for (const key in consObj) {
            //     if (Object.hasOwnProperty.call(consObj, key)) {
            //       const value = consObj[key];
            //       this.trackList += `${key}:${value}\t\n`
            //     }
            //   }
            //   this.trackList+='-----setting------'
            //   const setObj = tracks.getSettings();
            //   for (const key in setObj) {
            //     if (Object.hasOwnProperty.call(setObj, key)) {
            //       const value = setObj[key];
            //       this.trackList += `${key}:${value}\t\n`
            //     }
            //   }
              
            //正在集群视频通话
            // if(this.multiVideoCallStatus) {
            //   this.handleMultiVideoAccept({});
            // }
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
        if (this.callingUsername.length > 0) {
          if(this.callingUsername === this.user_name) {
            return false;
          }
          if(!!this.callingUsername) {
            this.callingRoomId = this.user_name;
            this.send({
              event: 'createRoom',
              caller: this.user_name,
              partner: [this.callingUsername],
              streamType: this.callingStreamType,
              mode: 'bidirectional', //unilaterally单向 bidirectional双向 cross互相
              specific: [], //指定特殊连接用户
              specificMode: 'bidirectional' //指定用户连接模式
            })
          }
        } else {
          this.isPending = false;
          Notify('您呼叫的用户暂不在线');
        }
      },
      addAudioURL(elementId, stream) {
        Bus.$emit('addAudioURL', {elementId, stream});
        Bus.$emit('setCallName', {name: this.callingUsername});
      },
      addVideoURL(elementId, stream) {
        Bus.$emit('addVideoURL', {elementId, stream});
      },
      createConnection(remoteUser, audio, dontInput, multiVideo) {
        const isAudio = this.callingStreamType === 'audio';
        peerConn[remoteUser] = new RTCPeerConnection(configuration);
        let localStream = isAudio ? audioStream : videoStream;
        peerConn[remoteUser].addStream(localStream);
        peerConn[remoteUser].streamType = this.callingStreamType;
        
        peerConn[remoteUser].onaddstream = e => {
          if(dontInput) {
            // this.showAudioContrl = true;
            return;
          }
          if(isAudio) {
            this.addAudioURL('audio' + remoteUser, e.stream)
          } else {
            if(multiVideo) {
              this.addVideoURL('video' + remoteUser, e.stream);
            } else {
              this.addVideoURL('playVideo', e.stream);
            }
            Bus.$emit('addVideoURL', {elementId: 'localVideo', stream: videoStream});
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
        //ice状态改变
        peerConn[remoteUser].oniceconnectionstatechange = event => {
          if (peerConn[remoteUser].iceConnectionState === "failed") {
            Notify(remoteUser + '网络连接失败，正在进行重连');
            peerConn[remoteUser].restartIce();
          }
        };
      },
      handleMsg(data) {
        console.log(data.message);
      },
      handleCall(data) {
        if(data.multiCall) {
          this.$router.push({path: '/group', params: {name: 'group'}});
          this.$store.commit('setActive', 1);
        } else {
          this.$router.push({path: '/device', params: {name: 'device'}});
          this.$store.commit('setActive', 0);
        }
        this.callingStreamType = data.streamType;
        this.callingRoomId = data.roomId;
        this.callingUsername = data.groupName || data.roomId;
        this.multiCall = data.multiCall;
        if(!!data.groupId) {
          Bus.$emit('setGroupChecked', data.groupId)
        }
        Dialog.confirm({
          title: '邀请',
          message: `${this.callingUsername}请求${data.streamType==='video' ? '视频' : '语音'}通话，是否接受?`,
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
          event: 'enterTheRoom',
          accept: false,
          name: this.user_name,
          roomId: this.callingRoomId
        });
      },
      accept() {
        this.send({
          event: 'enterTheRoom',
          accept: true,
          name: this.user_name,
          roomId: this.callingRoomId
        });
      },
      handleAccept(data, streamType) {
        let self = this;
        if(data.accept) {
          self.isPending = false;
          streamType = streamType || this.callingStreamType;
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
        // this.callingUsername = data.answerUser;
        if(!peerConn[data.answerUser] && data.answerUser != this.user_name) {
          this.createConnection(data.answerUser, data.streamType === 'audio', data.single, this.multiCall);
        }
        //判断是否为视频流
        if(peerConn[data.answerUser].streamType === 'video') {
          //a=rtcp-fb:96 transport-cc x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150
          // data.offer.sdp = this.insertStr(data.offer.sdp, data.offer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=500;x-google-min-bitrate=500;x-google-start-bitrate=500\r\n')
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
            Notify('建立连接失败' + error);
          }
        );
      },
      handleAnswer(data) {
        if(peerConn[data.name].streamType === 'video') {
          // data.answer.sdp = this.insertStr(data.answer.sdp, data.answer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=500;x-google-min-bitrate=500;x-google-start-bitrate=500\r\n')
        }
        peerConn[data.name].setRemoteDescription(new RTCSessionDescription(data.answer));
      },
      handleCandidate(data) {
        // ClientB 通过 PeerConnection 的 AddIceCandidate 方法保存起来
        console.log(peerConn, data.name, 'handleCandidate');
        peerConn[data.name].addIceCandidate(new RTCIceCandidate(data.candidate));
      },
      leaveTheRoom() {
        this.send({
          event: 'leaveTheRoom',
          name: this.user_name,
          roomId: this.callingRoomId
        });
        //挂断，断开所有连接
        for (const name in peerConn) {
          if(!!peerConn[name]) {
            peerConn[name].close();
            peerConn[name].onicecandidate = null;
            peerConn[name].onaddstream = null;
            peerConn[name] = null;
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
          if(this.callingStreamType === 'video') {
            Bus.$emit('handleLeaveVideo');
          } else {
            Bus.$emit('handleLeaveAudio');
          }
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
      console.log('beforeDestroy');
      socket && socket.disconnect();
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