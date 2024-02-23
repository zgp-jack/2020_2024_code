<template>
    <div v-show="showVideo" class="video-panel">
        <div id="multiVideoBox"></div>
        <div class="video-mulit-time">
            {{ time }}
        </div>
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
            <van-col span="8">
                <van-button type="default" round class="exchange-btn" @click="handleAddUserToGroup()">
                    <van-icon name="plus" />
                </van-button>
                <p>邀请进群</p>
            </van-col>
        </van-row>
    </div>
</template>
<script>
import Bus from './Bus';
import { Notify } from 'vant';
export default {
    name: 'multiVideoPlay',
    props: {
        open: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: '开发讨论组1'
        }
    },
    data() {
        return {
            showVideo: false,
            timer: null,
            time: '00:00:00',
            hour: 0,
            minute: 0,
            second: 0,
            main: true,
            videoTotal: 0,
            isMuted: false,
            videoList: [],
            facingMode: 'user',
            currtDeviceIndex: 1,
            elementIds: ''
        }
    },
    mounted() {
        
        Bus.$off('addVideoURL').$on('addVideoURL', data => {
            if(this.open) {
                this.showVideo = true;
                if(this.videoList.findIndex( item => {return item === data.elementId}) < 0) {
                    this.addVideoURL(data.elementId, data.stream);
                }
            }
        })
        Bus.$off('replaceVideoURL').$on('replaceVideoURL', data => {
            this.replaceVideoURL(data.elementId, data.stream);
        })
        Bus.$off('handleLeaveVideo').$on('handleLeaveVideo', () => {
            this.handleLeave();
        })
    },
    methods: {
        complZero(num) {
            return (num < 10 ? '0' : '')  + num;
        },
        setTime() {
            if(!!this.timer) {
                return false;
            }
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
            this.videoList.push(elementId);
            this.videoTotal++;
            
            var video = document.createElement('video');
            video.id = elementId;
            video.autoplay = 'autoplay';
            video.controls = false;
            video.className='video-cell-2';
            video.onclick = evt => {
                Notify(video.requestFullscreen);
                video.requestFullscreen();
            }
            if(this.videoTotal > 4) {
                video.className = 'video-cell-3'
            }
            if(this.videoTotal > 9) {
                video.className = 'video-cell-4'
            }
            if(this.videoTotal > 16) {
                video.className = 'video-cell-5'
            }
            if(elementId === 'localVideo') {
                video.muted = true;
            }
            if ('srcObject' in video) {
                video.srcObject = stream;
            } else {
                // 防止在新的浏览器里使用它，应为它已经不再支持了
                video.src = window.URL.createObjectURL(stream);
            }
            document.getElementById('multiVideoBox').appendChild(video);
            this.showVideo = true;
            this.setTime();
        },
        //挂断
        hangUpVideo() {
            this.handleLeave();
            Bus.$emit('hangUpVideo');
        },
        handleLeave() {
            const videoDom = document.getElementById('multiVideoBox');
            while (videoDom.hasChildNodes()) {
                videoDom.removeChild(videoDom.firstChild);
            }
            this.videoTotal = 0;
            this.showVideo = false;
            clearInterval(this.timer);
            this.timer = null;
            this.resetTime();
            this.videoList = [];
        },
        handleChangeFacingMode() {
            Bus.$emit('changeFacingMode', { enabled: this.isMuted, facingMode: this.facingMode, func: () => {
                this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
            }});
        },
        handleMuted() {
            Bus.$emit('videoMuted', this.isMuted);
            this.isMuted = !this.isMuted;
        },
        handleAddUserToGroup() {
            Bus.$emit('handleAddUserToGroup')
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
.video-panel{
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    background-color: #000;
    z-index: 1002;
}
#multiVideoBox{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    align-content: flex-start;
}
#multiVideoBox video {
  background-color: #000;
  border-style: solid;
  border-color: #666;
  border-width: 0 1px 1px 0;
  position: relative;
  overflow: hidden;
  flex: 1;
}
#multiVideoBox .video-cell-2 {
    width: 187px;
    height: 105px;
    min-height: 105px;
    max-height: 105px;
    min-width: 187px;
    max-width: 187px;
}
#multiVideoBox .video-cell-3 {
    width: 125px;
    height: 93px;
    min-height: 93px;
    max-height: 93px;
    min-width: 125px;
    max-width: 125px;
}
#multiVideoBox .video-cell-4 {
    width: 93px;
    height: 52px;
    min-height: 52px;
    max-height: 52px;
    min-width: 93px;
    max-width: 93px;
}
.video-mulit-time{
    position: fixed;
    bottom: 200px;
    width: 100%;
    text-align: center;
    z-index: 10001;
    font-size: 26px;
    color: #e3e3e3;
    border-radius: 8px;
    padding: 0px 5px;
    height: 24px;
}
</style>