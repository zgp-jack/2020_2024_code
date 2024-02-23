<!--  -->
<template>
  <section class="panel-container">
    <div class="panel-container-header">
      <el-row>
        <el-col :span="20">
          <span>
            {{ title }}
          </span>

          <small v-if="leftFlagTitle" class="panel-container-header-info">
            {{ leftFlagTitle || "创建人" }}:
            <b class="panel-container-header-info-value">
              {{ leftFlagValue }}
            </b>
          </small>
          <small v-if="rightFlagTitle" class="panel-container-header-info">
            {{ rightFlagTitle || "创建时间" }}:
            <b class="panel-container-header-info-value">
              {{ rightFlagValue }}
            </b>
          </small>
        </el-col>
        <el-col v-if="showExpand" :span="4" class="expand-wrapper">
          <el-button :icon="Icon" size="mini" type="text" @click="clickExpand">
            {{ expand ? "收起" : "展开" }}</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="$slots.bottom" class="panel-container-bottom">
      <slot name="bottom" />
    </div>
    <el-collapse-transition>
      <div
        v-show="Expanded"
        class="panel-container-body-box"
        :style="StyleBody"
      >
        <div class="panel-container-body-box-content" :style="StyleContent">
          <slot name="default" />
        </div>
      </div>
    </el-collapse-transition>
  </section>
</template>

<script>
import { mapMutations, } from 'vuex';
export default {
  name: 'Panel',
  components: {},
  props: {
    PK: String,
    width: {
      type: [Number, String],
      default: 548,
    },
    title: {
      type: String,
      required: true,
      default: 'xXXXx',
    },
    leftFlagTitle: {
      type: String,
      default: '',
    },
    leftFlagValue: {
      type: String,
      default: '',
    },
    rightFlagTitle: {
      type: String,
      default: '',
    },
    rightFlagValue: {
      type: String,
      default: '',
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    expand: {
      type: Boolean,
      default: false,
    },
    height: [String, Number, NaN],
  },
  data() {
    return {
      // expand: true,
    };
  },
  computed: {
    Height() {
      return this.height ? this.height : '100%';
    },
    Expanded() {
      if (!this.showExpand) {
        return true;
      }
      return this.expand;
    },
    Icon() {
      return `el-icon-arrow-${this.expand ? 'down' : 'up'}`;
    },
    StyleContent() {
      return {
        height: this.Height + '!important',
      };
    },
    StyleBody() {
      return {
        backgroundColor: this.disabled ? '#f7f7f7' : '#ffff',
      };
    },
  },
  mounted() {},
  methods: {
    ...mapMutations('project/index', ['SET_PANCEL_EXPAND']),

    clickExpand() {
      this.SET_PANCEL_EXPAND({
        name: this.PK,
        expand: !this.expand,
      });
      // this.expand = !this.expand;
    },
  },
};
</script>
<style lang="scss" scoped>
.expand-wrapper {
  text-align: right;
  padding-right: 16px;
}
.panel {
  &-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    width: 100%;
    height: 100%;
    &-header {
      height: 34px;
      background: #e2e3e7;
      border-radius: 4px 4px 0px 0px;
      line-height: 34px;
      padding: 0 0 0 16px;
      &-info {
        margin: 0 0 0 28px;
        font-size: 14px;
        font-weight: 400;
        color: #879bba;
        &-value {
          margin: 0 0 0 2px;
          color: #2d405e;
        }
      }
    }
    &-bottom {
      height: 30px;
      display: flex;
      line-height: 30px;
      background: #f0f1f5;
      padding-left: 16px;
      > span {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: #879bba;
        > b {
          font-size: 14px;
          font-weight: 400;
          color: #334266;
        }
      }
    }
    &-body {
      &-box {
        box-sizing: border-box;
        // box-shadow: inset 0 0 0px 1px #ecf0f7;
        border: 1px solid #ecf0f7;
        border-top: none;
        border-radius: 0px 0px 4px 4px;
        display: block;
        flex: 1;
        flex-basis: auto;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 6px;
          height: 10px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #e2e3e7;
          border-radius: 3px;
        }

        &-content {
          padding: 16px 16px 0px 16px;
          overflow: auto;
          &::-webkit-scrollbar {
            width: 6px;
            height: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #e2e3e7;
            border-radius: 3px;
          }
        }
      }
    }
  }
}
</style>
