<template>
  <pure-panel-card v-loading="loading" class="max-height">
    <div slot="header">操作记录</div>
    <pure-timeline :reverse="false" class="timeline">
      <pure-timeline-item
        v-for="(item,index) in list"
        :key="index"
        class="timeline-item"
      >
        <i slot="dot" class="pure-dot" />
        <div class="process line-margin">{{ item.operStateToName }}</div>
        <div class="timestamp line-margin">{{ item.createTime }}</div>
        <template v-if="item.operState==='evaluate'">
          <div class="item">评价人：<span>{{ item.createUserName }}</span></div>
          <div class="item">评价结果：<span>{{ item.processValue }}</span></div>
        </template>
        <template v-if="item.operState==='create_order'">
          <div class="item">操作人：<span>{{ item.createUserName }}</span></div>
          <div class="item">建单来源：<span>{{ item.processValue }}</span></div>
        </template>
        <template v-if="item.operState==='allocate'">
          <div class="item">操作人：<span>{{ item.createUserName }}</span></div>
          <div class="item">派单给：<span>{{ item.send }}</span></div>
        </template>
        <template v-if="item.operState==='receiving'">
          <div class="item">接单人：<span>{{ item.createUserName }}</span></div>
          <div class="item">接单类型：<span>{{ item.processValue }}</span></div>
        </template>
        <template v-if="item.operState==='hurry'">
          <div class="item">催单人：<span>{{ item.createUserName }}</span></div>
          <div class="item">催单次数：<span>{{ item.processValue }}</span></div>
        </template>
        <template v-if="item.operState==='edit_order'">
          <div class="item">修改人：<span>{{ item.createUserName }}</span></div>
          <div class="item">
            <el-popover
              placement="right"
              width="400"
              trigger="click"
            >
              <div v-if="castChangeData(item.processValue) === null">
                <div class="edit-card__header">
                  <div>暂无修改</div>
                </div>
              </div>
              <div v-for="(item1,key) in castChangeData(item.processValue)" v-else :key="key">
                <div class="edit-card__header">
                  <div>{{ key }}</div>
                </div>
                <div v-if="key === '附件'" class="old-edit" style="display: flex">原：
                  <pure-attachment-list :list="item1.oldValue" />
                </div>
                <div v-else class="old-edit">原：<span>{{ item1.oldValue }}</span></div>
                <div v-if="key === '附件'" class="new-edit" style="display: flex">现：
                  <pure-attachment-list :list="item1.newValue" />
                </div>
                <div v-else class="new-edit">现：<span>{{ item1.newValue }}</span></div>
              </div>
              <el-button slot="reference" class="show-btn">查看修改项</el-button>
            </el-popover>
          </div>
        </template>
        <template v-if="item.operState==='making'">
          <div class="item">处理人：<span>{{ item.createUserName }}</span></div>
          <div class="item">处理状态：
            <span v-if="item.makeState === 'complete'" class="complete-info">{{ item.makeStateToName }}</span>
            <span v-else>{{ item.makeStateToName }}</span>
          </div>
        </template>
        <template v-if="item.operState==='examine'">
          <div class="item">审核人：<span>{{ item.createUserName }}</span></div>
          <div class="item">审核结果：<span>{{ item.processValue }}</span></div>
        </template>
        <template v-if="item.operState==='appraisal'">
          <div class="item">评价人：<span>{{ item.createUserName }}</span></div>
          <div class="item">评价结果：<span>{{ item.processValue }}</span></div>
        </template>

      </pure-timeline-item>
    </pure-timeline>
    <div v-if="tip" class="tip">{{ tip }}</div>
  </pure-panel-card>
</template>

<script>
import TicketApi from '@/features/ticket/api';
export default {
  name: 'TicketHistoryInfoPanel',
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      list: [
      ],
      loading: true,
      tip: '',
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    castChangeData(data) {
      if (data) {
        if (data === '{}') {
          return null;
        }
        return JSON.parse(data);
      }
      return null;
    },
    async fetchData() {
      try {
        if (!this.id) {
          return;
        }
        this.list = await TicketApi.processFlow(this.id);
      } catch (error) {
        console.log(error);
        this.tip = '流程信息获取失败';
      } finally {
        this.loading = false;
      }
    },
  },

};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";

.pure-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
  @include border_color_imp('color-text-placeholder');
}
.process {
  font-size: 16px;
  font-weight: bold;
}
.line-margin {
  margin-bottom: 16px;
}
.show-btn{
  @include font_color('color-primary');
  @include border_color_imp('color-primary');
}
.edit-card__header {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  @include font_color_imp('color-assist-gray');
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 12px;
  height: 32px;

  &::before {
    content: '';
    width: 5px;
    height: 50%;
    margin-right: 6px;
    top: 0;
    left: 0;
    @include background_color_imp('color-primary');
  }
}
.timeline {
  padding-left: 10px;
  .timeline-item {
    &:first-child {
      .pure-dot {
         @include border_color_imp('color-primary');
      }
      .process {
        @include font_color_imp('color-primary');
      }
    }
  }
}
.item {
  font-size: 14px;
  @include font_color_imp('color-text-minor');
  &+.item {
    margin-top: 16px;
  }
  span {
    color: #757E7E;
  }
}
.old-edit{
  @include font_color('color-primary');
  padding: 5px 14px;
  span {
    @include font_color('color-primary');
  }
}
.new-edit{
  color: #757E7E;
  padding: 5px 14px;
  span {
    color: #757E7E;
  }
}
.complete-info{
  color: #FFD700 !important;
}
</style>
