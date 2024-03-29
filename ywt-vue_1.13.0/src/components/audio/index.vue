<template>
  <el-row style="display:flex;justify-content: center">
    <el-col v-if="theUrl" :span="24" style="border: 1px solid #e4e7ed; width: 296px">
      <audio
        ref="audio"
        class="dn"
        :src="url"
        :preload="audio.preload"
        @play="onPlay"
        @error="onError"
        @waiting="onWaiting"
        @pause="onPause"
        @timeupdate="onTimeupdate"
        @loadedmetadata="onLoadedmetadata"
      />
      <el-row>
        <el-col :span="2">
          <i
            :class="audio.playing | transPlayPause"
            @click="startPlayOrPause"
          />
        </el-col>
        <el-col :span="4">
          <label>{{ audio.currentTime | formatSecond }}</label>
        </el-col>
        <el-col :span="10">
          <el-slider
            v-show="!controlList.noProcess"
            v-model="sliderTime"
            :format-tooltip="formatProcessToolTip"
            style="width: 100%"
            class="slider"
            @change="changeCurrentTime"
          />
        </el-col>
        <el-col :span="4">
          <label>{{ audio.maxTime | formatSecond }}</label></el-col>
        <el-col
          :span="1"
        ><a
          v-show="!controlList.noDownload"
          :href="url"
          target="_blank"
          class="el-icon-download"
          download
        /></el-col>
      </el-row>
    </el-col>
    <template v-else>
      无录音
    </template>
  </el-row>
</template>
<script>
function realFormatSecond(second) {
  var secondType = typeof second;
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second);
    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;
    return (
      hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    );
  } else {
    return '0:00:00';
  }
}
export default {
  name: 'VueAudio',
  filters: {
    formatSecond(second = 0) {
      return realFormatSecond(second);
    },
    transPlayPause(value) {
      return value ? 'el-icon-video-pause' : 'el-icon-video-play';
    },
    transMutedOrNot(value) {
      return value ? '放音' : '静音';
    },
    transSpeed(value) {
      return '快进: x' + value;
    },
  },
  props: {
    theUrl: {
      type: String,
      required: true,
    },
    theSpeeds: {
      type: Array,
      default() {
        return [1, 1.5, 2];
      },
    },
    theControlList: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // url: this.theUrl || 'http://devtest.qiniudn.com/secret base~.mp3',
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,
        muted: false,
        speed: 1,
        waiting: true,
        preload: 'auto',
      },
      sliderTime: 0,
      volume: 100,
      speeds: this.theSpeeds,
      controlList: {
        // 不显示下载
        noDownload: false,
        // 不显示静音
        noMuted: true,
        // 不显示音量条
        noVolume: true,
        // 不显示进度条
        noProcess: false,
        // 只能播放一个
        onlyOnePlaying: false,
        // 不要快进按钮
        noSpeed: true,
      },
    };
  },
  computed: {
    url: function () {
      return `${this.$store.state.login.uriConfig.fileBaseUri}${this.theUrl}`;
    },
  },
  created() {
    this.setControlList();
  },
  methods: {
    setControlList() {
      const controlList = this.theControlList.split(' ');
      controlList.forEach((item) => {
        if (this.controlList[item] !== undefined) {
          this.controlList[item] = true;
        }
      });
    },
    changeSpeed() {
      const index = this.speeds.indexOf(this.audio.speed) + 1;
      this.audio.speed = this.speeds[index % this.speeds.length];
      this.$refs.audio.playbackRate = this.audio.speed;
    },
    startMutedOrNot() {
      this.$refs.audio.muted = !this.$refs.audio.muted;
      this.audio.muted = this.$refs.audio.muted;
    },
    // 音量条toolTip
    formatVolumeToolTip(index) {
      return '音量条: ' + index;
    },
    // 进度条toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt((this.audio.maxTime / 100) * index);
      return '进度条: ' + realFormatSecond(index);
    },
    // 音量改变
    changeVolume(index = 0) {
      this.$refs.audio.volume = index / 100;
      this.volume = index;
    },
    // 播放跳转
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt(
        (index / 100) * this.audio.maxTime
      );
    },
    startPlayOrPause() {
      return this.audio.playing ? this.pausePlay() : this.startPlay();
    },
    // 开始播放
    startPlay() {
      this.$refs.audio.play();
    },
    // 暂停
    pausePlay() {
      this.$refs.audio.pause();
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
    // 当发生错误, 就出现loading状态
    onError() {
      this.audio.waiting = true;
    },
    // 当音频开始等待
    onWaiting(res) {},
    // 当音频开始播放
    onPlay(res) {
      this.audio.playing = true;
      this.audio.loading = false;
      if (!this.controlList.onlyOnePlaying) {
        return;
      }
      const target = res.target;
      const audios = document.getElementsByTagName('audio');
      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause();
        }
      });
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.waiting = false;
      this.audio.maxTime = parseInt(res.target.duration);
    },
  },
};
</script>
<style lang="scss" scoped>
.main-wrap {
  height: 26px;
  border: 1px blue($color: #000000);
}
.con {
  border: 1px solid red;
  height: 26px;
}
.slider {
  display: inline-block;
  width: 50px;
  position: relative;
  padding: 0 3px 0 3px;
}
label {
  font-size: 10px;
}
.slider ::v-deep .el-slider__button {
  width: 8px;
  height: 8px;
}
.slider ::v-deep .el-slider__bar {
  background-color: white;
  margin: 1px;
  height: 4px;
}
.slider ::v-deep .el-slider__runway {
  background: #4f99ff;
  margin: 0px;
}

.di .el-row ::v-deep .el-col {
  margin: 3px;
}
.di {
  display: inline-block;
  border: 1px solid #dee2ee;
}
.download {
  color: #409eff;
  margin-left: 15px;
}
.dn {
  display: none;
}
</style>
