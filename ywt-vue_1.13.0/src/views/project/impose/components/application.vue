<!-- 申请弹窗 -->
<template>
  <el-container>
    <el-header>
      <el-row type="flex" align="middle">
        <el-col :span="4">
          <span class="title">
            申请
          </span>
        </el-col>
        <el-col :span="4">
          <span class="label-text">待处理:</span>
          <span class="label-value">{{ waitDeal }}</span>
        </el-col>
        <el-col :span="4">
          <span class="label-text">通过:</span>
          <span class="label-value">{{ deal }}</span>
        </el-col>
        <el-col :span="4">
          <span class="label-text">驳回:</span>
          <span class="label-value">{{ reject }}</span>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="application-main">
      <template v-if="result.length">
        <div v-for="v in result" :key="v.id" class="application-row">
          <el-row class="application-row-header">
            <el-col :span="6">
              <span>申请人:<small>{{ v.createUserToName }}</small></span>
            </el-col>
            <el-col :span="12">
              <span>申请时间: <small> {{ v.createTime }}</small></span>
            </el-col>
            <el-col :span="6">
              <span>
                申请状态:
                <small :style="v.state | state('color')">
                  {{ v.state | state }}
                </small>
              </span>
            </el-col>
          </el-row>
          <el-row class="application-row-body">
            <el-col :span="24" class="application-row-body-col">
              <span>变更原因:</span>
              <h6>{{ v.remark }}</h6>
            </el-col>
          </el-row>

          <el-row
            v-if="v.state === 1 && IsPrincipal"
            class="application-row-bottom"
          >
            <el-col :offset="16" :span="4" class="t-r">
              <el-button
                type="danger"
                size="mini"
                class="btn"
                @click="option(v.id, 'reject')"
              >
                驳回
              </el-button>
            </el-col>
            <el-col :span="4" class="t-r">
              <el-button
                type="success"
                class="btn"
                size="mini"
                @click="option(v.id, 'pass')"
              >
                通过
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <el-empty v-else :image-size="200" />
    </el-main>
    <el-footer class="footer">
      <pure-button type="wire-frame" label="关闭" @click="onClose" />
    </el-footer>
  </el-container>
</template>

<script>
import ProjectAPI from '@/apis/project';
import { mapActions, mapGetters, } from 'vuex';
export default {
  filters: {
    state(code, field = 'text') {
      const status = {
        1: {
          color: '#409EFF',
          text: '待审核',
        },
        2: {
          color: '#67C23A',
          text: '通过',
        },
        3: {
          color: '#F56C6C',
          text: '驳回',
        },
      };
      const val =
        field === 'text' ? status[code][field] : 'color:' + status[code][field];
      return val;
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      result: [],
      reject: 0,
      deal: 0,
      waitDeal: 0,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    UserId() {
      return this.userInfo.id;
    },
    IsPrincipal() {
      return this.data.principal === this.UserId;
    },
  },

  created() {
    this.open();
  },
  methods: {
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT']),
    onClose() {
      this.$emit('done');
    },
    async open() {
      const value = await ProjectAPI.impose.changeList(this.data.itemCode);
      console.log(value, 'value');
      this.result = value.changeList.reverse();
      this.reject = value.reject;
      this.deal = value.deal;
      this.waitDeal = value.waitDeal;
    },
    async option(v, t) {
      try {
        await ProjectAPI.impose.changeApply(v, t);
        this.FETCH_PERFORM_EVENT({ name: 'imposeList', });
        this.$message.success('操作成功');
        this.$emit('done');
      } catch (e) {
        this.$message.error(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  &-value {
    font-weight: 400;
    font-size: 14px;
    color: #334266;
  }
  &-text {
    font-weight: 400;
    font-size: 14px;
    color: #7d8db3;
  }
}
.t-r {
  text-align: right;
}
.title {
  line-height: 60px;
  font-size: 20px;
  font-weight: 400;
  color: #334266;
  padding: 0 20px;
}
.footer {
  line-height: 60px;
}
.application {
  &-main {
    &::-webkit-scrollbar {
      width: 4px;
      margin-left: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #dee2ee;
      border-radius: 3px;
    }
  }
  &-row {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 100px;
    border: 1px solid #e6eaf2;
    border-radius: 4px;
    margin-bottom: 56px;
    padding: 24px;
    &-header {
      span {
        font-size: 18px;
        font-weight: 400;
        color: #879bba;
      }
      small {
        font-size: 18px;
        font-weight: 400;
        color: #2d405e;
        margin: 0 0 0 6px;
        display: inline-block;
      }
    }
    &-body {
      margin-top: 16px;
      flex: 1;
      &-col {
        display: flex;
        span {
          white-space: nowrap;
          font-size: 18px;
          font-weight: 400;
          color: #879bba;
        }
        h6 {
          display: inline-block;
          font-size: 18px;
          font-weight: 400;
          color: #2d405e;
          margin: 0 0 0 6px;
          padding: 0;
          line-height: 1.3;
        }
      }
    }
    &-bottom {
      margin-top: 32px;
    }
  }
}
</style>
