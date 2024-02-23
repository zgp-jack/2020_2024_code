<template>
    <div v-show="showVideo" class="play-box">
        <div class="video-time">
            <span>{{ time }}</span>
        </div>
        <video id="playVideo" :class="!!main ? 'playVideo': 'localVideo'" autoplay @click="changeVideo()"></video>
        <video id="localVideo" :class="!!main ? 'localVideo': 'playVideo'" autoplay muted @click="changeVideo()"></video>
        <van-row class="video-btn-box">
            <van-col span="8">
                <van-button type="default" round class="exchange-btn" @click="handleChangeFacingMode()">
                    <i class="iconfont icon-fanzhuanjingtou"></i>
                </van-button>
                <p>翻转摄像头</p>
            </van-col>
            <van-col span="8">
                <van-button type="danger" round class="call-btn" @click="hangUpVideo()">
                    <i class="iconfont icon-guaduan"></i>
                </van-button>
                <p>挂断</p>
            </van-col>
            <van-col span="8">
                <van-button type="default" round class="muted-btn" @click="handleMuted()">
                    <i class="iconfont icon-jingyin" v-show="isMuted"></i>
                    <i class="iconfont icon-huatong" v-show="!isMuted"></i>
                </van-button>
                <p>麦克风已{{ isMuted ? '关' : '开' }}</p>
            </van-col>
            <van-col span="8">
                <van-button type="default" round class="exchange-btn" @click="handleChangeDevice()">
                    <van-icon name="setting" />
                </van-button>
                <p>切换摄像头</p>
            </van-col>
        </van-row>
    </div>
</template>
<script>
import Bus from './Bus';
export default {
    name: 'videPlay',
    data() {
        return {
            showVideo: false,
            timer: null,
            time: '00:00:00',
            hour: 0,
            minute: 0,
            second: 0,
            main: true,
            isMuted: false,
            facingMode: 'user',
            currtDeviceIndex: 1
        }
    },
    mounted() {
        Bus.$off('addVideoURL').$on('addVideoURL', data => {
            this.showVideo = true;
            this.addVideoURL(data.elementId, data.stream);
        })
        Bus.$off('replaceVideoURL').$on('replaceVideoURL', data => {
            this.replaceVideoURL(data.elementId, data.stream);
        })
        
        Bus.$on('handleLeaveVideo', active => {
            this.handleLeave(active);
        })
    },
    methods: {
        complZero(num) {
            return (num < 10 ? '0' : '')  + num;
        },
        setTime() {
            this.timer = setInterval(() => {
                this.second += 1;
                if(this.second > 60) {
                    this.minute += 1;
                    this.second = 0;
                }
                if(this.minute > 60) {
                    this.hour += 1;
                    this.minute = 0;
                }
                this.time = `${this.complZero(this.hour)}:${this.complZero(this.minute)}:${this.complZero(this.second)}`
            }, 1000) 
        },
        resetTime() {
            this.hour = 0;
            this.minute = 0;
            this.second = 0;
            this.time = '00:00:00'
        },
        changeVideo() {
            this.main = !this.main;
        },
        replaceVideoURL(elementId, stream){
            var video = document.getElementById(elementId);
            video.srcObject = stream;
        },
        addVideoURL(elementId, stream) {
            var video = document.getElementById(elementId);
            video.autoplay = 'autoplay';
            video.controls = false;
            if ('srcObject' in video) {
                video.srcObject = stream;
            } else {
                // 防止在新的浏览器里使用它，应为它已经不再支持了
                video.src = window.URL.createObjectURL(stream);
            }
            if(elementId === 'playVideo') {
                this.setTime();
            }
        },
        hangUpVideo() {
            this.handleLeave();
            Bus.$emit('hangUpVideo');
        },
        handleLeave() {
            document.getElementById('playVideo').srcObject = null;
            document.getElementById('localVideo').srcObject = null;
            this.showVideo = false;
            clearInterval(this.timer);
            this.timer = null;
            this.resetTime();
        },
        //切换
        handleChangeFacingMode() {
            Bus.$emit('changeFacingMode', { enabled: this.isMuted, facingMode: this.facingMode, func: () => {
                this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
            }});
        },
        handleMuted() {
            Bus.$emit('videoMuted', this.isMuted);
            this.isMuted = !this.isMuted;
        },
        handleChangeDevice() {
            Bus.$emit('changeFacingMode', { enabled: this.isMuted, deviceIndex: this.currtDeviceIndex, func: newIndex => {
                this.currtDeviceIndex = newIndex;
            } });
        }
    }
}
</script>
<style>
.play-box{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #000;
    overflow: hidden;
    z-index: 20001;
}
.playVideo{
  width: 100%;
  height: 100%;
  background-color: #000;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}
.localVideo{
    position: absolute;
    width: 120px;
    height: 213px;
    right: 20px;
    top: 20px;
    z-index: 10000;
}
.video-btn-box{
    position: fixed !important;
    bottom: 20px;
    z-index: 10001;
    width: 100%;
    left: 0;
}
.video-btn-box p {
    font-size: 12px;
    color: #e3e3e3;
    margin-top: 10px;
}
.video-time{
    position: fixed;
    top: 10px;
    width: 100%;
    z-index: 10001;
    text-align: center;
}
.video-time span {
    background-color: #d3d3d3;
    font-size: 14px;
    color: #333;
    border-radius: 8px;
    padding: 0px 5px;
}
</style>