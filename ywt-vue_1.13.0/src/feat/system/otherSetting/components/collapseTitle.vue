<template>
  <div class="switch-header" @click.stop="">
    <div class="switch-title">
      <div>{{ titleAndInfo.title }}</div>
      <img v-if="titleAndInfo.info" ref="titleDom" src="@/assets/prompt.svg" alt="" @mouseenter="promptIn" @mouseleave="promptLeave">
    </div>
    <div class="info-box" :style="{'top':y,'left':x}">
      <div v-show="isPromptIn" class="prompt-info">{{ titleAndInfo.info }}</div>
      <div v-show="isPromptIn" class="nabla" />
    </div>
    <el-switch
      v-if="hasSwitch"
      :value="isOpen"
      active-color="#426ED7"
      inactive-color="#ccc"
      @input="switchChange($event,titleAndInfo)"
    />
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    hasSwitch: {
      type: Boolean,
      default: () => true,
    },
    isOpen: {
      type: Boolean,
      default: () => false,
    },
    configType: {
      type: Object,
      default: function () {
        return {};
      },
    },
    titleAndInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
    idKey: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      isPromptIn: false,
      x: 0, y: 0,
    };
  },
  mounted() {
    // 调了半天找到 别动
    if (this.titleAndInfo.info) {
      const offset = {
        left: 74,
        top: 15,
      };
      this.x = this.$refs.titleDom.offsetLeft - offset.left + 'px';
      this.y = this.$refs.titleDom.offsetTop - offset.top + 'px';
    }
  },
  methods: {
    promptIn() {
      this.isPromptIn = true;
    },
    promptLeave() {
      this.isPromptIn = false;
    },
    switchChange(v, titleAndInfo) {
      this.$emit('isOpenClick', v, titleAndInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.switch-header{
  display: flex;
  align-items: center;
  height: 48px;
  line-height: 48px;
  position: absolute;
  margin-left: 10px;
  .switch-title{
    display: flex;
    font-size: 18px;
    font-weight: 600;
    align-items: center;
    margin-right: 5px;
    img{
      width: 14px;
      height: 14px;
      margin-left: 1px;
      margin: 10px 0;
    }
    img:hover{
      cursor: pointer;
    }
  }
  .info-box{
    position: absolute;
    width: 400px;
    // top: 0px;
    // left: -2px;
    .prompt-info{
      position:absolute;
      top: -22px;
      left: 60px;
      font-size: 12px;
      background: #020b1b;
      border-radius: 5px;
      line-height: 20px;
      padding: 5px 5px;
      color: rgb(255, 255, 255);
    }
    .nabla{
      position:absolute;
      top: 6px;
      left: 72px;
      width: 0px;
      height: 0px;
      border: 8px solid transparent;
      border-top-color: #020b1b;
    }
  }

}
</style>
