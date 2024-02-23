<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-21 18:33:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-31 15:05:29
 * @Description:报修科室排名
-->
<template>
  <Card
    v-loading="loading"
    title="报修科室排名"
    element-loading-background="#01070da6"
  >
    <ul class="ul_wrapper">
      <li v-for="(item, index) in data" :key="index" class="li-item" @click="onClick(item)">
        <div class="text_wrapper">
          <span class="No" :style="(index + 1) | textColor">
            No.{{ index + 1 }}
          </span>
          <span class="text">
            {{ item.name }}
          </span>
        </div>
        <div class="progress_wrapper">
          <Bar :value="item.value2" />
        </div>
        <div class="text_wrapper">
          <span class="text planCount ">
            {{ item.value }}
            ({{ item.value2 }}%)
          </span>
        </div>
      </li>
    </ul>
  </Card>
</template>
<script>
import Card from '../../component/card';
import Bar from '../../component/bar';
import TicketBigScreenApi from '../api';
import DepartmentRankDialog from '../dialog/departmentRank';
import moment from 'moment';
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
    Card,
    Bar,
  },
  data() {
    return {
      data: [],
      startTime: null,
      endTime: null,
      loading: false,
    };
  },
  computed: {},
  async created() {
    this.startTime = moment().startOf('month').format('YYYY-MM-DD');
    this.endTime = moment().endOf('month').format('YYYY-MM-DD');
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      self.initData();
    });
  },
  methods: {
    async initData() {
      this.loading = true;
      const rs = await TicketBigScreenApi.deptRank({ startTime: this.startTime, endTime: this.endTime, });
      this.loading = false;
      this.data = rs;
    },
    onClick(item) {
      this.$dialog({
        title: `报修科室排名-${item.name}`,
        width: '740px',
        customClass: 'special-dialog',
        component: () => <DepartmentRankDialog data={item} />,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.ul_wrapper {
  padding: 0;
  margin: 0;
  overflow-y: auto;
  height: 100%;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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
    cursor: pointer;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    > .text {
      &_wrapper {
        width: 25%;
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
