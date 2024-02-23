<template>
    <div>
    <div id="audioBox"></div>
    <div class="audio-panel" v-show="audioShow">
        <div class="audio-title">
            <div>{{ title }}</div>
        </div>
        <div class="audio-time">
            {{ time }}
        </div>
        <van-row class="video-btn-box">
            <van-col span="24">
                <van-button type="danger" round class="call-btn" @click="hangUpAudio()">
                    <i class="iconfont icon-guaduan"></i>
                </van-button>
                <p>挂断</p>
            </van-col>
        </van-row>
    </div>
    </div>
</template>
<script>
    import Bus from './Bus';
    export default {
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
                timer: null,
                time: '00:00:00',
                hour: 0,
                minute: 0,
                second: 0,
                audioShow: false
            }
        },
        mounted() {
            Bus.$off('addAudioURL').$on('addAudioURL', data => {
                if(this.open) {
                    this.addAudioURL(data.elementId, data.stream);
                }
            })
            Bus.$off('handleLeaveAudio').$on('handleLeaveAudio', () => {
                console.log('handleLeave-audio');
                this.handleLeave();
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
                this.audioShow = true;
                this.setTime();
            },
            hangUpAudio() {
                this.handleLeave();
                Bus.$emit('hangUpAudio');
            },
            handleLeave() {
                const audioDom = document.getElementById('audioBox');
                while (audioDom.hasChildNodes()) {
                    audioDom.removeChild(audioDom.firstChild);
                }
                clearInterval(this.timer);
                this.resetTime();
                this.audioShow = false;
            }
        }
    }
</script>
<style>
#audioBox{
    width: 0;
    display: none;
}
.audio-panel{
    background: linear-gradient(#000 2%, #222 10%,#000 18%,#000 50%, #222 65%,#000 80%, #000 100%);
    color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    z-index: 99999;
    
}
.audio-title{
    margin-top: 60%;
    font-size: 28px;
    width: 120px;
    line-height: 120px;
    text-align: center;
    background-color: #1989fa;
    border-radius: 10px;
    height: 120px;
    display: inline-block;
    overflow: hidden;
}
.audio-title>div{
    display: table-cell;  
    vertical-align: middle;
    width: 120px;
    height: 120px;
    line-height: 36px;
    text-align: center;
}
.audio-time{
    margin-top: 20px;
    font-size: 32px;
}
</style>