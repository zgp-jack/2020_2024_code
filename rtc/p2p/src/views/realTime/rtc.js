navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription =
	window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
const configuration = {
    iceServers: [window.configure.DEFAULT_ICE_SERVER],
}
export default {
    data() {
        return {
            audioConfig: { echoCancellation: true, sampleSize: 24, sampleRate: 44100, channelCount: 1 },
            videoConfig: { frameRate: { ideal: 10, max: 15 }, width: { min: 240, ideal: 240, max: 240 } },
            maxBitrate: 500 * 1024,
            videoStream: null,
            audioStream: null,
            displayStream: null,
            peerConn: {},
            timerAudioLevel: null, //音频级别判断定时器
			callVideoTrack: [], //通话中的音频轨道
        }
    },
    mounted() {
		this.getMedia();
    },
    methods: {
        // 获取本地音视频流
		getMedia() {
			//视频流
			navigator.mediaDevices
				.getUserMedia({ audio: this.audioConfig, video: this.videoConfig })
				.then((stream) => {
					this.videoStream = stream;
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
				.getUserMedia({ audio: this.audioConfig, video: false })
				.then((stream) => {
					this.audioStream = stream;
				})
				.catch((err) => {
					console.log(err.name + ': ' + err.message);
				});
			navigator.mediaDevices.ondevicechange = (event) => {
				this.initCreate();
				// if (!!this.callingRoomId) {
				// 	this.$message.error('设备异常，通话已断开');
				// 	this.callingStreamType === 'video' ? this.hangUpVideo() : this.hangUpAudio();
				// }
			};
		},
        getDisplayMedia() {
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
                    this.displayStream = stream;
                })
        },
        // 建立webrtc连接
		createConnection(remoteUser, dontInput, dontOutput, isScreen) {
			this.peerConn[remoteUser] = new RTCPeerConnection(configuration);
			let localStream = this.callingStreamType == 'audio' ? this.audioStream : this.videoStream; //videoStream

			if (!isScreen) {
				this.peerConn[remoteUser].addStream(localStream);
				this.peerConn[remoteUser].streamType = this.callingStreamType;
			}
			if (isScreen && isScreen == 2) {
				this.callingStreamType = 'video';
				localStream = this.screenStream;
				this.peerConn[remoteUser].addStream(this.screenStream);
				this.peerConn[remoteUser].streamType = this.callingStreamType;
			}

			//只接收
			if (dontOutput) {
				//收发器
				this.peerConn[remoteUser].getTransceivers().forEach((transceiver) => {
					transceiver.direction = 'recvonly';
				});
			}
			//说话间隔
			let interval = 0;
			this.timerAudioLevel = setInterval(() => {
				this.peerConn[remoteUser].getReceivers().forEach((receivers) => {
					//
					if(receivers.track.kind === 'audio' && receivers.track.enabled === true && this.callVideoTrack.indexOf(receivers.track.id) < 0) {
						// this.callVideoTrack.push(receivers.track);
						// if(!!this.screenRecorder) {
						// 	this.screenRecorder.stream.addTrack(receivers.track.clone());
						// }
					}
					const rtcSynchronizationSources = receivers.getSynchronizationSources();
					if(rtcSynchronizationSources[0].audioLevel > 0.005) {
						this.setUserAudioStatus(remoteUser);
					} else {
						interval++;
						//如果超过半秒
						if(interval >= 5) {
							this.setUserAudioStatus();
							interval = 0;
						}
					}
				})
			}, 100)
			

			//限码
			// this.peerConn[remoteUser].getSenders().forEach((sender) => {
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
			this.peerConn[remoteUser].onaddstream = (e) => {
				if (isScreen && isScreen == 1) {
					let data = {
						elementId: 'videoRecord',
						stream: e.stream,
					};
					this.$emit('videoShare', data);
					return;
				}
				if (dontInput) {
					this.showAudioContrl = true;
					return;
				}
				if (this.callingStreamType === 'audio') {
					this.showAudioContrl = true;
					this.addAudioURL('audio' + Math.random() * 1000, e.stream);
				} else {
					this.showMulitVideoContrl = true;
					this.setVideo({
						show: true,
						key: remoteUser,
						type: 'user'
					})
					this.$nextTick(() => {
						this.addVideoURL(remoteUser + 'Video', e.stream);
					});
				}
			};
			this.peerConn[remoteUser].onicecandidate = (event) => {
				console.log('onicecandidate');
				setTimeout(() => {
					if (event.candidate) {
						console.log(event.candidate, 'onicecandidate');
						this.send({
							event: 'candidate',
							candidate: event.candidate,
							otherName: remoteUser,
							connectedUser: this.userName,
						});
					}
				});
			};
			//ice状态改变
			this.peerConn[remoteUser].oniceconnectionstatechange = (event) => {
				console.log(event);
				if (this.peerConn[remoteUser].iceConnectionState === 'failed') {
					console.log(remoteUser + '网络连接失败，正在进行重连');
					this.peerConn[remoteUser].restartIce();
				}
			};
		},
        closeConnection(remoteUser) {
			if (!!remoteUser) {
                if(!this.peerConn[remoteUser]) {
                    return false;
                }
				this.peerConn[remoteUser].close();
				this.peerConn[remoteUser].onicecandidate = null;
				this.peerConn[remoteUser].onaddstream = null;
				this.peerConn[remoteUser] = null;
			} else {
                for (const name in this.peerConn) {
                    this.closeConnection(name);
                }
            }
		},
        // 接受通话邀请
		handleAccept(data, streamType, single, isScreen) {
			let self = this;
			streamType = streamType || this.callingStreamType;
			// Create an offer
			this.peerConn[data.name].createOffer(
				(offer) => {
					console.log(offer);
					this.send({
						event: 'offer',
						offer: offer,
						offerUser: data.name,
						answerUser: self.userName,
						streamType: streamType,
						single: single,
						isScreen: isScreen,
					});
					this.peerConn[data.name].setLocalDescription(offer);
				},
				(error) => {
					alert('Error when creating an offer');
				}
			);
		},
        // 替换sdp内容
		insertStr(str, index, insertStr) {
			if (index < 0) {
				return str;
			}
			return str.substring(0, index) + insertStr + str.substring(index);
		},
		// 收到offer
		handleOffer(data) {
			//
			// if(!peerConn[data.name]) {
			//   this.createConnection(data.name);
			// }
			if (!this.peerConn[data.answerUser] && data.answerUser != this.userName) {
				this.createConnection(data.answerUser, false, data.single, data.isScreen);
			}
			//判断是否为视频流
			if (this.peerConn[data.answerUser].streamType === 'video') {
				//a=rtcp-fb:96 transport-cc x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150
				// data.offer.sdp = this.insertStr(data.offer.sdp, data.offer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150\r\n')
			}
			this.peerConn[data.answerUser].setRemoteDescription(new RTCSessionDescription(data.offer));
			// Create an answer to an offer
			this.peerConn[data.answerUser].createAnswer(
				(answer) => {
					this.peerConn[data.answerUser].setLocalDescription(answer);
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
		// 收到message
		handleMsg(data) {
			console.log(data.message);
		},
		// 收到answer
		handleAnswer(data) {
			if (this.peerConn[data.name].streamType === 'video') {
				// data.answer.sdp = this.insertStr(data.answer.sdp, data.answer.sdp.indexOf('a=rtcp-fb:96 transport-cc\r\n'), 'a=fmtp:96 x-google-max-bitrate=200;x-google-min-bitrate=100;x-google-start-bitrate=150\r\n')
			}
			this.peerConn[data.name].setRemoteDescription(new RTCSessionDescription(data.answer));
			// peerConn.setRemoteDescription(new RTCSessionDescription(data.answer));
		},
		// 交换ice
		handleCandidate(data) {
			// ClientB 通过 PeerConnection 的 AddIceCandidate 方法保存起来
			this.peerConn[data.name].addIceCandidate(new RTCIceCandidate(data.candidate));
		},
        // 全部webrtc链接是否关闭
		allClose() {
			let allClose = true;
			for (const key in this.peerConn) {
				if (Object.hasOwnProperty.call(this.peerConn, key)) {
					const conn = this.peerConn[key];
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
    }
}