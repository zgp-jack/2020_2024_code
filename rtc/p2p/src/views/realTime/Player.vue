<template>
	<div class="play-box" @dragover="handleDragOver">
		<div class="tool-grid-control">
			<el-button type="text" icon="el-icon-menu" @click="handleChangeVideoGrid(2)"></el-button>
			<el-button type="text" icon="el-icon-s-grid" @click="handleChangeVideoGrid(3)"></el-button>
			<el-button type="text" icon="el-icon-full-screen" @click="handleChangeVideoGrid(0)"></el-button>
		</div>
		<div :class="['video-absolute', {'close': !showCollapsed}]">
			<div class="video-absolute-ctl" @click="showCollapsed = !showCollapsed">
				<i class="el-icon-d-arrow-right"></i>
			</div>
		</div>
		<div id="videoBox" :class="['videoBox', {'videoBoxMain': mainVideoMode}, {'close': !showCollapsed}]">
			<div
				v-for="(item, index) in videos"
				:class="['video-box', item.main ? 'video-box-main' : 'video-box-sub',  videoGrid, {'active': item.active}]"
				:key="index"
				:draggable="!item.main"
				@click="handleClick(item)"
				@dragstart="handleDragStart($event, index)"
				@dragend="handleDragEnd($event, index)"
				@dblclick="handleFullScreen(item.key + 'Video', item.show)"
				@contextmenu.prevent.stop="rightClick($event, item)"
			>
				<template v-if="item.type === 'map'">
					<OpenlayerMap ref="olMap" :key="item.key" :domId="item.key + 'Map'"></OpenlayerMap>
				</template>
				<template v-else>
					<video :id="item.key + 'Video'" autoplay v-show="item.show">
					</video>
					<img class="video-none" src="../../assets/终端视频空状态（通用）.png" v-show="!item.show && item.main">
					<div class="video-msg">
						<span style="color: #fff; font-weight: bold">{{ item.type === 'wfs' ? item.name : item.key }}</span>
					</div>
					<div class="video-control" v-show="item.show">
						<el-button type="text" @click="closeVideo(item, item.key)">
							<i class="el-icon-close" style="color: #fff; font-weight: bold"></i>
						</el-button>
					</div>
				</template>
			</div>
			<div id="audioBox"></div>
			<!-- -->
			<div class="tool-audio-control" v-show="showMulitVideoContrl">
				<el-tooltip class="item" effect="dark" content="结束通话" placement="top-start">
					<el-button type="danger" icon="el-icon-phone" circle @click="hangUpVideo()"></el-button>
				</el-tooltip>
			</div>
			<!-- 语音通话控制 -->
			<div class="tool-audio-control" v-show="showAudioContrl">
				<el-tooltip class="item" effect="dark" content="结束通话" placement="top-start">
					<el-button type="danger" icon="el-icon-phone" circle @click="hangUpAudio()"></el-button>
				</el-tooltip>
			</div>
			<div class="task-process-box" v-show="showTask">
				<TaskProcess></TaskProcess>
			</div>
		</div>
	</div>
</template>
<script>
import Bus from '../Bus';
import Wfs from 'wfsjs';
import dayjs from 'dayjs';
import rtc from './rtc'

export default {
	props: {
		// 呼叫方
		userName: {
			type: String,
			default: '',
		},
		// 呼叫类型 video aduio
		callingStreamType: {
			type: String,
			default: 'video',
		},
		callingUsername: {
			type: String,
			default: '',
		}
	},
	mixins: [rtc],
	components: {
		OpenlayerMap: () => import('./OpenlayerMap.vue'),
		TaskProcess: () => import('./TaskProcess.vue'),
	},
	data() {
		return {
			// video集合
			videos: [
				{ key: '', show: false, type: 'video', main: true, active: false },
			],
			videoGrid: 'video-grid-2', // video布局
			showAudioContrl: false, // 语音挂断
			showMulitVideoContrl: false, // 视频挂断
			callingRoomId: '', // 房间ID 默认为发起通话者

			user: JSON.parse(sessionStorage.getItem('user')),
			// screenStreamRecord: null,
			// screenRecorder: null,
			screenStream: null,
			mainVideoMode: true,
			startclientX: {
				x: 0,
				y: 0
			},
			showTask: false,
			
			showCollapsed: false
		};
	},
	mounted() {
		Bus.$off('changeVideoGrid').$on('changeVideoGrid', (grid) => {
			this.changeVideoGrid(grid);
		});
		Bus.$off('startJobRecord').$on('startJobRecord', () => {
			this.startRecordScreen('job');
		})
		Bus.$off('stopJobRecord').$on('stopJobRecord', () => {
			this.stopRecordScreen('job');
		})
	},
	methods: {
		// ws发送消息
		send(data) {
			this.$emit('send', data);
		},
		// 录制-共享屏幕
		startRecordScreen(type) {
			let $this = this;
			// 录制屏幕{ cursor: 'mot-ion', displaySurface: 'monitor'
			navigator.mediaDevices
				.getDisplayMedia({
					video: {
						width: 1920,
						height: 1080,
						frameRate: 12,
						cursor: 'mot-ion',
						logicalSurface: false
					},
					preferCurrentTab: true,
					audio: true,
					
				})
				.then(async (stream) => {
					if (type == 'share') {
						if ($this.callingUsername != $this.userName) {
							$this.screenStream = stream;
							const audioTrack = await navigator.mediaDevices.getUserMedia({ audio: true });
							$this.screenStream.addTrack(audioTrack.getAudioTracks()[0]);
							$this.send({
								event: 'StartShare',
								name: $this.userName,
								shareName: $this.callingUsername,
								time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
							});
							$this.createConnection($this.callingUsername, false, false, 2);
							$this.handleAccept({ name: $this.callingUsername }, 'video', true, 1);
						}
					} else {
						$this.screenStreamRecord = stream;
						const audioTrack = await navigator.mediaDevices.getUserMedia({ audio: true });
						console.log(audioTrack.getAudioTracks());
						$this.screenStreamRecord.addTrack(audioTrack.getAudioTracks()[0]);
						// $this.screenStreamRecord.addTrack(this.callVideoTrack[0]);
						
						$this.send({
							event: 'StartRecord',
							name: $this.userName,
							shareName: $this.callingUsername,
							time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						});
						$this.screenRecorder = new MediaRecorder($this.screenStreamRecord);
						// $this.$refs.screen.srcObject = stream;
						
						$this.screenRecorder.ondataavailable = (e) => {
							console.log('screenRecorder dataavailable');
							$this.$emit('sendBlob', e.data);
							// $this.ws.send(e.data);
						};
						$this.screenRecorder.addEventListener("error", (e) => {
							console.log('screenRecorder error', e);
						});
						$this.screenRecorder.addEventListener('stop', (e) => {
							console.log('screenRecorder stop', e);
						})
						$this.screenRecorder.start(1000);
						//监听停止共享
						$this.screenStreamRecord.getVideoTracks()[0].onended = (e) => {
							console.log('track onended');
							$this.stopRecordScreen('job');
						}
					}
				})
				.catch((err) => {
					if (type == 'share') {
						
					} else {
						this.$emit('changeIsVideoRecord');
					}
				});
		},
		// 停止录制-共享屏幕
		stopRecordScreen(type) {
			let $this = this;
			if (type == 'share') {
				// 释放getDisplayMedia或getUserMedia
				$this.screenStream = null;
				let key = $this.callingUsername;
				$this.send({
					event: 'closeShare',
					name: $this.userName,
					shareName: $this.callingUsername,
				});
				this.closeConnection(key);
			} else {
				// 停止录制
				if(!$this.screenRecorder) {
					return false;
				}
				$this.screenRecorder.stop();
				$this.screenRecorder = null;
				// 停止所有流式视频轨道
				$this.screenStreamRecord.getTracks().forEach((track) => track.stop());
				// 释放getDisplayMedia或getUserMedia
				$this.screenStreamRecord = null;
				console.log('EndRecord')
				$this.send({
					event: 'EndRecord',
					id: $this.user.id,
					time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					token: sessionStorage.getItem('token'),
				});
			}
		},
		closedShare(data) {
			let $this = this;
			// 释放getDisplayMedia或getUserMedia
			$this.screenStream = null;
			let key = data.name;
			$this.$emit('changeIsVideo');
			this.closeConnection(key);
		},
		setVideo(params) {
			let i = -1;
			this.videos.forEach((v,i1) => {
				if(i === -1 && v.show === false) {
					i = i1;
				}
				v.active = false;
			});
			if(i === -1) {
				this.videos.push(params)
			} else {
				//主不变
				params.main = this.videos[i].main;
				// this.videos[i] = params;
				this.$set(this.videos, i, params);
			}
		},
		// 加载布控球视频
		initWfs(name, data) {
			const deviceId = data.deviceId;
			const channelId = data.id;
			if (Wfs.isSupported()) {
				this.setVideo({
					show: true,
					key: channelId,
					params: { channelId, deviceId },
					name: `${data.deviceName}-${data.name}`,
					type: 'wfs',
					active: true
				})
				name = name + channelId;
				this.$nextTick(() => {
					var video1 = document.getElementById(channelId + 'Video'),
						wfs = new Wfs();
					wfs.attachMedia(video1, name, window.configure.WS_WFS + '?' + name);
				});
			}
		},
		initSdk(name, data) {
			const ip = data.deviceIp;
			const port = data.devicePort;
			const key = `${ip}:${port}`;
			if (Wfs.isSupported()) {
				this.setVideo({
					show: true,
					key: key,
					params: { ip, port },
					name: key,
					type: 'sdk'
				})
				name = `${name}${ip}${port}`;
				this.$nextTick(() => {
					var video1 = document.getElementById(key + 'Video'),
						wfs = new Wfs();
					wfs.attachMedia(video1, name, window.configure.WS_WFS + '?' + name);
				});
			}
		},
		// 通知加载地图
		initMap(name) {
			this.setVideo({
				show: true,
				key: name,
				type: 'map'
			})
		},
		// 播放视频
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
		// 播放音频
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
		// 被拉取视频
		handleConnectUser(data) {
			this.createConnection(data.caller, true, false);
			this.handleAccept({ name: data.caller, accept: true }, 'video');
		},
		// 加入集群视频
		handleMultiVideoAccept(data) {
			// this.showMulitVideoContrl = true;
			this.users.forEach((user) => {
				if (user.name !== this.userName && user.name !== data.source && !!user.name) {
					console.log('handleMultiVideoAccept', user.name);
					this.createConnection(user.name);
					if (user.name) {
						this.handleAccept({ name: user.name, accept: true }, 'video');
					}
				}
			});
		},
		// 用户进入房间
		handleEnterTheRoom(data) {
			// this.showMulitVideoContrl = true;
			this.createConnection(data.name);
			this.handleAccept({ name: data.name, accept: true }, 'video');
		},
		// 用户离开房间
		handleLeaveTheRoom(data) {
			this.closeConnection(data.name);
			if (this.callingStreamType === 'video') {
				if(this.videos.length > 1) {
					this.videos.forEach((item, index) => {
						if (item.key === data.name) {
							let v = this.videos[index];
							v.key = '';
							v.show = false;
							v.type = 'video';
							v.active = false;
							return false;
						}
					})
				} else {
					this.videos = [{ key: '', show: false, type: 'video', main: true, active: false }];
				}
			} else {
				const audioDom = document.getElementById('audioBox');
				while (audioDom.hasChildNodes()) {
					audioDom.removeChild(audioDom.firstChild);
				}
			}
			const allClose = this.allClose();
			if (allClose) {
				//清空定时器-重置通话状态
				clearInterval(this.timerAudioLevel);
				this.timerAudioLevel = null;
				this.setUserAudioStatus();
				//隐藏挂断所有按钮
				this.showMulitVideoContrl = false;
				this.showAudioContrl = false;
			}
		},
		// 全屏
		handleFullScreen(id, show) {
			if (show) {
				document.getElementById(id).requestFullscreen();
			}
		},
		// 关闭视频
		closeVideo(item, key) {
			if (item.type === 'wfs') {
				this.send({
					event: 'wfsStop',
					caller: this.userName,
					deviceId: item.params.deviceId,
					channelId: item.params.channelId,
				});
				this.$emit('closeVideo', item.params);
				item.show = false;
				item.key = '';
				item.type = '';
				item.params = undefined;
			} else {
				this.send({
					event: 'closeVideo',
					caller: this.user_name,
					closer: key,
					roomId: this.callingRoomId,
				});
				this.closeConnection(key);
				const allClose = this.allClose();
				if (allClose) {
					this.showMulitVideoContrl = false;
					this.showAudioContrl = false;
				}
			}
		},
		// 挂断语音
		hangUpAudio() {
			this.leaveTheRoom();
			const audioDom = document.getElementById('audioBox');
			while (audioDom.hasChildNodes()) {
				audioDom.removeChild(audioDom.firstChild);
			}
			this.showAudioContrl = false;
		},
		// 挂断所有视频
		hangUpVideo(key) {
			this.leaveTheRoom();
			this.videos = [{ key: '', show: false, type: 'video', main: true, active: false }];
			this.changeVideoGrid(3);
			this.showMulitVideoContrl = false;
		},
		// 挂断所有
		hangUp() {
			for (let item of this.videos) {
				if (!!item.show) {
					this.closeVideo(item, item.key);
				}
			}
		},
		// 退出房间
		leaveTheRoom() {
			this.send({
				event: 'leaveTheRoom',
				name: this.userName,
				roomId: this.callingRoomId,
			});
			this.callingRoomId = '';
			//挂断，断开所有连接
			this.closeConnection();
			//清空话说检测定时器
			clearInterval(this.timerAudioLevel);
			this.timerAudioLevel = null;
			//重置用户语音状态
			this.setUserAudioStatus();
		},
		// set callingRoomId
		setCallRoomId(val, audio) {
			this.callingRoomId = val;
		},
		handleChangeVideoGrid(grid) {
			this.mainVideoMode = grid === 0 ? true : false;
			if(!!grid) {
				this.changeVideoGrid(grid);
			}
		},
		//
		changeVideoGrid(grid) {
			const count = grid * grid;
			const len = this.videos.length;
			const diff = count - len;

			if (diff > 0) {
				for (let i = 0; i < diff; i++) {
					this.videos.push({ key: '', show: false, active: false });
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
		},
		handleDragStart(e, i) {
			this.startclientX.x = e.clientX;
			this.startclientX.y = e.clientY;
		},
		handleDragEnd(e, i) {
			if(Math.abs(this.startclientX.x - e.clientX) > 160 || Math.abs(this.startclientX.y - e.clientY) > 90) {
				this.videos.forEach(v => {
					v.main = false;
				})
				let video = this.videos[i];
				video.main = true;
				this.handleClick(video);
				// if(video.type === 'wfs') {
					// this.$emit('setTreeCheck', video)
				//}
				if(video.type === 'map') {
					this.$nextTick(() => {
						const olMap = this.$refs['olMap'];
						for (let i = 0; i < olMap.length; i++) {
							const ref = olMap[i];
							ref.resize();
						}
						// this.$refs['olMap' + video.key].resize();
					})
				}
			}
		},
		handleDragOver(e) {
			e.preventDefault()
			e.dataTransfer.dropEffect = 'move'
		},
		handleClick(item) {
			if(!!item.key) {
				this.videos.forEach(v => {
					v.active = v.key === item.key;
				})
				this.$emit('setTreeCheck', item);
			}
		},
		setUserAudioStatus(user) {
			this.$emit('setUserAudioStatus', user)
		}
	},
};
</script>
<style lang="css" scoped>
.play-box{
	width: 100%;
	height: 100%;
	padding-top: 45px;
	position: relative;
	overflow: hidden;
}
.video-absolute {
	position: absolute;
	width: 200px;
	height: calc(100% - 45px);
	background: rgba(0, 48, 104, 1);
	border: 1px solid rgba(29, 110, 197, 1);
	right: 0;
	top: 45px;
	z-index: 11;
}
.video-absolute .video-absolute-ctl {
	position: absolute;
	top: 50%;
	left: -20px;
	width: 20px;
	height: 40px;
	line-height: 20px;
	z-index: 11;
	color: #fff;
	cursor: pointer;
}
.video-absolute .video-absolute-ctl::after {
	content: '';
	width: 100%;
	position: absolute;
	left: -5px;
	top: -10px;
	height: 100%;
	transform: perspective(2px) rotateY(-3deg);
	background: rgba(0, 48, 104, 1);
	border-color: rgba(29,110,197,1);
	border-width: 1px 0 1px 1px;
	border-style: solid;
	z-index: -1;
}
.videoBox {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	height: 100%;
	border-style: solid;
	border-color: #1D6EC5;
	border-width: 1px 0 0 1px;
	position: relative;
}
.videoBox .video-box {
	background-color: #07366B;
	border-style: solid;
	border-color: #1D6EC5;
	border-width: 0 1px 1px 0;
	position: relative;
	overflow: hidden;
	flex: 1;
}
.videoBox .video-box.active{
	border-color: red;
	border-width: 1px;
}
.videoBox .video-grid-2 {
	width: 50%;
	height: 50%;
	min-height: 50%;
	max-height: 50%;
	min-width: 50%;
	max-width: 50%;
}
.videoBox .video-grid-3 {
	width: 33.33%;
	height: 33.33%;
	min-height: 33.33%;
	max-height: 33.33%;
	min-width: 33.33%;
	max-width: 33.33%;
}
.videoBox .video-grid-4 {
	width: 25%;
	height: 25%;
	min-height: 25%;
	max-height: 25%;
	min-width: 25%;
	max-width: 25%;
}
.video-none{
	width: 20%;
	height: 38.4%;
	margin: auto;
	margin-top: 10%;
}
.videoBox .video-box:hover .video-control {
	display: block;
}
.videoBox .video-box video {
	width: 100%;
	height: 100%;
}
.videoBox .video-box .video-msg {
	position: absolute;
	width: auto;
	text-align: left;
	left: 20px;
	top: 8px;
	z-index: 99;
}
.videoBox .video-box .video-control {
	position: absolute;
	width: 100%;
	text-align: right;
	background-image: linear-gradient(rgba(7, 54, 107, .7), rgba(7, 54, 107, .3), rgba(7, 54, 107, 0));
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
.videoBoxMain{
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	display: block;
	border: none;
}
.videoBoxMain .video-box.video-box-sub {
	position: relative;
	z-index: 11;
	width: 160px;
	height: 90px;
	min-width: 160px;
	min-height: 90px;
	max-width: 160px;
	max-height: 90px;
	opacity: 0.7;
	border: 0;
	top: 2px;
	margin-top: 16px;
	margin-right: 20px;
	margin-left: auto;
	background-color: #fff;
	cursor: pointer;
}
/* .videoBoxMain .video-box.video-box-sub:hover{
	width: 192px;
	height: 108px;
	min-width: 192px;
	min-height: 108px;
	max-width: 192px;
	max-height: 108px;
} */

.videoBoxMain .video-box.video-box-sub:hover::before{
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
}
.videoBoxMain .video-box.video-box-main {
	width: 100%;
	height: 100%;
	min-width: 100%;
	min-height: 100%;
	max-width: 100%;
	max-height: 100%;
	background-color: #07366B;
	position: absolute;
	z-index: 10;
	top: 0;
	left: 0;
	border-width: 1px;
}
.videoBoxMain video {
	height: 100%;
}
.tool-grid-control{
	position: absolute;
	top: 0px;
	width: 200px;
	height: 40px;
	right: 0;
	z-index: 11;
	text-align: right;
}
.tool-grid-control .el-button {
	font-size: 18px;
	color: #F3F9FF;
}
.task-process-box {
	position: absolute;
	left: 0;
	width: 100%;
	height: 100px;
	z-index: 1009;
	bottom: 140px;
}
.tool-audio-control {
	position: fixed;
	left: calc(50% + 45px);
	z-index: 9999;
	bottom: 40px;
}
.videoBoxMain.close .video-box.video-box-sub{
	width: 0px;
	min-width: 0;
	max-width: 0;
	transition: width 0.3s ease-in-out;
	display: none;
}
.tool-grid-control.close{
	display: none;
}
.video-absolute.close {
	right: -200px;
	transition: right 0.3s ease-in-out;
}
.video-absolute.close * {
	
}
</style>