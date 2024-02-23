<!--  -->
<template>
  <div class="next-wrapper" :class="stateClass" @click="$emit('click',info)">
    <ul>
      <li>
        <h5>{{ info.title }}</h5>
      </li>
      <li>
        <span> 预订人:{{ info.createUserName || "-" }} </span>
      </li>
      <li>
        <span> 人数:{{ info.people }}人 </span>
      </li>
      <li>
        <div v-if="showBadge" class="badge">
          <span :class="badgeClass"> {{ badgeText }} </span>
        </div>
        <span> 预定时间：{{ info.startTime }} - {{ info.endTime }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    stateClass() {
      const classNameMap = {
        '1': 'state-active',
        '2': 'state-over',
      };
      return classNameMap[String(this.flag)] || 'state-default';
    },
    flag() {
      return this.info.flag;
    },
    showBadge() {
      return !!this.flag;
    },
    badgeText() {
      const textMap = {
        '1': '进行中',
        '2': '已结束',
      };
      return textMap[String(this.flag)];
    },
    badgeClass() {
      const classNameMap = {
        1: 'badge-active',
        2: 'badge-over',
      };
      return classNameMap[String(this.flag)];
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.state {
  &-default {
    border-color: #409eff !important ;
    &::before {
      background: #409eff;
    }
  }
  &-over {
    border-color: #334266 !important;
    &::before {
      background: #334266;
    }
  }
  &-active {
    border-color: #e66565 !important;
    &::before {
      background: #e66565;
    }
  }
}
.badge {
  position: absolute;
  padding: 2px 4px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  bottom: 4px;
  left: 0px;
  &-active {
    color: #f56c6c !important;
  }
  &-over {
    color: #fff !important;
  }
  > span {
    display: inline !important;
  }
}
.next {
  &-wrapper {
    margin: 0px 0;
    box-sizing: border-box;
    position: relative;
    border: 1px solid;
    border-radius: 4px;
    background-color: #fff;
    height: 100%;
    &::before {
      content: "";
      position: absolute;
      top: 14px;
      left: 0;
      width: 7px;
      height: 14px;
      border-radius: 0px 2px 2px 0px;
    }
    > ul {
      list-style: none;
      margin: 0 12px;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      h5 {
        padding: 0;
        margin: 12px 0;
        font-size: 18px;
        font-weight: 600;
        color: #0f2e4d;
      }
      span {
        margin-bottom: 8px;
        display: block;
        font-size: 14px;
        font-weight: 400;
        color: #909399;
      }
    }
  }
}
</style>
