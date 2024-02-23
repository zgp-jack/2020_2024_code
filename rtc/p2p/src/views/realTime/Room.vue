<template>
	<div class="room">
		<el-container v-show="isVideo">
			<el-aside width="300px">
				<el-tabs type="border-card" style="height: calc(100% - 47px);" v-model="activeCard">
					<el-tab-pane label="终端" name="1">
						<DeviceTree ref="deviceTree" v-if="activeCard === '1'" :list="deviceTree" @playerEvent="playerEvent" @roomEvent="roomEvent"></DeviceTree>
					</el-tab-pane>
					<el-tab-pane label="群指" name="2">
						<GroupTree v-if="activeCard === '2'" :list="groupTree" @playerEvent="playerEvent" @roomEvent="roomEvent"></GroupTree>
					</el-tab-pane>
					<el-tab-pane label="投屏" name="3" style="position: relative">
						<ScreenTree v-if="activeCard === '3'" :list="deviceTree" @playerEvent="playerEvent" @roomEvent="roomEvent"></ScreenTree>
					</el-tab-pane>
				</el-tabs>
			</el-aside>
			<el-main style="padding: 0; padding-left: 20px">
				<!-- <RtcPlayer ref="rtcPlayer" v-if="videoUrl" :videoUrl="videoUrl" :elementId="videoElement"></RtcPlayer> -->
				<Player
					ref="player"
					@send="send"
					@sendBlob="sendBlob"
					@videoShare="videoShare"
					@setUserAudioStatus="setUserAudioStatus"
					@changeIsVideoRecord="isVideoRecord = true"
					@changeIsVideo="isVideo = true"
					@closeVideo="closeVideo"
					@setTreeCheck="setTreeCheck"
					:userName="user_name"
					:callingStreamType="callingStreamType"
					:callingUsername="callingUsername"
				></Player>
			</el-main>
			<el-dialog title="通话请求" :visible.sync="accept_video" width="240px" center>
				<span style="color: #D4E1FF;">{{ acceptMsg }}</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="reject()">取 消</el-button>
					<el-button type="primary" @click="accept()">确 定</el-button>
				</span>
			</el-dialog>
		</el-container>
		<video v-show="!isVideo" id="videoRecord" autoplay muted controls></video>
	</div>
</template>

<script>
import axios from 'axios';
import Bus from '../Bus';

export default {
	components: {
		DeviceTree: () => import('./DeviceTree.vue'),
		GroupTree: () => import('./GroupTree.vue'),
		ScreenTree: () => import('./ScreenTree.vue'),
		RtcPlayer: () => import('./rtcPlayer.vue'),
		VideoRecord: () => import('./videoRecord.vue'),
		Player: () => import('./Player.vue'),
		CameraControl: () => import('./CameraControl.vue'),
		VirtualRocker: () => import('./VirtualRocker.vue'),
	},
	data() {
		return {
			user_name: sessionStorage.getItem('user_name'),
			user: JSON.parse(sessionStorage.getItem('user')),
			activeCard: '1',
			deviceTree: [],
			users: [],
			callingUsername: '',
			// remote_video: '',
			accept_video: false,
			// onlineUser: [],
			// allUserList: [],
			groupTree: [],
			callingStreamType: 'video',
			acceptMsg: '您有视频邀请，是否接受',

			multiVideoCallStatus: false,
			callingRoomId: '',
			groupAddVisible: false,
			connectUserName: [],

			deviceList: [],
			channelList: [],
			rtpList: {},
			videoUrl: '',
			isVideoShare: true,
			videoElement: '',
			deviceListData: [],
			ws: null,
			isVideo: true,
			visibleWfs: false,
			wfsCheck: null,
			screenStream: null,
			screenRecorder: null,
			typeList: [
				{ id: 1, name: 'user' },
				{ id: 2, name: 'wfs' },
				{ id: 3, name: 'sdk' },
				{ id: 4, name: 'drone' },
				{ id: 5, name: 'map' },
			],
			playDeviceList: [], //正在播放的设备
			sdkList: [],
			messageOpen: false
		};
	},
	mounted() {
		this.initWebpack();
		
		this.getGroupList();
		this.getUserList();
		// this.getConnectedDevices();
		document.addEventListener('click', (e) => {
			this.visible = false;
			this.visibleWfs = false;
			this.visibleGroup = false;
			this.visibleScreen = false;
		});
		window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e));

		// socket.on('disconnect', (reason) => {
		// 	console.log('disconnect reason:' + reason);
		// });
		// socket.on('reconnect', (timeout) => {
		// 	console.log('reconnect');
		// 	this.send({
		// 		event: 'join',
		// 		name: this.user_name,
		// 	});
		// });
	},
	methods: {
		roomEvent(data) {
			this[data.event](...data.args);
		},
		playerEvent(data) {
			this.$refs['player'][data.event](...data.args);
		},
		setCallingUsername(name) {
			this.callingUsername = name;
		},
		setConnectUserName(name) {
			this.connectUserName.push(name);
		},
		videoShare(data) {
			this.isVideo = false;
			let elementId = data.elementId;
			let stream = data.stream;
			this.$nextTick(() => {
				var video = document.getElementById(elementId);
				if ('srcObject' in video) {
					video.srcObject = stream;
				} else {
					video.src = window.URL.createObjectURL(stream);
				}
			});
		},
		sendBlob(data) {
			this.ws.send(data);
		},
		handleShare(data) {},
		initWebpack() {
			const wsurl = window.configure.WS_SERVER + '?' + this.user_name; //ws地址,这里加入自己的地址即可'ws://192.168.2.42:9040/api/websocket/user_'
			this.ws = new WebSocket(wsurl);
			this.ws.onopen = this.onopen;
			this.ws.onmessage = this.onmessage;
			this.ws.onclose = this.onclose;
			this.ws.onerror = this.onerror;
		},
		reconnect() {
			//重新连接
			var that = this;
			if (that.lockReconnect) {
				return;
			}
			that.lockReconnect = true;
			//没连接上会一直重连，设置延迟避免请求过多
			that.timeoutnum && clearTimeout(that.timeoutnum);
			that.timeoutnum = setTimeout(function () {
				//新连接
				that.initWebpack();
				that.lockReconnect = false;
			}, that.timeout);
		},
		reset() {
			//重置心跳
			var that = this;
			//清除时间
			clearTimeout(that.timeoutObj);
			clearTimeout(that.serverTimeoutObj);
			//重启心跳
			// that.start();
		},
		start() {
			//开启心跳
			// var self = this;
			// self.timeoutObj && clearTimeout(self.timeoutObj);
			// self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
			// self.timeoutObj = setTimeout(function(){
			// 	//这里发送一个心跳，后端收到后，返回一个心跳消息，
			// 	if (self.ws.readyState == 1) {//如果连接正常
			// 		self.ws.send("heartCheck"); //这里可以自己跟后端约定
			// 	}else{//否则重连
			// 		self.reconnect();
			// 	}
			// 	self.serverTimeoutObj = setTimeout(function() {
			// 		//超时关闭
			// 		self.ws.close();
			// 	}, self.timeout);
			// }, self.timeout)
			if (this.ws.readyState == 1) {
				this.send({
					event: 'join',
					name: this.user_name,
				});
			}
		},
		onopen() {
			//开启心跳
			this.start();
		},
		onmessage(e) {
			//下面这块代码，接收到后端返回的消息后，根据自己的需求去判断
			if (e.data == 'heartCheck' || e.data == '连接成功') {
			} else {
				let data = JSON.parse(e.data);
				switch (data.event) {
					case 'messageOpen':
						this.handleMessageOpen();
						break;
					case 'closedShare':
						this.$refs['player'].closedShare(data);
						break;
					case 'share':
						this.handleShare(data);
						break;
					case 'show':
						this.setUserList(data.allUsers);
						break;
					case 'join':
						this.handleLogin(data);
						break;
					case 'joinMultiCall':
						this.multiVideoCallStatus = true;
						break;
					case 'call':
						this.handleCall(data);
						break;
					case 'speech':
						this.$refs['player'].setSpeechCall(true);
						break;
					case 'connectUser':
						this.$refs['player'].handleConnectUser(data);
						break;
					case 'enterTheRoom':
						this.$refs['player'].handleEnterTheRoom(data);
						break;
					case 'leaveTheRoom':
						this.$refs['player'].handleLeaveTheRoom(data);
						break;
					case 'accept':
						this.$refs['player'].handleAccept(data);
						break;
					case 'offer':
						this.$refs['player'].handleOffer(data);
						break;
					case 'candidate':
						this.$refs['player'].handleCandidate(data);
						break;
					case 'msg':
						this.$refs['player'].handleMsg(data);
						break;
					case 'answer':
						this.$refs['player'].handleAnswer(data);
						break;
					case 'leave':
						this.handleLeave(data.user);
						break;
					case 'getSpeech':
						this.speechCall();
						break;
					case 'disconnect':
						console.log('disconnect');
						break;
					default:
						break;
				}
			}
			//收到服务器信息，心跳重置
			// this.reset();
		},
		onclose(e) {
			//重连
			this.reconnect();
		},
		onerror(e) {
			//重连
			this.reconnect();
		},
		handleMessageOpen() {
			this.messageOpen = true;
			if(this.sdkList.length) {
				this.send({
					event: 'sdkList',
					list: this.sdkList
				})
			}
		},
		getUserList() {
			axios.get('/api/user/query').then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					let treeList = data.data.map((item) => {
						const type = this.typeList.find((type) => type.id === item.type);
						const channelsId = item.channelsId ? item.channelsId.split(',') : [];
						let children = [];
						if(type.name === 'wfs') {
							channelsId.forEach((channel, index) => {
								children.push({
									deviceName: item.username,
									name: `通道${index + 1}`,
									id: channel,
									deviceId: item.deviceId,
									status: 0,
									type: 'channel',
									check: false,
								})
							})
						}
						if(type.name === 'sdk') {
							this.sdkList.push({
								deviceIp: item.deviceIp,
								devicePort: item.devicePort,
								deviceUser: item.deviceUser,
								devicePassword: item.devicePassword
							})
							if(this.messageOpen) {
								this.send({
									event: 'sdkList',
									list: this.sdkList
								})
							}
						}
						return {
							name: item.username,
							id: item.id,
							deviceId: item.deviceId,
							deviceIp: item.deviceIp,
							devicePort: item.devicePort,
							deviceUser: item.deviceUser,
							devicePassword: item.devicePassword,
							type: !!type ? type.name : 'user',
							status: this.users.findIndex((u) => u.name === item.username) >= 0 ? 1 : 0, //在线
							check: false,
							children: children,
							audioStauts: 0
						};
					});
					treeList.sort((a, b) => b.status - a.status);
					this.deviceTree = treeList;
				}
			});
		},
		setUserListCheck(data) {
			// let treeList = JSON.parse(JSON.stringify(this.deviceTree));
			let treeList = this.deviceTree;
			if(treeList.length) {
				treeList.forEach(item => {
					item.check = item.id === data.id;
					if(item.type === 'wfs') {
						item.children.forEach(c => {
							c.check = c.id === data.id;
						})
					}
				})
				// this.$set(this, 'deviceTree', [...treeList])
			}
		},
		setGroupListCheck(data) {
			this.groupTree.forEach(g => {
				g.check = g.id === data.id;
			})
			console.log(this.groupTree);
		},
		// 终端列表
		setUserList(users) {
			this.users = users;
			if(this.deviceTree.length) {
				this.deviceTree.forEach(item => {
					// if(this.users.findIndex(u => u.name === item.name) >= 0) {
					// 	item.status = 1;
					// }
					if(item.type === 'wfs') {
						item.status = this.users.findIndex(u => u.name === item.deviceId) >= 0 ? 1 : 0;
						item.status && item.children.forEach(c => {
							c.status = 1;
						})
					} else {
						item.status = this.users.findIndex(u => u.name === item.name) >= 0 ? 1 : 0;
					}
				});
				let treeList = JSON.parse(JSON.stringify(this.deviceTree));
				treeList.sort((a, b) => b.status - a.status);
				// this.deviceTree = treeList;
				this.$set(this, 'deviceTree', [...treeList])
			} else {
				setTimeout(() => {
					this.setUserList(users);
				}, 500);
			}
			if(this.groupTree.length) {
				this.groupTree.forEach((item) => {
					item.children.forEach((u) => {
						u.online = users.findIndex((uu) => uu.name === u.name) >= 0		
					});
				})
			}
		},
		// 设备上线
		handleDeviceUpLine(device) {
			// 设备上线
			const params = {
				deviceId: device.name,
				name: device.name,
				channels: device.subName.map((c) => {
					return {
						deviceId: device.name,
						channelId: c,
						name: c,
					};
				}),
			};
		},
		getGroupList() {
			const users = this.users;
			this.$axios({
				method: 'get',
				url: '/api/group/getGroupList',
				params: { userId: this.user.id },
			}).then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.groupTree = data.data.map((item) => {
						return {
							id: item.id,
							name: item.name,
							main: true,
							check: false,
							children: [
								...item.userList.map((u) => {
									return {
										id: u.userId,
										name: u.userName,
										online: users.findIndex((uu) => uu.name === u.userName) >= 0,
										master: u.roleId === 1,
										type: u.type,
									};
								}),
							],
						};
					});
				}
			});
		},
		setUserAudioStatus(name) {
			this.deviceTree.forEach(item => {
				item.audioStauts = 0;
				if(item.name === name) {
					item.audioStauts = 1;
				}
			})
		},
		// 登录ws
		handleLogin(data) {
			if (data.success === false) {
				alert('用户名已存在');
			} else {
				this.setUserList(data.allUsers);
				if (!data.device) {
					//是否正在进行集群通话
					this.multiVideoCallStatus = data.multiCall;
					// peerConn = {};
					// this.$refs['player'].initCreate();
					setTimeout(() => {
						if (this.user_name === 'zw') {
							//this.handleConnectUser({caller: 'ywl', streamType: 'video'})
						}
					}, 3000);
				}
			}
		},
		setUserCheck(name) {
			for (let user of this.users) {
				if (user.name === name) {
					user.check = true;
				} else {
					user.check = false;
				}
			}
		},
		setTreeCheck(video) {
			const type = video.type;
			let data = this.deviceTree.find(c => {
				if(type === 'wfs') {
					return c.deviceId === video.params.deviceId;
				} else {
					return c.name === video.name;
				}
			})
			if(!!data) {
				if(type === 'wfs') {
					data = data.children.find(c => c.id === video.params.channelId);
				}
				this.$refs['deviceTree'].setCurrentNode(data);
			}
		},
		// 呼叫公用
		call(audio) {
			if (this.handleConnectStatus()) {
				return false;
			}
			if (this.callingUsername === this.user_name) {
				return false;
			}
			if (!!this.callingUsername) {
				this.showMulitVideoContrl = true;
				this.callingRoomId = this.user_name;
				this.$refs['player'].setCallRoomId(this.callingRoomId, audio);
				this.send({
					event: 'createRoom',
					caller: this.user_name,
					partner: [this.callingUsername],
					streamType: this.callingStreamType,
					mode: 'cross', //unilaterally单向 bidirectional双向 cross互相
					specific: [], //指定特殊连接用户
					specificMode: 'bidirectional', //指定用户连接模式
				});
			}
		},
		// 集群通话
		multiVideoCall(type, group) {
			if (this.handleConnectStatus()) {
				return false;
			}
			let self = this;
			type = type || 'video';
			//呼叫的用户
			let userList = [];
			let deviceList = [];
			//不在线的用户
			let offlineUserList = [];
			if (type === 'video') {
				self.showMulitVideoContrl = true;
			} else {
				self.showAudioContrl = true;
			}
			const groupUser = group.children;
			groupUser.forEach((user) => {
				if (user.name !== this.user_name) {
					if (user.type == 1) {
						userList.push(user.name);
					} else {
						if(user.online) {
							deviceList.push(user.name);
						}
					}
					//不在线的手持机
					if (!user.online && user.type === 1) {
						offlineUserList.push(user.name);
					}
				}
			});
			//在线设备，拉取视频流
			if (deviceList.length) {
				deviceList.forEach(d => {
					this.deviceTree[0].children.forEach(u => {
						if(u.name === d) {
							//默认取第一个通道
							const channel = u.children[0];
							this.connectUser('wfs', u.name, channel);
						}
					})
				})
			}
			this.callingStreamType = type;
			this.callingRoomId = this.user_name;
			this.$refs['player'].setCallRoomId(this.callingRoomId);
			this.send({
				event: 'createRoom',
				caller: this.user_name,
				offline: offlineUserList,
				partner: userList,
				streamType: type,
				mode: 'cross', //unilaterally单向 bidirectional双向 cross互相
				specific: [], //指定特殊连接用户
				specificMode: 'bidirectional', //指定用户连接模式
				groupId: group.groupId,
			});
		},
		// 语音呼叫
		audioCall() {
			this.callingStreamType = 'audio';
			this.call();
		},
		// 视频呼叫
		videoCall() {
			this.callingStreamType = 'video';
			this.call();
		},
		cameraControl(commad) {
			console.log(commad);
		},
		// ws发送消息
		send(message) {
			// if (connectedUser !== null) {
			//   message.connectedUser = remoteUser;
			// }
			this.ws.send(JSON.stringify(message));
		},
		// 被叫
		handleCall(data) {
			this.callingStreamType = data.streamType;
			this.callingRoomId = data.roomId;
			this.$refs['player'].setCallRoomId(this.callingRoomId);
			this.callingUsername = data.roomId;
			if (!!data.groupId) {
				Bus.$emit('setGroupChecked', data.groupId);
			}
			if (data.needAccept) {
				this.accept_video = true;
				this.acceptMsg = `${this.callingUsername}请求${data.streamType === 'video' ? '视频' : '语音'}通话，是否接受?`;
			} else {
				this.accept();
			}
		},
		// 被叫拒绝
		reject() {
			this.send({
				event: 'enterTheRoom',
				accept: false,
				name: this.user_name,
				roomId: this.callingRoomId,
			});
			this.accept_video = false;
		},
		// 被叫同意
		accept() {
			this.showMulitVideoContrl = true;
			this.send({
				event: 'enterTheRoom',
				accept: true,
				name: this.user_name,
				roomId: this.callingUsername,
			});
			this.accept_video = false;
		},
		// 预览状态
		handleConnectStatus() {
			let connectStatus = false;
			if (this.connectUserName.length > 0) {
				this.$confirm('正在预览视频，请先关闭预览视频', '提示', {
					confirmButtonText: '关闭预览视频',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						for (let item of this.videos) {
							if (!!item.show) {
								this.closeVideo(item, item.key);
							}
						}
					})
					.catch(() => {});
				connectStatus = true;
			}
			return connectStatus;
		},
		// 视频右上角关闭
		closeVideo(item) {
			const name = `${item.deviceId}-${item.channelId}`;
			this.playDeviceList = this.playDeviceList.filter((item) => {
				return item !== name
			});
			if(this.$refs['deviceTree'])
				this.$refs['deviceTree'].toolCtlVisible = false;
		},
		closePreview() {
			this.accept_video = false;
		},
		hangUp() {
			this.$refs['player'].hangUp();
		},
		beforeunloadFn(e) {
			e = e || window.event;
			if (e) {
				e.returnValue = '关闭提示';
			}
			this.hangUp();
			// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
			return '关闭提示';
		},
	},
	beforeDestroy() {
		//window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
	},
	watch: {
		activeCard: function(val) {
			if(val === '2') {
				this.$refs['player'].handleChangeVideoGrid(3);
			} else {
				this.$refs['player'].handleChangeVideoGrid(0);
			}
		}
	},
};
</script>
<style lang="css" scoped>
.room {
	width: 100%;
	height: 100%;
	/* background-color: #012147; */
}
.el-container{
	padding: 20px;
	height: 100%;
	background-color: transparent;
}
.green_color {
	color: #409EFF;
}
.red_color {
	color: red;
}
.list-group-item {
	cursor: pointer;
}
.context-menu {
	position: fixed;
	height: 160px;
	border: 1px solid #ccc;
	border-radius: 4px;
	z-index: 9999;
	background-color: #fff;
	text-align: left;
	padding: 10px 40px 10px 15px;
}
.context-menu ul {
	margin: 0;
	padding: 0;
	list-style: none;
	line-height: 26px;
	cursor: pointer;
}
.context-menu ul i {
	font-size: 14px;
}
#videoRecord {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
}
</style>
