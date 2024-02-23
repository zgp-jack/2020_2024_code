<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-21 15:06:15
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:56:45
 * @Description:大屏框架
-->
<template>
  <div class="big-screen-container wrapper">
    <header class="wrapper-header">
      <div class="wrapper-header-left">
        <h4 class="wrapper-header-left__title">{{ itemTitle }}</h4>
      </div>
      <div class="wrapper-header-center">
        <div class="notice-wrapper-a">
          <transition name="slide">
            <div :key="text.id">
              <span class="notice__text">通知公告</span>
              <span class="notice__content">
                {{ text.val }}
              </span>
            </div>
          </transition>
        </div>
        <div class="notice-wrapper-b text-over-flow" @click="onAlertMessage">
          <span class="notice__text">告警信息</span>
          <span class="notice__content">
            {{ alertMessage }}
          </span>

        </div>
      </div>
      <div class="wrapper-header-right">
        <b class="wrapper-header-right__time">
          {{ currentTime | date('YYYY-MM-DD HH:mm:ss') }}
        </b>
      </div>
    </header>
    <div
      ref="container"
      class="wrapper-grid"
    >
      <grid-layout
        :layout.sync="layoutList"
        :col-num="12"
        :row-height="rowHeight"
        :max-rows="15"
        :is-draggable="false"
        :is-resizable="false"
        :vertical-compact="false"
        :prevent-collision="true"
        :margin="[30, 30]"
        :auto-size="false"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="(item) in layoutList"
          :key="item.i"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          @move="moveEvent"
        >
          <div class="item-wrapper">
            <slot :item="item">
              <component
                :is="item.component"
                v-bind="item.componentProps"
              />
            </slot>
          </div>
        </grid-item>
      </grid-layout>
    </div>

  </div>
</template>

<script>
import { GridLayout, GridItem, } from 'vue-grid-layout';
import Alert from '../component/alert.vue';
import AlertList from '../component/alertList.vue';
import _ from 'lodash';
import { mapState, } from 'vuex';
export default {
  components: {
    GridLayout,
    GridItem,
  },
  props: {
    itemTitle: {
      type: String,
      default: '',
    },
    layoutList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      alertMessage: '',
      visibleAlert: true,
      historyLayoutList: [],
      ws: null,
      newX: 0,
      newY: 0,
      curBox: '',
      currentTime: Date.now(),
      rowHeight: 15,
      rowCount: 15,
      margin: [30, 30],
      textArr: [
        // '清明放假三天，京津冀两地放假7天，全市放假14天。',
        // '晚上8点到3号楼院办大会议室参加全体会议。',
        // '挥泪报答红岩毕业生，红岩毕业生挥泪报答红岩毕业生。'
      ],
      number: 0,
    };
  },
  computed: {
    ...mapState('login', ['accessToken']),
    text() {
      return {
        id: this.number,
        val: this.textArr[this.number],
      };
    },
  },

  created() {
    // 将传入的layoutList 做个深拷贝，用于比对
    this.historyLayoutList = _.cloneDeep(this.layoutList);
    const self = this;
    setInterval(() => {
      self.currentTime = Date.now();
    }, 1000);
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.rowHeight = ((this.$refs.container.clientHeight - this.margin[1]) / this.rowCount) - this.margin[1];

    this.initAlertWS();
  },
  destroyed() {
    this.closeAlertWS();
  },
  methods: {
    closeAlertWS() {
      if (!this.ws) {
        return;
      }
      this.ws.close();
      console.log('关闭');
    },
    // 初始化 消息弹窗 web-socket
    initAlertWS() {
      const self = this;

      const url = `${this.$store.state.login.uriConfig.bigScreenWsUri}?token=${this.accessToken}`;
      const ws = new WebSocket(url);
      self.ws = ws;

      ws.onmessage = (event) => {
        var data = event.data;
        console.log(data, 'data');
        if (data === '101') {
          console.log('告警消息连接成功！');
          return;
        }
        self.alertMessage = data;
        // 处理数据
        self.$dialog({
          title: `告警消息`,
          width: '740px',
          customClass: 'alert-dialog',
          component: () => <Alert message={data}/>,
        });
      };
    },

    onAlertMessage() {
      this.$dialog({
        title: '告警消息',
        customClass: 'special-dialog',
        component: () => <AlertList/>,
      });
    },
    startMove() {
      // eslint-disable-next-line
      let timer = setTimeout(() => {
        if (this.number === 2) {
          this.number = 0;
        } else {
          this.number += 1;
        }
        this.startMove();
      }, 2000); // 滚动不需要停顿则将2000改成动画持续时间
    },
    onResize() {
      this.rowHeight = ((this.$refs.container.clientHeight - this.margin[1]) / this.rowCount) - this.margin[1];
    },
    watchitem(item) {
      if (this.curBox !== item.i) {
        for (let j = 0; this.historyLayoutList[j] !== undefined; j++) {
          if (this.historyLayoutList[j].i === item.i) {
            item.x = this.historyLayoutList[j].x;
            item.y = this.historyLayoutList[j].y;
          }
        }
      }
      return item;
    },
    moveEvent: function (i, newX, newY) {
      var p;
      for (p = 0; p < this.layoutList.length; p++) {
        // Horizontal swapping
        if (
          newX >= this.layoutList[p]['x'] &&
          newX < this.layoutList[p]['x'] + this.layoutList[p]['w'] &&
          this.layoutList[i]['y'] === this.layoutList[p]['y'] &&
          i !== this.layoutList[p]['i']
        ) {
          const initialX = this.layoutList[i]['x'];
          const finalX = this.layoutList[p]['x'];
          this.layoutList[i]['x'] = finalX;
          this.layoutList[p]['x'] = initialX;
        }
        // Vertical swapping
        if (
          newY >= this.layoutList[p]['y'] &&
          newY < this.layoutList[p]['y'] + 1 &&
          this.layoutList[i]['x'] === this.layoutList[p]['x'] &&
          i !== this.layoutList[p]['i']
        ) {
          const initialY = this.layoutList[i]['y'];
          const finalY = this.layoutList[p]['y'];
          this.layoutList[i]['y'] = finalY;
          this.layoutList[p]['y'] = initialY;
        }
      }
    },

  },
};
</script>

<style lang="scss" scoped>
.big {
  &-screen {
    &-container {
      background: url("~@/assets/bigScreen/bg.png") no-repeat;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
.item {
  &-wrapper {
    height: 100%;
  }
}
.text-over-flow{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notice {
  &-wrapper-a {
    width: 44%;
  }
   &-wrapper-b {
    width: 25%;
  }
  &__text {
    opacity: 0.8;
    font-size: 16px;
    font-weight: bold;
    font-family: AlibabaPuHuiTi_2_75_SemiBold,
      AlibabaPuHuiTi_2_75_SemiBold-Regular;
    // font-weight: 400;
    color: #e64645;
  }
  &__content {
    opacity: 0.8;
    font-size: 16px;
    margin-left: 14px;
    font-family: AlibabaPuHuiTi_2_55_Regular,
      AlibabaPuHuiTi_2_55_Regular-Regular;
    font-weight: 400;
    color: #fff;
  }
}
.wrapper {
  &-header {
    height: 60px;
    line-height: 60px;
    display: flex;
    width: 100%;
    background: url("~@/assets/bigScreen/header.png") no-repeat;
    background-size: 100%;

    &-left {
      width: 340px;
      &__title {
        padding: 0;
        margin: 0 0 0 30px;
        font-size: 30px;
        font-weight: 400;
        background-image: linear-gradient(180deg, #e6e6e6 38%, #1890ff 86%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    &-center {
      flex: 1;
      // line-height: 0;
      position: relative;
      display: flex;
      padding-top: 18px;
    }
    &-right {
      // width:300px ;
      // text-align: center;
      &__time {
        display: inline-block;
        margin: 0 30px 0 0;
        font-size: 18px;
        font-family: Quantico, Quantico-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        padding: 0 2px;
      }
    }
  }
  &-grid {
    flex: 1;
    overflow: hidden;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s linear;
}
.slide-enter {
  transform: translateY(20px) scale(1);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-20px) scale(0.8);
  opacity: 0;
}

</style>
