<template>
  <div class="comp-report-error-timeliness">
    <p class="title">服务时效性</p>
    <CompModuleHeader title="各故障分类处理耗时配置" />
    <div class="content-box">
      <div class="header">
        <span>故障分类</span>
        <div>处理耗时</div>
        <!-- <div>处理耗时<svg-icon icon-class="question" /></div>-->
      </div>
      <el-divider />
      <el-tree :expand-on-click-node="false" :data="timelinessConfigTreeData">
        <div slot-scope="{ data }" class="custom-tree-node">
          <span class="node-label">{{ data.name }}</span>
          <div class="node-content">
            <div v-if="data.isEdit">
              <el-row>
                <el-col :span="8">
                  <el-input-number v-model="data.minTime" controls-position="right" :min="0" size="small" />
                </el-col>
                <el-col :span="2">
                  <span>-</span>
                </el-col>
                <el-col :span="8">
                  <el-input-number v-model="data.maxTime" controls-position="right" :min="0" size="small" />
                </el-col>
                <el-col :span="6">
                  <el-select v-model="data.unit">
                    <el-option label="分钟" :value="1" />
                    <el-option label="小时" :value="2" />
                  </el-select>
                </el-col>
              </el-row>
            </div>
            <div v-else>
              <el-row>
                <el-col :span="8">
                  <span>{{ data.minTime }}</span>
                </el-col>
                <el-col :span="2">
                  <span>-</span>
                </el-col>
                <el-col :span="8">
                  <span>{{ data.maxTime }}</span>
                </el-col>
                <el-col :span="6">
                  <span v-if="data.unit">
                    {{ data.unit === 1 ? '分钟' : '小时' }}
                  </span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="node-operate">
            <pure-button
              v-if="data.isEdit"
              label="完成"
              type="text"
              @click="onNodeEditFinish(data)"
            />
            <pure-button
              v-else
              label="编辑"
              type="text"
              @click="onNodeEdit(data)"
            />
          </div>
        </div>
      </el-tree>
    </div>
    <CompModuleHeader title="服务时效性评级规则" />
    <el-form label-width="100px" class="form-box">
      <el-form-item label="优秀">
        <span class="desc">&lt;处理耗时最小值</span>
      </el-form-item>
      <el-form-item label="达标">
        <el-row>
          <el-col :span="4">
            <el-select v-model="rateConfig.minTimeSymbol">
              <el-option label="＞" :value="1" />
              <el-option label="≥" :value="2" />
            </el-select>
          </el-col>
          <el-col :span="8" style="text-align: center">
            处理耗时最小值 ~
          </el-col>
          <el-col :span="4">
            <el-select v-model="rateConfig.maxTimeSymbol">
              <el-option label="＜" :value="1" />
              <el-option label="≤" :value="2" />
            </el-select>
          </el-col>
          <el-col :span="8" style="text-align: center">
            处理耗时最大值
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="不达标">
        <span class="desc">&gt;处理耗时最大值</span>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <pure-button v-auth="'timelinessConfig:edit'" label="应用" :disabled="isButtonDisabled" @click="updateRateConfig" />
      <pure-button v-auth="'timelinessConfig:edit'" label="取消" type="patch" :disabled="isButtonDisabled" @click="onCancel" />
    </div>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import {
  getDicListByType,
  getTimelinessConfigTreeData,
  updateTimelinessConfigData,
  getRateConfig,
  updateRateConfig,
} from '../api';
import { cloneDeep, isEqual, } from 'lodash-es';

function addIsEdit(data) {
  return data.map(item => {
    item.isEdit = false;
    if (item.children) {
      item.children = addIsEdit(item.children);
    }
    return item;
  });
}

export default {
  components: {
    CompModuleHeader,
  },
  data() {
    return {
      faultTypeList: [],
      formData: {
        delayTime: '',
        leadTime: '',
      },
      originalFormData: null,
      timelinessConfigTreeData: [],
      rateConfig: {
        minTimeSymbol: null,
        maxTimeSymbol: null,
      },
    };
  },
  computed: {
    isButtonDisabled() {
      return !this.originalFormData || isEqual(this.originalFormData, this.rateConfig);
    },
  },
  created() {
    this.getFaultTypeList();
    this.getConfig();
    this.getRateConfig();
  },
  methods: {
    getFaultTypeList() {
      getDicListByType('obs_fault_type').then(res => {
        this.faultTypeList = res.data;
      });
    },
    getRateConfig() {
      const loading = this.showLoading();
      getRateConfig().then((result) => {
        if (result) {
          this.originalFormData = result;
          this.rateConfig = cloneDeep(result);
        }
      }).finally(() => {
        loading.close();
      });
    },
    onCancel() {
      this.rateConfig = cloneDeep(this.originalFormData);
    },
    getConfig() {
      const loading = this.showLoading();
      getTimelinessConfigTreeData().then((result) => {
        if (result) {
          this.timelinessConfigTreeData = addIsEdit(result);
          this.formData = cloneDeep(result);
        }
      }).finally(() => {
        loading.close();
      });
    },
    updateRateConfig() {
      const loading = this.showLoading();
      updateRateConfig(this.rateConfig).then(() => {
        this.$message.success('操作成功');
        this.getRateConfig();
      }).finally(() => {
        loading.close();
      });
    },
    onNodeEdit(data) {
      data.isEdit = true;
    },
    onNodeEditFinish(data) {
      const loading = this.showLoading();
      updateTimelinessConfigData(data).then((res) => {
        this.$message.success('操作成功');
        data.isEdit = false;
        this.getConfig();
      }).catch((err) => {
        this.$message.error(err);
      }).finally(() => {
        loading.close();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-report-error-timeliness {
  padding: 16px;
  background: #fff;
  .title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
  }
  .content-box {
    min-width: 500px;
    width: 800px;
    margin-bottom: 20px;
    .header {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
    }
  }
  .custom-tree-node {
    flex: auto;
    display: flex;
    align-items: center;
    font-size: 14px;
    .node-label {
      flex: auto;
    }
    .node-content {
      flex: none;
      margin: 0 20px;
    }
    .node-operate {
      flex: 0 0 80px;
      text-align: center;
    }
  }
  .form-box {
    max-width: 500px;
    .desc {
      font-size: 14px;
    }
  }
}
</style>
