<template>
	<div id="app">
		<!-- <div class="box">
			<div class="header">
				<button @click="startRecordScreen">开始录制屏幕</button>
				<button @click="stopRecordScreen">停止录制</button>
			</div>
			<video ref="screen" autoplay></video>
		</div> -->
		<!-- <div class="box">
			<div class="header">
				<button @click="startRecordCamera">开始录制摄像头</button>
				<button @click="stopRecordCamera">停止录制</button>
			</div>
			<video ref="camera" autoplay></video>
		</div> -->
	</div>
</template>
<script>
import dayjs from 'dayjs';
// const socket = io.connect(config.API_ROOT);
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
export default {
	name: 'videoRecord',
	props: ['isVideoRecord'],
	data() {
		return {
			screenStream: null, // 屏幕视频流
			screenRecorder: null, // 屏幕记录

			cameraStream: null,
			cameraRecorder: null,
			user: JSON.parse(sessionStorage.getItem('user')),
			user_name: sessionStorage.getItem('user_name'),
		};
	},
	mounted() {
		// socket.on(
		// 	'message',
		// 	function (data) {
		// 		switch (data.event) {
		// 			case 'recordCamera':
		// 				this.setUserList(data.allUsers);
		// 				break;
		// 			default:
		// 				break;
		// 		}
		// 	}.bind(this)
		// );
		// this.recordOpt = {
		//     mimeType: 'video/mp4'
		// }
	},
	methods: {
		send(message) {
			socket.send(JSON.stringify(message));
		},
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
				.then((stream) => {
					$this.screenStream = stream;
					$this.screenRecorder = new MediaRecorder(stream);
					// $this.$refs.screen.srcObject = stream;
					socket.send({
						event: 'StartRecord',
						name: $this.user_name,
						time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					});
					// 1000ms触发一次ondataavailable
					$this.screenRecorder.start(1000);
					$this.screenRecorder.ondataavailable = (e) => {
						socket.send({
							event: 'WriteRecord',
							name: $this.user_name,
							data: e.data,
						});
					};
				})
				.catch((err) => {
					this.$emit('update:isVideoRecord', true);
					console.log('getDisplayMedia err', err);
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
			socket.send({
				event: 'EndRecord',
				id: $this.user.id,
				time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
				token: sessionStorage.getItem('token'),
			});
		},

		//录制摄像头
		startRecordCamera() {
			let $this = this;
			navigator.mediaDevices
				.getUserMedia({
					video: {
						width: 1920,
						height: 1080,
						frameRate: 12,
					},
					audio: true,
				})
				.then((stream) => {
					// 打开websocket连接
					$this.cameraStream = stream;
					$this.cameraRecorder = new MediaRecorder(stream);
					$this.$refs.camera.srcObject = stream;
					socket.send({
						event: 'StartRecord',
						name: $this.user_name,
					});
					// 1000ms触发一次ondataavailable
					$this.cameraRecorder.start(1000);
					$this.cameraRecorder.ondataavailable = (e) => {
						socket.send({
							event: 'WriteRecord',
							name: $this.user_name,
							data: e.data,
						});
					};
				})
				.catch((err) => {
					console.log('getUserMedia err', err);
					$this.startRecordCamera();
				});
		},
		// 停止录制摄像头
		stopRecordCamera() {
			let $this = this;
			// 停止录制
			$this.cameraRecorder.stop();
			$this.cameraRecorder = null;
			// 停止所有流式视频轨道
			$this.cameraStream.getTracks().forEach((track) => track.stop());
			// 释放getDisplayMedia或getUserMedia
			$this.cameraStream = null;
			// 关闭socket连接
			socket.send({
				event: 'EndRecord',
				name: $this.user_name,
			});
		},
	},
};
</script>
<style scoped>
#app {
	display: flex;
	justify-content: space-around;
}

.box {
	width: 45%;
}

video {
	margin-top: 20px;
	width: 100%;
	height: auto;
	border: 2px solid #000;
}
</style>