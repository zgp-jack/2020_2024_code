<template>
  <div>
    <div ref="audio" class="ready-player">
      <div class="loading">
        <div class="loading__spinner" />
      </div>
      <div class="play-pause-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 18 24"
        >
          <path
            fill-rule="evenodd"
            d="M18 12L0 24V0"
            class="play-pause-btn__icon"
          />
        </svg>
      </div>

      <div class="controls">
        <span class="controls__current-time">0:00</span>
        <span>/</span>
        <span class="controls__total-time">0:00</span>
        <div class="controls__slider slider" data-direction="horizontal">
          <div class="controls__progress progress">
            <div class="pin progress__pin" data-method="rewind" />
          </div>
        </div>

      </div>

      <a v-if="download" :href="url" target="_blank" style="position:relative;left:0px">
        <svg-icon icon-class="download" class="el-icon-download" />
      </a>

      <audio>
        <source :src="url" type="audio/mpeg">
      </audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PureAudio',
  props: {
    theUrl: {
      type: String,
      require: true,
      default: '',
    },
    download: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      audioPlayer: null,
    };
  },
  computed: {
    url: function () {
      return `http://192.168.2.19:9000/jyw/${this.theUrl}`;
    },
  },
  mounted() {
    // this.audioPlayer = document.querySelector('.ready-player');
    this.audioPlayer = this.$refs.audio;
    this.audioPlayer.classList.add('green-audio-player');

    this.playPause = this.audioPlayer.querySelector('.play-pause-btn__icon');
    this.playPauseBtn = this.audioPlayer.querySelector('.play-pause-btn');
    this.loading = this.audioPlayer.querySelector('.loading');
    this.sliders = this.audioPlayer.querySelectorAll('.slider');
    this.progress = this.audioPlayer.querySelector('.controls__progress');
    this.player = this.audioPlayer.querySelector('audio');
    this.currentTime = this.audioPlayer.querySelector(
      '.controls__current-time'
    );
    this.totalTime = this.audioPlayer.querySelector('.controls__total-time');
    // this.speaker = this.audioPlayer.querySelector('.volume__speaker');
    this.draggableClasses = [
      'pin',
    ];
    this.currentlyDragged = null;
    this.initEvents();
    // this.directionAware();
  },
  methods: {
    initEvents() {
      this.audioPlayer.addEventListener('mousedown', (event) => {
        if (this.isDraggable(event.target)) {
          this.currentlyDragged = event.target;
          const handleMethod = this.currentlyDragged.dataset.method;
          const listener = this[handleMethod].bind(this);
          window.addEventListener('mousemove', listener, false);
          window.addEventListener(
            'mouseup',
            () => {
              this.currentlyDragged = false;
              window.removeEventListener('mousemove', listener, false);
            },
            false
          );
        }
      });

      // for mobile touches
      this.audioPlayer.addEventListener('touchstart', (event) => {
        if (this.isDraggable(event.target)) {
          [
            this.currentlyDragged,
          ] = event.targetTouches;

          const handleMethod = this.currentlyDragged.target.dataset.method;
          const listener = this[handleMethod].bind(this);

          window.addEventListener('touchmove', listener, false);
          window.addEventListener(
            'touchend',
            () => {
              this.currentlyDragged = false;
              window.removeEventListener('touchmove', listener, false);
            },
            false
          );

          event.preventDefault();
        }
      });
      this.playPauseBtn.addEventListener('click', this.togglePlay.bind(this));
      this.player.addEventListener(
        'timeupdate',
        this.updateProgress.bind(this)
      );
      this.player.addEventListener(
        'volumechange',
        this.updateVolume.bind(this)
      );
      this.player.addEventListener('loadedmetadata', () => {
        this.totalTime.textContent = this.formatTime(this.player.duration);
      });

      this.player.addEventListener(
        'seeking',
        this.showLoadingIndicator.bind(this)
      );
      this.player.addEventListener(
        'canplay',
        this.hideLoadingIndicator.bind(this)
      );
      this.player.addEventListener('ended', () => {
        this.playPause.attributes.d.value = 'M18 12L0 24V0';
        this.playPause.attributes.fill.value = '#409eff';
        this.player.currentTime = 0;
      });

      this.sliders.forEach((slider) => {
        const pin = slider.querySelector('.pin');
        slider.addEventListener('click', this[pin.dataset.method].bind(this));
      });
    },
    isDraggable(el) {
      let canDrag = false;
      const classes = Array.from(el.classList);
      this.draggableClasses.forEach((draggable) => {
        if (classes.indexOf(draggable) !== -1) {
          canDrag = true;
        }
      });
      return canDrag;
    },
    inRange(event) {
      const touch = ('touches' in event); // instanceof TouchEvent may also be used
      const rangeBox = this.getRangeBox(event);
      const sliderPositionAndDimensions = rangeBox.getBoundingClientRect();
      const { dataset: { direction, }, } = rangeBox;
      let min = null;
      let max = null;

      if (direction === 'horizontal') {
        min = sliderPositionAndDimensions.x;
        max = min + sliderPositionAndDimensions.width;
        const clientX = touch ? event.touches[0].clientX : event.clientX;
        if (clientX < min || clientX > max) return false;
      } else {
        min = sliderPositionAndDimensions.top;
        max = min + sliderPositionAndDimensions.height;
        const clientY = touch ? event.touches[0].clientY : event.clientY;
        if (clientY < min || clientY > max) return false;
      }
      return true;
    },
    updateProgress() {
      const current = this.player.currentTime;
      const percent = (current / this.player.duration) * 100;
      this.progress.style.width = `${percent}%`;

      this.currentTime.textContent = this.formatTime(current);
    },
    updateVolume() {
      this.volumeProgress.style.height = `${this.player.volume * 100}%`;
      if (this.player.volume >= 0.5) {
        this.speaker.attributes.d.value =
          'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
      } else if (this.player.volume < 0.5 && this.player.volume > 0.05) {
        this.speaker.attributes.d.value =
          'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
      } else if (this.player.volume <= 0.05) {
        this.speaker.attributes.d.value =
          'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
      }
    },
    getRangeBox(event) {
      let rangeBox = event.target;
      const el = this.currentlyDragged;
      if (event.type === 'click' && this.isDraggable(event.target)) {
        rangeBox = event.target.parentElement.parentElement;
      }
      if (event.type === 'mousemove') {
        rangeBox = el.parentElement.parentElement;
      }
      if (event.type === 'touchmove') {
        rangeBox = el.target.parentElement.parentElement;
      }
      return rangeBox;
    },
    getCoefficient(event) {
      const touch = ('touches' in event); // instanceof TouchEvent may also be used

      const slider = this.getRangeBox(event);
      const sliderPositionAndDimensions = slider.getBoundingClientRect();
      let K = 0;
      if (slider.dataset.direction === 'horizontal') {
        // if event is touch
        const clientX = touch ? event.touches[0].clientX : event.clientX;
        const offsetX = clientX - sliderPositionAndDimensions.left;
        const { width, } = sliderPositionAndDimensions;
        K = offsetX / width;
      } else if (slider.dataset.direction === 'vertical') {
        const { height, } = sliderPositionAndDimensions;
        const clientY = touch ? event.touches[0].clientY : event.clientY;
        const offsetY = clientY - sliderPositionAndDimensions.top;
        K = 1 - offsetY / height;
      }
      return K;
    },

    rewind(event) {
      if (this.inRange(event)) {
        this.player.currentTime =
          this.player.duration * this.getCoefficient(event);
      }
    },

    changeVolume(event) {
      if (this.inRange(event)) {
        this.player.volume = Math.round(this.getCoefficient(event) * 10) / 10;
      }
    },
    togglePlay() {
      if (this.player.paused) {
        this.playPause.attributes.d.value = 'M0 0h6v24H0zM12 0h6v24h-6z';
        // this.playPause.attributes.fill.value = '#E6A23C';
        this.player.play();
      } else {
        this.playPause.attributes.d.value = 'M18 12L0 24V0';
        // this.playPause.attributes.fill.value = '#409eff';
        this.player.pause();
      }
    },
    formatTime(time) {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? `0${sec}` : sec}`;
    },
    showLoadingIndicator() {
      this.playPauseBtn.style.display = 'none';
      this.loading.style.display = 'block';
    },

    hideLoadingIndicator() {
      this.playPauseBtn.style.display = 'flex';
      this.loading.style.display = 'none';
    },

    directionAware() {
      this.volumeControls.classList.remove('top', 'middle', 'bottom');

      if (window.innerHeight < 250) {
        this.volumeControls.classList.add('middle');
      } else if (this.audioPlayer.getBoundingClientRect().top < 154) {
        this.volumeControls.classList.add('bottom');
      } else {
        this.volumeControls.classList.add('top');
      }
    },
  },

};
</script>

<style lang="scss" scoped>
 @import "~@/common/styles/theme/handle.scss";
// colors
$shadow-light: rgba(0, 0, 0, 0.07);
$shadow-medium: rgba(0, 0, 0, 0.32);
$shadow-dark: rgba(0, 0, 0, 0.62);
$white: #fff;
$primary: #409eff;
$light-gray: #b0b0b0;
$lighter-gray: #d8d8d8;
$playing: #E6A23C;
$text: #2d405e;
@keyframes spin {
  from {
    transform: rotateZ(0);
  }

  to {
    transform: rotateZ(1turn);
  }
}
.el-icon-download {
  @include font_color_imp('color-assist-yellow');
  text-decoration: none;
  font-weight: bolder;
}
.green-audio-player {
  width:  calc(100% - 30px);
  min-width: 200px;
  height: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
//   padding-right: 8px;
  border-radius: 4px;
  user-select: none;

  svg,
  img {
    display: block;
    @include font_color_imp('color-assist-yellow');
    fill: currentColor;
  }

  .play-pause-btn {
    display: none;
    cursor: pointer;
    width: 24px;
    height: 24px;
    @include background_color_imp('color-primary');
    border-radius: 50%;
    // display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading {
    .loading__spinner {
      width: 8px;
      height: 8px;
      border: 2px solid $light-gray;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.4s linear infinite;
    }
  }

  .slider {
    flex-grow: 1;
    @include background_color_imp('color-stroke');
    cursor: pointer;
    position: relative;

    .progress {
      @include background_color_imp('color-primary');
      border-radius: inherit;
      position: absolute;
      pointer-events: none;

      .pin {
        height: 8px;
        width: 8px;
        border-radius: 8px;
        @include background_color_imp('color-primary');
        position: absolute;
        pointer-events: all;
        box-shadow: 0 1px 1px 0 $shadow-medium;
      }
    }
  }

  .controls {
    font-family: "Roboto", sans-serif;
    font-size: 10px;
    line-height: 14px;
    @include font_color_imp('color-assist-gray');
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    margin-left: 12px;

    .controls__slider {
      margin-left: 8px;
      margin-right: 8px;
      border-radius: 2px;
      height: 6px;

      .controls__progress {
        width: 0;
        height: 100%;

        .progress__pin {
          right: -4px;
          top: -1px;
        }
      }
    }

    span {
      cursor: default;
    }
  }

  .volume {
    position: relative;

    .volume__button {
      cursor: pointer;

      &.open {
        path {
          fill: $playing;
        }
      }
    }

    .volume__controls {
      width: 30px;
      height: 135px;
      background-color: $shadow-dark;
      border-radius: 7px;
      position: absolute;
      left: -3px;
      bottom: 52px;
      flex-direction: column;
      align-items: center;
      display: flex;

      &.hidden {
        display: none;
      }

      &.top {
        bottom: 52px;
        left: -3px;
      }

      &.middle {
        bottom: -54px;
        left: 54px;
      }

      &.bottom {
        bottom: -164px;
        left: -3px;
      }

      .volume__slider {
        margin-top: 12px;
        margin-bottom: 12px;
        width: 6px;
        border-radius: 3px;

        .volume__progress {
          bottom: 0;
          height: 100%;
          width: 6px;

          .volume__pin {
            left: -5px;
            top: -8px;
          }
        }
      }
    }
  }
}
</style>
