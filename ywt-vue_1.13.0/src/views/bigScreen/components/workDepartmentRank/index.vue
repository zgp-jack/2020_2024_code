<template>
  <Wrapper :title="'报修科室排名'">
    <ul class="ul_wrapper">
      <li v-for="(item, index) in data" :key="index" class="li-item">
        <div class="text_wrapper">
          <span class="No" :style="(index + 1) | textColor">
            No.{{ index + 1 }}
          </span>
          <span class="text">
            {{ item.name }}
          </span>
        </div>
        <div class="progress_wrapper">
          <Bar :value="item.num" />
        </div>
        <div class="text_wrapper">
          <span class="text planCount ">
            {{ item.num }}
            ({{ item.value1 }}%)
          </span>
        </div>
      </li>
    </ul>
  </Wrapper>
</template>

<script>
import Wrapper from '../wrapper/index.vue';
import Bar from './component/bar.vue';
import BigScreenApi from '@/apis/bigScreen/index';
export default {
  filters: {
    textColor(val) {
      let color = '';
      if (val === 1) {
        color = '#E64645';
      } else if (val > 1 && val < 4) {
        color = '#60E7FC';
      } else if (val > 3 && val < 6) {
        color = '#7DC1FF';
      } else {
        color = '#C3CED9';
      }
      return `color:${color}`;
    },
  },
  components: {
    Wrapper,
    Bar,
  },
  data() {
    return {
      data: [],
    };
  },
  computed: {},
  mounted() {
    const self = this;
    this.$nextTick(() => {
      self.initData();
    });
  },
  methods: {
    async initData() {
      const rs = await BigScreenApi.WorkDeparmentRank();
      this.data = rs;
    },
  },
};
</script>

<style lang="scss" scpoed>
.ul_wrapper {
  padding: 0;
  margin: 0;
  overflow-y: auto;
  height: 100%;
  padding-left: 20px;
  padding-top: 15px;
  &::-webkit-scrollbar {
    width: 4px;
    height: 64px;
  }
  &::-webkit-scrollbar-thumb {
    background: #1890ff;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
.li {
  &-item {
    display: flex;
    align-items: center;

    margin-bottom: 20px;
    > .text {
      &_wrapper {
        width: 20%;
        display: flex;
        > .No,
        .text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          white-space: nowrap;
        }
        > .planCount {
          text-align: center;
        }
        > span {
          font-size: 14px;
          font-weight: 400;
          color: #c9e5ff;
        }
      }
    }
    > .progress_wrapper {
      flex: 1;
      ::v-deep {
        .el-progress-bar__outer {
          border-radius: none !important;
        }
      }
    }
  }
}
</style>
