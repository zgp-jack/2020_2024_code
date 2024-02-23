<template>
	<el-container v-if="isVideo" style="padding: 5px; background-color: #293955; max-height: calc(100% - 74px)">
		<el-aside width="350px">
			<el-descriptions title="用户信息" border style="margin-bottom: 10px; padding: 10px">
				<template slot="extra">
					<el-button type="text" @click="loginOut()"><i class="el-icon-switch-button"></i></el-button>
				</template>
				<el-descriptions-item label="用户名">{{ user_name }}</el-descriptions-item>
				<el-descriptions-item label="设备">
					<el-tooltip placement="top">
						<div slot="content">
							<p v-for="item in device_msg">{{ item.label }}</p>
						</div>
						<span>{{ device_name }}</span>
					</el-tooltip>
				</el-descriptions-item>
			</el-descriptions>
			<el-tabs type="border-card" style="height: calc(100% - 137px)">
				<el-tab-pane label="设备">
					<div style="text-align: left; height: 500px">
						<el-tree :data="deviceTree" node-key="id" default-expand-all>
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<p
									@contextmenu.prevent.stop="
										data.ns != 'guobiao' && rightClick(data.type || 'device', $event, data.name, data)
									"
									@dblclick="connectUser(data.type, data.name, data)"
									@click="leftClick(data.type || 'device', data.name)"
									style="cursor: pointer; margin: 0"
								>
									<template v-if="data.main">
										<i class="el-icon-s-home green_color" :size="20"></i>
										<span class="green_color">{{ data.name }}</span>
									</template>
									<template v-else>
										<i :class="['el-icon-user-solid', data.status ? 'green_color' : '']" :size="20"></i>
										<span :class="[data.status ? 'green_color' : '']">{{ data.name }}</span>
									</template>
								</p>
							</span>
						</el-tree>
					</div>
					<el-row class="tab-tool-panel">
						<span v-show="toolVisible">
							<el-tooltip class="item" effect="dark" content="语音通话" placement="top-start">
								<el-button type="primary" icon="el-icon-microphone" circle @click="audioCall()"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="视频通话" placement="top-start">
								<el-button type="success" icon="el-icon-video-camera" circle @click="videoCall()"></el-button>
							</el-tooltip>
							<!-- <el-tooltip class="item" effect="dark" content="屏幕共享" placement="top-start">
                <el-button type="info" icon="el-icon-s-platform" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="监听" placement="top-start">
                <el-button type="warning" icon="el-icon-headset" circle></el-button>
              </el-tooltip> -->
						</span>
					</el-row>
				</el-tab-pane>
				<el-tab-pane label="集群">
					<div style="text-align: left; height: 500px">
						<el-tree :data="groupList" node-key="id" :expand-on-click-node="false">
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<span @contextmenu.prevent.stop="rightClick('group', $event, data)" @click="leftClick('group', data)">
									<template v-if="data.main">
										<i class="el-icon-menu" :size="20"></i>
										<span>{{ data.name }}</span>
									</template>
									<template v-else>
										<i
											:class="[
												data.type == 1 ? 'el-icon-user-solid' : 'el-icon-video-camera-solid',
												data.online ? 'green_color' : '',
											]"
											:size="20"
										></i>
										<span :class="[data.online ? 'green_color' : '']">{{ data.name }}</span>
									</template>
								</span>
							</span>
						</el-tree>
					</div>
					<el-row class="tab-tool-panel">
						<span v-show="toolVisibleGroup">
							<!-- <el-tooltip class="item" effect="dark" content="发言" placement="top-start">
								<el-button type="primary" icon="el-icon-mic" circle @click="speechCall()"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="广播" placement="top-start">
								<el-button type="success" icon="el-icon-bell" circle @click="broadcastCall()"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="点名" placement="top-start">
								<el-button type="info" icon="el-icon-thumb" circle @click="namedCall()"></el-button>
							</el-tooltip> -->
							<el-tooltip class="item" effect="dark" content="添加成员" placement="top-start">
								<el-button type="info" icon="el-icon-circle-plus" circle @click="addUserToGroup()"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="语音通话" placement="top-start">
								<el-button type="primary" icon="el-icon-mic" circle @click="multiVideoCall('audio')"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="视频通话" placement="top-start">
								<el-button type="success" icon="el-icon-video-camera" circle @click="multiVideoCall()"></el-button>
							</el-tooltip>
						</span>
					</el-row>
				</el-tab-pane>
				<el-tab-pane label="人员" style="position: relative">
					<div style="text-align: left; height: 100%; height: 500px">
						<el-tree :data="usersTree" node-key="id" default-expand-all>
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<p
									@contextmenu.prevent.stop="rightClick('device', $event, data.name)"
									@dblclick="connectUser('device', data.name)"
									@click="leftClick('device', data.name)"
									style="cursor: pointer; margin: 0"
								>
									<el-avatar :size="20" icon="el-icon-user-solid" style="vertical-align: middle"></el-avatar>
									<span :class="[data.check ? 'green_color' : '']">{{ data.name }}</span>
									<!-- <span :class="[data.status ? 'green_color' : 'red_color']">{{ data.status === 1 ? '(在线)' : data.status === 2 ? '(正在通话)' : '(离线)' }}</span> -->
								</p>
							</span>
						</el-tree>
					</div>
					<el-row v-show="toolVisible" class="tab-tool-panel">
						<el-button type="primary" icon="el-icon-microphone" circle></el-button>
						<el-button type="success" icon="el-icon-video-camera" circle></el-button>
						<el-button type="info" icon="el-icon-s-platform" circle></el-button>
						<el-button type="warning" icon="el-icon-headset" circle></el-button>
						<el-button
							type="danger"
							:icon="isVideoRecord ? 'el-icon-video-play' : 'el-icon-video-pause'"
							@click="videoRecord"
							title="录像"
							circle
						></el-button>
					</el-row>
				</el-tab-pane>
			</el-tabs>
		</el-aside>
		<el-main style="padding: 0; padding-left: 5px">
			<RtcPlayer ref="rtcPlayer" v-if="videoUrl" :videoUrl="videoUrl" :elementId="videoElement"></RtcPlayer>
			<div id="videoBox">
				<div :class="['video-box', videoGrid]" @dblclick="handleFullScreen('localVideo', true)">
					<video id="localVideo" autoplay muted controls></video>
				</div>
				<div
					:class="['video-box', videoGrid]"
					v-for="(item, index) in videos"
					:key="index"
					@dblclick="handleFullScreen(item.key + 'Video', item.show)"
				>
					<video :id="item.key + 'Video'" autoplay muted v-show="item.show"></video>
					<div class="video-control" v-show="item.show">
						<el-button type="text" @click="closeVideo(item, item.key)">
							<i class="el-icon-close" style="color: #fff; font-weight: bold"></i>
						</el-button>
					</div>
				</div>
				<div id="audioBox"></div>
			</div>
		</el-main>
		<div class="preview" v-show="accept_video">
			<div class="preview-wrapper">
				<div class="preview-container">
					<div class="preview-body">
						<h4>{{ acceptMsg }}</h4>
						<button class="btn-success btn" @click="accept">接受</button>
						<button class="btn-danger btn" style="margin-right: 70px" @click="reject">拒绝</button>
					</div>
					<div class="confirm" @click="closePreview">×</div>
				</div>
			</div>
		</div>
		<!-- 设备人员右键 -->
		<div v-show="visible" class="context-menu" :style="contextmenuStyle">
			<ul>
				<li @click="audioCall()"><i class="el-icon-microphone"></i> 语音通话</li>
				<li @click="videoCall()"><i class="el-icon-video-camera"></i> 视频通话</li>
				<!-- <li><i class="el-icon-s-platform"></i> 屏幕共享</li>
        		<li><i class="el-icon-headset"></i> 监听</li> -->
			</ul>
		</div>
		<div v-show="visibleWfs" class="context-menu" :style="contextmenuStyle">
			<ul>
				<li @click="vidioCallWfs()"><i class="el-icon-microphone"></i> 查看视频</li>
				<li @click="realNameWfs()"><i class="el-icon-video-camera"></i> 重命名</li>
				<!-- <li><i class="el-icon-s-platform"></i> 屏幕共享</li>
        		<li><i class="el-icon-headset"></i> 监听</li> -->
			</ul>
		</div>
		<!-- -->
		<!-- 集群右键 -->
		<div v-show="visibleGroup" class="context-menu" :style="contextmenuStyle">
			<ul>
				<!-- <li @click="speechCall()"><i class="el-icon-mic"></i> 发言</li>
        <li @click="broadcastCall()"><i class="el-icon-bell"></i> 广播</li>
        <li @click="namedCall()"><i class="el-icon-thumb"></i> 点名</li> -->
				<li @click="addUserToGroup()"><i class="el-icon-circle-plus"></i> 添加成员</li>
				<li @click="multiVideoCall('audio')"><i class="el-icon-mic"></i> 语音通话</li>
				<li @click="multiVideoCall()"><i class="el-icon-video-camera"></i> 视频通话</li>
			</ul>
		</div>
		<!-- -->
		<div class="tool-audio-contrl" v-show="showMulitVideoContrl">
			<el-tooltip class="item" effect="dark" content="结束通话" placement="top-start">
				<el-button type="danger" icon="el-icon-phone" circle @click="hangUpVideo()"></el-button>
			</el-tooltip>
		</div>
		<!-- 语音通话控制 -->
		<div class="tool-audio-contrl" v-show="showAudioContrl">
			<el-tooltip class="item" effect="dark" content="结束通话" placement="top-start">
				<el-button type="danger" icon="el-icon-phone" circle @click="hangUpAudio()"></el-button>
			</el-tooltip>
			<span v-show="isSpeechCall">
				<el-tooltip class="item" effect="dark" content="申请发言" placement="top-start">
					<el-button type="primary" icon="el-icon-mic" circle @click="speechApply()" v-show="!hasRelease"></el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="释放话权" placement="top-start">
					<el-button
						type="primary"
						icon="el-icon-unlock"
						circle
						@click="releaseSpeech()"
						v-show="hasRelease"
					></el-button>
				</el-tooltip>
			</span>
		</div>
		<el-dialog title="添加用户" v-if="groupAddVisible" :visible.sync="groupAddVisible">
			<GroupAdd
				:group="selectGroup"
				@cancleVisible="groupAddVisible = !groupAddVisible"
				@handleSuccess="addUserToGroupSuccess"
			></GroupAdd>
		</el-dialog>
		<!-- <VideoRecord ref="videoRef" :isVideoRecord.sync="isVideoRecord"></VideoRecord> -->
		<!-- -->
	</el-container>
	<video v-else id="videoRecord" autoplay muted controls></video>
</template>

<script>
import * as config from '../../configure';
import axios from 'axios';
import Bus from './Bus';
import Wfs from 'wfsjs';
import dayjs from 'dayjs';

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription =
	window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

// const socket = io.connect(config.API_ROOT);
const configuration = {
	iceServers: [config.DEFAULT_ICE_SERVER],
};
const audioConfig = { echoCancellation: true, noiseSuppression: true, sampleSize: 24, sampleRate: 192000 };
const videoConfig = { frameRate: { ideal: 10, max: 15 }, width: { min: 240, ideal: 240, max: 240 } };
const maxBitrate = 500 * 1024;

let audioStream, videoStream, displayStream;
let peerConn = {};
let remoteUser = null;

export default {
	components: {
		GroupAdd: () => import('./GroupAdd.vue'),
		RtcPlayer: () => import('./rtcPlayer.vue'),
		VideoRecord: () => import('./videoRecord.vue'),
	},
	data() {
		return {
			user_name: sessionStorage.getItem('user_name') || 'zw',
			user: JSON.parse(sessionStorage.getItem('user')),
			device_name: 'pc',
			device_msg: [],
			deviceTree: [],
			usersTree: [],
			users: [],
			callingUsername: '',
			remote_video: '',
			accept_video: false,
			onlineUser: [],
			visible: false,
			visibleGroup: false,
			toolVisible: false,
			toolVisibleGroup: false,
			showAudioContrl: false,
			showMulitVideoContrl: false,
			contextmenuStyle: {
				top: '0px',
				left: '0px',
			},
			allUserList: [],
			groupList: [],
			callingStreamType: 'video',
			acceptMsg: '您有视频邀请，是否接受',
			hasRelease: false,
			isSpeechCall: false,
			videos: [
				{ key: '', show: false },
				{ key: '', show: false },
				{ key: '', show: false },
			],
			multiVideoCallStatus: false,
			callingRoomId: '',
			videoGrid: 'video-grid-2',
			selectGroup: null,
			groupAddVisible: false,
			connectUserName: [],

			deviceList: [],
			channelList: [],
			rtpList: {},
			videoUrl: '',
			isVideoRecord: true,
			videoElement: '',
			deviceListData: [],
			ws: null,
			isVideo: true,
			visibleWfs: false,
			wfsCheck: null,
			isVideo: true,
			screenStream: null,
			screenRecorder: null,
		};
	},
	mounted() {
		this.initWebpack();

		this.getUserList();
		this.getDeviceList();
		this.getConnectedDevices();
		document.addEventListener('click', (e) => {
			this.visible = false;
			this.visibleGroup = false;
		});
		window.addEventListener('beforeunload', e => this.beforeunloadFn(e));
		Bus.$off('changeVideoGrid').$on('changeVideoGrid', (grid) => {
			const count = grid * grid - 1;
			const len = this.videos.length;
			const diff = count - len;

			if (diff > 0) {
				for (let i = 0; i < diff; i++) {
					this.videos.push({ key: '', show: false });
				}
			} else {
				for (let i = len - 1; count < this.videos.length; i--) {
					const v = this.videos[i];
					if (!v.show) {
						this.videos.splice(i, 1);
					}
				}
			}

			switch (grid) {
				case 2:
					this.videoGrid = 'video-grid-2';
					break;
				case 3:
					this.videoGrid = 'video-grid-3';
					break;
				case 4:
					this.videoGrid = 'video-grid-4';
					break;
			}
		});
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
		handleShare(data) {},
		// 录制屏幕
		startRecordScreen() {
			let $this = this;
			// 录制屏幕
			navigator.mediaDevices
				.getDisplayMedia({
					video: {
						width: 1920,
						height: 1080,
						frameRate: 12,
					},
					audio: true,
				})
				.then(async (stream) => {
					$this.screenStream = stream;
					const audioTrack = await navigator.mediaDevices.getUserMedia({ audio: true });
					$this.screenStream.addTrack(audioTrack.getAudioTracks()[0]);
					if ($this.callingUsername != $this.user_name) {
						$this.createConnection($this.callingUsername, false, false, false, 2);
						this.handleAccept({ name: $this.callingUsername }, 'video', true, 1);
					}
					$this.screenRecorder = new MediaRecorder(stream);
					// $this.$refs.screen.srcObject = stream;
					$this.send({
						event: 'StartRecord',
						name: $this.user_name,
						shareName: $this.callingUsername,
						time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					});
					// 1000ms触发一次ondataavailable
					$this.screenRecorder.start(1000);
					$this.screenRecorder.ondataavailable = (e) => {
						$this.ws.send(e.data);
					};
				})
				.catch((err) => {
					this.isVideoRecord = true;
				});
		},
		// 停止录制屏幕
		stopRecordScreen() {
			let $this = this;
			// 停止录制
			$this.screenRecorder.stop();
			$this.screenRecorder = null;
			// 停止所有流式视频轨道
			$this.screenStream.getTracks().forEach((track) => track.stop());
			// 释放getDisplayMedia或getUserMedia
			$this.screenStream = null;
			$this.isVideo = true;
			$this.send({
				event: 'EndRecord',
				id: $this.user.id,
				time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
				token: sessionStorage.getItem('token'),
			});
		},

		initWebpack() {
			const wsurl = 'wss://192.168.20.13:8001?' + this.user_name; //ws地址,这里加入自己的地址即可'ws://192.168.2.42:9040/api/websocket/user_'
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
		initWfs(name, deviceId, channelId) {
			if (Wfs.isSupported()) {
				for (let item of this.videos) {
					if (item.show == false) {
						item.show = true;
						item.key = channelId;
						item.params = { channelId, deviceId };
						item.type = 'wfs';
						name = name + channelId;
						this.$nextTick(() => {
							var video1 = document.getElementById(channelId + 'Video'),
								wfs = new Wfs();
							wfs.attachMedia(video1, name, 'wss://192.168.20.13:8002?' + name);
						});
						break;
					}
				}
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
						// this.handleMultiVideoAccept({});
						break;
					case 'call':
						this.handleCall(data);
						break;
					case 'speech':
						this.isSpeechCall = true;
						break;
					case 'discuss':
						this.handleDiscussAccept(data);
						break;
					case 'multiVideo':
						this.handleMultiVideoAccept(data);
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
			console.log(e);
			//重连
			this.reconnect();
		},
		getDeviceList() {
			this.$axios({
				method: 'get',
				url: '/debug/api/device/query/devices',
				params: { page: 1, count: 15 },
			}).then((res) => {
				this.deviceListData = [];
				res.data.data.list.forEach((item) => {
					this.deviceListData.push({
						name: item.name,
						id: item.deviceId,
						online: true,
						master: false,
						type: 0,
						status: 1,
						check: false,
						ns: true,
					});
				});
				// const wfsDevices = this.users.find(user => {
				// 	return this.deviceListData.findIndex(item => item.id === user.id) < 0;
				// });
				// console.log('wfsDevices', wfsDevices);
				this.setUserList();
			});
		},
		getCanVide(deviceList) {
			this.rtcStream(deviceList[0]);
			deviceList.forEach((it) => {
				for (const item of this.videos) {
					if (item.show == false) {
						item.show = true;
						item.key = it;
						item.type = 'guobiao';
						this.videoElement = item.key + 'Video';
						break;
					}
				}
			});
		},
		videoRecord() {
			if (this.isVideoRecord) {
				this.startRecordScreen();
			} else {
				this.stopRecordScreen();
			}
			this.isVideoRecord = !this.isVideoRecord;
		},
		async rtcStream(id) {
			// let res = await this.$axios({
			// 	method: 'get',
			// 	url: '/debug/api/device/query/devices',
			// 	params: { page: 1, count: 15 },
			// });
			// this.deviceList = res.data.data.list;
			let re = await this.$axios({
				method: 'get',
				url: `/debug/api/device/query/devices/${id}/channels`,
				params: { page: 1, count: 15, query: null, online: null, channelType: null },
			});
			this.channelList = re.data.data.list;
			let r = await this.$axios({
				method: 'get',
				url: `/debug/api/play/start/${id}/${this.channelList[0]['channelId']}`,
			});
			this.videoUrl = r.data.data.rtcs;
		},
		getUserList() {
			axios.get('/api/user/query').then((res) => {
				const data = res.data.data;
				if (data.status === 1) {
					this.allUserList = data.data.map((item) => {
						return {
							label: item.username,
							value: item.id,
						};
					});
				}
			});
		},
		getGroupList() {
			const users = this.users;
			// this.$axios({
			// 	method: 'get',
			// 	url: '/api/group/getGroupList',
			// 	params: { userId: this.user.id },
			// }).then((res) => {
			// 	const data = res.data.data;
			// 	if (data.status === 1) {
			// 		this.groupList = data.data.map((item) => {
			// 			return {
			// 				id: item.id,
			// 				name: item.name,
			// 				main: true,
			// 				children: [
			// 					...item.userList.map((u) => {
			// 						return {
			// 							id: u.userId,
			// 							name: u.userName,
			// 							online: users.findIndex((uu) => uu.name === u.userName) >= 0,
			// 							master: u.roleId === 1,
			// 							type: 1,
			// 						};
			// 					}),
			// 					...item.deviceList.map((i) => {
			// 						return {
			// 							id: i.deviceId,
			// 							name: i.name,
			// 							online: true,
			// 							master: false,
			// 							type: 0,
			// 						};
			// 					}),
			// 				],
			// 			};
			// 		});
			// 	}
			// });
		},
		async getConnectedDevices(type) {
			const devices = await navigator.mediaDevices.enumerateDevices();
			this.device_msg = devices.map((d) => {
				return {
					label: d.label,
					kind: d.kind,
					groupId: d.groupId,
				};
			});
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
		rightClick(type, evt, data, data1) {
			switch (type) {
				case 'device':
					if (!data.main) {
						this.setUserCheck(data);
						this.callingUsername = data;
						this.visible = !this.visible;
						this.contextmenuStyle = {
							top: evt.clientY + 'px',
							left: evt.clientX + 'px',
						};
					}
					break;
				case 'group':
					if (data.main) {
						this.visibleGroup = !this.visibleGroup;
						this.selectGroup = data;
						this.contextmenuStyle = {
							top: evt.clientY + 'px',
							left: evt.clientX + 'px',
						};
					}
					break;
				case 'wfs':
					this.visibleWfs = !this.visibleWfs;
					this.wfsCheck = data1;
					this.contextmenuStyle = {
						top: evt.clientY + 'px',
						left: evt.clientX + 'px',
					};
					break;
				case 'chanel':
					this.visibleWfs = !this.visibleWfs;
					this.wfsCheck = data1;
					this.contextmenuStyle = {
						top: evt.clientY + 'px',
						left: evt.clientX + 'px',
					};
					break;
				default:
					break;
			}
		},
		vidioCallWfs() {
			console.log('check row', this.wfsCheck);
			this.initWfs(this.user_name, this.wfsCheck.deviceId, this.wfsCheck.channelId);
		},
		realNameWfs() {
			this.$prompt('请输入设备名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(({ value }) => {
				const params = {
					id: this.wfsCheck.id,
					name: value,
					type: this.wfsCheck.type === 'wfs' ? 1 : 2,
					deviceId: this.wfsCheck.type === 'wfs' ? undefined : this.wfsCheck.deviceId
				}
				console.log('check row', this.wfsCheck, params);
				this.$axios({
					method: 'get',
					url: '/debug/api/device/update',
					params: params,
				}).then((res) => {
					
					
				});
			}).catch(() => { });
		},
		leftClick(type, data) {
			switch (type) {
				case 'device':
					this.setUserCheck(data);
					this.callingUsername = data;
					this.toolVisible = true;
					break;
				case 'group':
					this.toolVisibleGroup = true;
					this.selectGroup = data;
					break;
				default:
					break;
			}
		},
		//向集群添加用户
		addUserToGroup() {
			if (!!this.selectGroup) {
				this.groupAddVisible = true;
			}
		},
		addUserToGroupSuccess(insertList) {
			this.groupAddVisible = false;
			this.getGroupList();
			this.selectGroup = null;
			//如果存在房间
			console.log(insertList);
			const users = this.users;
			let offline = [];
			insertList.forEach((u) => {
				offline.push(u.label);
			});
			if (!!this.callingRoomId) {
				this.send({
					event: 'updateRoom',
					roomId: this.callingRoomId,
					jion: offline,
					offline: offline,
				});
			}
		},
		//直连设备,获取视频流
		connectUser(type, name, data) {
			if (name === this.user_name) {
				return false;
			}
			console.log('connectUser');
			switch (type) {
				case 'device':
					this.setUserCheck(name);
					this.callingUsername = name;
					this.connectUserName.push(name);
					this.createConnection(this.callingUsername, false, false, true);
					this.send({
						event: 'connectUser',
						caller: this.user_name,
						partner: this.callingUsername,
						streamType: 'video',
					});

					break;
				case 'group':
					break;
				case 'guobiao':
					this.getCanVide([name]);
					break;
				case 'wfs':
					break;
				case 'chanel':
					const deviceId = data.deviceId;
					const channelId = data.id;
					this.send({
						event: 'wfsCall',
						caller: this.user_name,
						deviceId: deviceId,
						channelId: channelId,
					});
					//创建wfs连接
					this.initWfs(this.user_name, deviceId, channelId);
					break;
				default:
					break;
			}
		},
		handleConnectUser(data) {
			this.createConnection(data.caller, false, false, true);
			this.handleAccept({ name: data.caller, accept: true }, 'video');
		},
		/*
		 * 讨论
		 * 所有人互相通信
		 */
		discussCall() {
			this.users.forEach((user) => {
				if (user.name !== this.user_name && user.status === 1) {
					this.createConnection(user.name, true);
					this.handleAccept({ name: user.name, accept: true }, 'audio');
					this.handleDiscuss({ name: user.name }, 'audio');
				}
			});
		},
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
		multiVideoCall(streamType) {
			if (this.handleConnectStatus()) {
				return false;
			}
			let self = this;
			streamType = streamType || 'video';
			//呼叫的用户
			let userList = [];
			let deviceList = [];
			//不在线的用户
			let offlineUserList = [];
			if (streamType === 'video') {
				self.showMulitVideoContrl = true;
			} else {
				self.showAudioContrl = true;
			}
			const groupUser = this.selectGroup.children;
			groupUser.forEach((user) => {
				if (user.name !== this.user_name) {
					if (user.type == 1) {
						userList.push(user.name);
					} else {
						deviceList.push(user.id);
					}
					if (!user.online) {
						offlineUserList.push(user.name);
					}
				}
			});
			if (deviceList.length) {
				this.getCanVide(deviceList);
			}
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
				groupId: this.selectGroup.groupId,
			});
		},
		handleMultiVideo(data, streamType) {
			this.send({
				event: 'multiVideo',
				user: data.name,
				source: this.user_name,
			});
		},
		//申请发言
		speechApply() {
			this.send({
				event: 'speechApply',
				name: this.user_name,
			});
		},
		releaseSpeech() {
			this.hasRelease = false;
			this.send({
				event: 'releaseSpeech',
				name: this.user_name,
			});
		},
		audioCall() {
			this.callingStreamType = 'audio';
			this.call();
		},
		videoCall(name) {
			if (!!name) {
				this.callingUsername = name;
			}
			this.callingStreamType = 'video';
			this.call();
		},
		send(message) {
			// if (connectedUser !== null) {
			//   message.connectedUser = remoteUser;
			// }
			this.ws.send(JSON.stringify(message));
		},
		setUserList(users) {
			let userList = [];
			let treeList = [];
			if (!!users) {
				for (const u of users) {
					if (u.subName) {
						userList.push({
							id: u.name,
							name: u.name,
							type: 'wfs',
							status: 1,
							check: false,
							children: u.subName.map((c) => {
								return {
									name: c,
									id: c,
									deviceId: u.name,
									type: 'chanel',
									status: 1,
									check: false,
								};
							}),
						});
						this.handleDeviceUpLine(u);
					} else {
						userList.push({ name: u.name, status: u.status, check: false });
					}
				}
			}
			treeList.push(...userList, ...this.deviceListData);
			this.allUserList.forEach((au) => {
				if (userList.findIndex((ou) => ou.name === au.label) < 0) {
					treeList.push({ name: au.label, status: 0, check: false });
				}
			});

			this.users = userList;

			this.deviceTree = [
				{
					id: 99999,
					main: true,
					name: '可视化集群指挥中心',
					children: treeList,
				},
			];
			this.usersTree = [
				{
					id: 99999,
					name: '华网慧业',
					children: treeList,
				},
			];
			this.getGroupList();
		},
		handleDeviceUpLine(device) {
			// 设备上线
			const params = {
				deviceId: device.name,
				name: device.name,
				channels: device.subName.map((c) => {
					return {
						deviceId: device.name,
						channelId: c,
						name: c
					}
				})
			}
			console.log('设备上线', params);
		},
		handleLogin(data) {
			if (data.success === false) {
				alert('用户名已存在');
			} else {
				this.setUserList(data.allUsers);
				if (!data.device) {
					//是否正在进行集群通话
					this.multiVideoCallStatus = data.multiCall;
					peerConn = {};
					this.initCreate();
					setTimeout(() => {
						if (this.user_name === 'zw') {
							//this.handleConnectUser({caller: 'ywl', streamType: 'video'})
						}
					}, 3000);
				}
			}
			this.getGroupList();
		},
		addVideoURL(elementId, stream) {
			// var video = document.createElement('video');
			// video.id = elementId;
			// video.autoplay = 'autoplay';
			var video = document.getElementById(elementId);
			// Older brower may have no srcObject
			if ('srcObject' in video) {
				video.srcObject = stream;
			} else {
				// 防止在新的浏览器里使用它，应为它已经不再支持了
				video.src = window.URL.createObjectURL(stream);
			}
			// document.getElementById('videoBox').appendChild(video);
		},
		addAudioURL(elementId, stream) {
			var audio = document.createElement('audio');
			audio.id = elementId;
			audio.autoplay = 'autoplay';
			audio.controls = 'controls';
			if ('srcObject' in audio) {
				audio.srcObject = stream;
			} else {
				// 防止在新的浏览器里使用它，应为它已经不再支持了
				audio.src = window.URL.createObjectURL(stream);
			}
			document.getElementById('audioBox').appendChild(audio);
			this.showAudioContrl = true;
		},
		initCreate() {
			const self = this;
			//视频流
			navigator.mediaDevices
				.getUserMedia({ audio: audioConfig, video: videoConfig })
				.then((stream) => {
					self.addVideoURL('localVideo', stream);
					var video = document.getElementById('localVideo');
					video.muted = true;
					videoStream = stream;
					// console.log(stream)
					//正在集群视频通话
					if (this.multiVideoCallStatus) {
						this.handleMultiVideoAccept({});
					}
				})
				.catch(function (err) {
					console.log(err.name + ': ' + err.message);
				});
			//音频流
			navigator.mediaDevices
				.getUserMedia({ audio: audioConfig, video: false })
				.then((stream) => {
					audioStream = stream;
				})
				.catch(function (err) {
					console.log(err.name + ': ' + err.message);
				});
			//屏幕流
			//TODO
			// navigator.mediaDevices.getDisplayMedia({ cursor: 'mot-ion', displaySurface: 'monitor' })
			// .then((stream) => {
			//   displayStream = stream;
			// })
			// .catch(function(err) {
			//   console.log(err.name + ': ' + err.message);
			// });
			navigator.mediaDevices.ondevicechange = (event) => {
				this.initCreate();
				if (!!this.callingRoomId) {
					this.$message.error('设备异常，通话已断开');
					this.callingStreamType === 'video' ? this.hangUpVideo() : this.hangUpAudio();
				}
			};
		},
		handleCall(data) {
			this.callingStreamType = data.streamType;
			this.callingRoomId = data.roomId;
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
		reject() {
			this.send({
				event: 'enterTheRoom',
				accept: false,
				name: this.user_name,
				roomId: this.callingRoomId,
			});
			this.accept_video = false;
		},
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
		createConnection(remoteUser, audio, dontInput, dontOutput, isScreen) {
			peerConn[remoteUser] = new RTCPeerConnection(configuration);
			let localStream = this.callingStreamType == 'audio' ? audioStream : videoStream;
			if (!isScreen) {
				peerConn[remoteUser].addStream(localStream);
				peerConn[remoteUser].streamType = this.callingStreamType;
			}
			if (isScreen && isScreen == 2) {
				this.callingStreamType = 'video';
				localStream = this.screenStream;
				console.log(localStream);
				peerConn[remoteUser].addStream(this.screenStream);
				peerConn[remoteUser].streamType = this.callingStreamType;
			}

			//只接收
			if (dontOutput) {
				//收发器
				console.log(peerConn[remoteUser].getTransceivers());
				peerConn[remoteUser].getTransceivers().forEach((transceiver) => {
					transceiver.direction = 'recvonly';
				});
			}

			//限码
			// peerConn[remoteUser].getSenders().forEach((sender) => {
			// 	if (sender.track.kind === 'audio') return;
			// 	let param = sender.getParameters();
			// 	console.log(param);
			// 	param.encodings[0].maxBitrate = maxBitrate;
			// 	sender
			// 		.setParameters(param)
			// 		.then((res) => {})
			// 		.catch((err) => {
			// 			console.log(err);
			// 		});
			// });
			peerConn[remoteUser].onaddstream = (e) => {
				if (isScreen && isScreen == 1) {
					this.isVideo = false;
					console.log(e.stream, 123);
					this.$nextTick(() => {
						this.addVideoURL('videoRecord', e.stream);
					});
					return;
				}
				if (dontInput) {
					this.showAudioContrl = true;
					return;
				}
				if (this.callingStreamType === 'audio') {
					this.addAudioURL('audio' + Math.random() * 1000, e.stream);
				} else {
					for (let item of this.videos) {
						if (item.show == false) {
							item.show = true;
							item.key = remoteUser;
							this.$nextTick(() => {
								this.addVideoURL(item.key + 'Video', e.stream);
							});
							break;
						}
					}
				}
			};
			peerConn[remoteUser].onicecandidate = (event) => {
				console.log('onicecandidate');
				setTimeout(() => {
					if (event.candidate) {
						console.log(event.candidate, 'onicecandidate');
						this.send({
							event: 'candidate',
							candidate: event.candidate,
							otherName: remoteUser,
							connectedUser: this.user_name,
						});
					}
				});
			};
			//ice状态改变
			peerConn[remoteUser].oniceconnectionstatechange = (event) => {
				console.log(event);
				if (peerConn[remoteUser].iceConnectionState === 'failed') {
					console.log(remoteUser + '网络连接失败，正在进行重连');
					peerConn[remoteUser].restartIce();
				}
			};
		},
		handleDiscuss(data, streamType) {
			this.send({
				event: 'discuss',
				user: data.name,
				source: this.user_name,
			});
		},
		//讨论
		handleDiscussAccept(data) {
			this.users.forEach((user) => {
				if (user.name !== this.user_name && user.name !== data.source && !peerConn[user.name]) {
					console.log('handleDiscussAccept', user.name);
					this.createConnection(user.name, true);
					this.handleAccept({ name: user.name }, true);
				}
			});
		},
		//集群视频
		handleMultiVideoAccept(data) {
			// this.showMulitVideoContrl = true;
			this.users.forEach((user) => {
				if (user.name !== this.user_name && user.name !== data.source && !peerConn[user.name] && !!user.name) {
					console.log('handleMultiVideoAccept', user.name);
					this.createConnection(user.name, false);
					if (user.name) {
						this.handleAccept({ name: user.name, accept: true }, 'video');
					}
				}
			});
		},
		handleEnterTheRoom(data) {
			// this.showMulitVideoContrl = true;
			this.createConnection(data.name, false);
			this.handleAccept({ name: data.name, accept: true }, 'video');
		},
		handleLeaveTheRoom(data) {
			if (!!data.name && !!peerConn[data.name]) {
				peerConn[data.name].close();
				peerConn[data.name].onicecandidate = null;
				peerConn[data.name].onaddstream = null;
				peerConn[data.name] = null;
			}
			if (this.callingStreamType === 'video') {
				for (const item of this.videos) {
					if (item.key === data.name) {
						item.key = '';
						item.show = false;
					}
				}
			} else {
				const audioDom = document.getElementById('audioBox');
				while (audioDom.hasChildNodes()) {
					audioDom.removeChild(audioDom.firstChild);
				}
			}
			const allClose = this.allClose();
			if (allClose) {
				this.showMulitVideoContrl = false;
				this.showAudioContrl = false;
			}
		},
		handleAccept(data, streamType, single, isScreen) {
			let self = this;
			console.log('------------------handleAccept', streamType, this.callingStreamType);
			streamType = streamType || this.callingStreamType;
			// Create an offer
			peerConn[data.name].createOffer(
				(offer) => {
					console.log(offer);
					this.send({
						event: 'offer',
						offer: offer,
						offerUser: data.name,
						answerUser: self.user_name,
						streamType: streamType,
						single: single,
						isScreen: isScreen,
					});
					peerConn[data.name].setLocalDescription(offer);
				},
				(error) => {
					alert('Error when creating an offer');
				}
			);
		},
		insertStr(str, index, insertStr) {
			if (index < 0) {
				return str;
			}
			return str.substring(0, index) + insertStr + str.substring(index);
		},
		handleOffer(data) {
			//
			// if(!peerConn[data.name]) {
			//   this.createConnection(data.name);
			// }
			console.log(peerConn);
			console.log(data.answerUser);
			if (!peerConn[data.answerUser] && data.answerUser != this.user_name) {
				this.createConnection(data.answerUser, data.streamType === 'audio', false, data.single, data.isScreen);
			}
			//判断是否为视频流
			if (peerConn[data.answerUser].streamType === 'video') {
				//a=rtcp-fb:96 transport-cc x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150
				// data.offer.sdp = this.insertStr(data.offer.sdp, data.offer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150\r\n')
			}
			peerConn[data.answerUser].setRemoteDescription(new RTCSessionDescription(data.offer));
			// Create an answer to an offer
			peerConn[data.answerUser].createAnswer(
				(answer) => {
					console.log(answer.sdp);
					peerConn[data.answerUser].setLocalDescription(answer);
					this.send({
						event: 'answer',
						answer: answer,
						answerUser: data.answerUser, //offer发起者
						connectedUser: data.name,
					});
				},
				(error) => {
					alert('Error when creating an answer');
				}
			);
		},
		handleMsg(data) {
			console.log(data.message);
		},
		handleAnswer(data) {
			console.log(peerConn, data.name, 'handleAnswer');
			if (peerConn[data.name].streamType === 'video') {
				// data.answer.sdp = this.insertStr(data.answer.sdp, data.answer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150\r\n')
			}
			peerConn[data.name].setRemoteDescription(new RTCSessionDescription(data.answer));
			// peerConn.setRemoteDescription(new RTCSessionDescription(data.answer));
		},
		handleCandidate(data) {
			// ClientB 通过 PeerConnection 的 AddIceCandidate 方法保存起来
			console.log(peerConn, data.candidate, 'handleCandidate');
			peerConn[data.name].addIceCandidate(new RTCIceCandidate(data.candidate));
		},
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
		closeVideo(item, key) {
			if (item.type === 'wfs') {
				this.send({
					event: 'wfsStop',
					caller: this.user_name,
					deviceId: item.params.deviceId,
					channelId: item.params.channelId,
				});
				item.show = false;
				item.key = '';
				delete item.type;
				delete item.deviceId;
				delete item.channelId;
				return true;
			}
			for (let i = 0; i < this.connectUserName.length; i++) {
				const name = this.connectUserName[i];
				if (key === name) {
					this.connectUserName.splice(i, 1);
					break;
				}
			}
			this.send({
				event: 'closeVideo',
				caller: this.user_name,
				closer: key,
				roomId: this.callingRoomId,
			});
			if (!!peerConn[key]) {
				peerConn[key].close();
				peerConn[key].onicecandidate = null;
				peerConn[key].onaddstream = null;
				peerConn[key] = null;
			}
			item.show = false;
			item.key = '';
			if (item.type == 'guobiao') {
				this.$refs.rtcPlayer.pause();
				item.type = '';
			}
			const allClose = this.allClose();
			if (allClose) {
				this.showMulitVideoContrl = false;
				this.showAudioContrl = false;
			}
		},
		leaveTheRoom() {
			this.send({
				event: 'leaveTheRoom',
				name: this.user_name,
				roomId: this.callingRoomId,
			});
			this.callingRoomId = '';
			//挂断，断开所有连接
			for (const name in peerConn) {
				if (!!peerConn[name]) {
					peerConn[name].close();
					peerConn[name].onicecandidate = null;
					peerConn[name].onaddstream = null;
					peerConn[name] = null;
				}
			}
		},
		hangUpAudio() {
			this.leaveTheRoom();
			const audioDom = document.getElementById('audioBox');
			while (audioDom.hasChildNodes()) {
				audioDom.removeChild(audioDom.firstChild);
			}
			this.showAudioContrl = false;
		},
		hangUpVideo(key) {
			this.leaveTheRoom();
			for (const item of this.videos) {
				item.key = '';
				item.show = false;
			}
			this.showMulitVideoContrl = false;
		},
		closePreview() {
			this.accept_video = false;
		},
		allClose() {
			let allClose = true;
			for (const key in peerConn) {
				if (Object.hasOwnProperty.call(peerConn, key)) {
					const conn = peerConn[key];
					if (!!conn) {
						allClose = false;
					}
				}
			}
			if (allClose) {
				this.callingRoomId = '';
			}
			return allClose;
		},
		loginOut() {
			this.$axios({
				method: 'get',
				url: '/api/user/logout',
				params: { username: this.user_name },
			}).then((res) => {
				if (res.status === 200) {
					sessionStorage.removeItem('user_name');
					sessionStorage.removeItem('user');
					sessionStorage.removeItem('token');
					this.$router.push({ path: '/login' });
				}
			});
		},
		handleFullScreen(id, show) {
			if (show) {
				document.getElementById(id).requestFullscreen();
			}
		},
		hangUp() {
			for (let item of this.videos) {
				if (!!item.show) {
					this.closeVideo(item, item.key);
				}
			}
		},
		beforeunloadFn(e) {
			e = e || window.event;			 
			if (e) {
				e.returnValue = '关闭提示';
			}
 
			 console.log('刷新或关闭')
			// 
			this.hangUp();
 
			// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
			return '关闭提示';
		}
	},
	beforeDestroy() {
		//window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
	},
	watch: {},
};
</script>

<style lang="css">
.el-tree {
	user-select: none;
}

/* .el-descriptions-item__label.is-bordered-label{
  background-color: #364e6f;
  color: #fff;
} */
.tab-tool-panel {
	width: 100%;
	text-align: left;
}
.preview {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}
.preview-wrapper {
	display: table-cell;
	vertical-align: middle;
}
.preview-container {
	width: 400px;
	height: 150px;
	margin: 0px auto;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	font-family: Helvetica, Arial, sans-serif;
	position: relative;
}
.confirm {
	position: absolute;
	right: 10px;
	top: 0px;
	font-size: 40px;
}
.confirm:hover {
	color: red;
	cursor: pointer;
}
.preview-body {
	position: absolute;
	width: 380px;
	height: 130px;
	margin: 10px 10px 10px 10px;
}
.preview-body > h4 {
	position: absolute;
	top: 25%;
	left: 20%;
}
.preview-body > button {
	position: absolute;
	right: 10px;
	bottom: 0px;
}
.green_color {
	color: #67c23a;
}
.red_color {
	color: red;
}
#videoBox {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	height: 100%;
	border-style: solid;
	border-color: #666;
	border-width: 1px 0 0 1px;
}
#videoBox .video-box {
	background-color: #000;
	border-style: solid;
	border-color: #666;
	border-width: 0 1px 1px 0;
	position: relative;
	overflow: hidden;
	flex: 1;
}
#videoBox .video-grid-2 {
	width: 50%;
	height: 50%;
	min-height: 50%;
	max-height: 50%;
	min-width: 50%;
	max-width: 50%;
}
#videoBox .video-grid-3 {
	width: 33.33%;
	height: 33.33%;
	min-height: 33.33%;
	max-height: 33.33%;
	min-width: 33.33%;
	max-width: 33.33%;
}
#videoBox .video-grid-4 {
	width: 25%;
	height: 25%;
	min-height: 25%;
	max-height: 25%;
	min-width: 25%;
	max-width: 25%;
}
#videoBox .video-box:hover .video-control {
	display: block;
}
#videoBox .video-box video {
	width: 100%;
	height: 100%;
}
#videoBox .video-box .video-control {
	position: absolute;
	width: 100%;
	text-align: right;
	background-color: rgba(0, 0, 0, 0.33);
	left: 0;
	top: 0;
	padding-right: 20px;
	display: none;
}
#audioBox {
	position: fixed;
	bottom: 0px;
	width: 0;
	display: none;
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
.tool-audio-contrl {
	position: fixed;
	left: calc(50% + 45px);
	z-index: 9999;
	bottom: 40px;
}
#videoRecord {
	width: 100%;
	height: calc(100vh - 80px);
}
</style>
