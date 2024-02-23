<!--服务时效性-->
<template>
  <el-row :gutter="16" class="serveTimelinessWrapper">
    <el-col :span="8" class="h-100">
      <Collapse>
        <CollapseItem>
          <template #title>
            <span class="label">
              各故障分类处理耗时配置
            </span>
          </template>
          <div class="panel h-100">
            <div class="title">
              <span>
                故障分类
              </span>
              <span>
                处理耗时
                <el-tooltip class="item" effect="dark" content="配置工单处理耗时，只可配置最末级" placement="top">
                  <i class="el-icon-info" />
                </el-tooltip>
              </span>
            </div>
            <div class="treeBox">

              <el-tree
                :data="FaultTypeTreeList"
                node-key="id"
                :expand-on-click-node="false"
              >
                <el-row slot-scope="{ node, data }" class="custom-tree-node">
                  <el-col :span="14">
                    <span class="label font-18">{{ data.name }}</span>

                  </el-col>
                  <el-col :span="7">
                    <span class="label font-18">
                      {{ data.minTime }}-{{ data.maxTime||'∞' }}分钟
                    </span>
                  </el-col>

                  <el-col :span="3">
                    <pure-button
                      v-if="!node.childNodes.length"

                      type="text"
                      size="mini"
                      label="编辑"
                      @click="onEdit(data)"
                    />
                  </el-col>

                </el-row>
              </el-tree>
            </div>
          </div>
        </CollapseItem>
      </Collapse>
    </el-col>
    <el-col :span="8" :offset="4" class="h-100">
      <Collapse>
        <CollapseItem>
          <template #title>
            <span class="label">
              服务时效性评级规则
            </span>
          </template>
          <!--  -->
          <el-form :model="formData">
            <el-form-item>
              <template #label>
                <span class="rules-label">优秀:</span>
              </template>
              <span class="rules-label">
                {{ excellentUnit }}
              </span>
              <span class="rules-text">
                处理耗时最小值
              </span>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span class="rules-label">达标:</span>
              </template>
              <div class="select-box">
                <div class="select-tag">
                  <el-select v-model="formData.minTimeSymbol" @change="changeUnit">
                    <el-option v-for="item in ReachTheStandardUnitBefore" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
                <div class="select-text">
                  <span class="rules-text">
                    处理耗时最小值
                  </span>
                </div>
                <div class="select-split">
                  ~
                </div>
                <div class="select-tag">
                  <el-select v-model="formData.maxTimeSymbol" @change="changeUnit">
                    <el-option v-for="item in ReachTheStandardUnitAfter" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
                <div class="select-text">
                  <span class="rules-text">
                    处理耗时最大值
                  </span>

                </div>
              </div>

            </el-form-item>
            <el-form-item>
              <template #label>
                <span class="rules-label">不达标:</span>
              </template>
              <span class="rules-label">
                {{ notStandardUnit }}
              </span>
              <span class="rules-text">
                处理耗时最大值
              </span>
            </el-form-item>
          </el-form>
        </CollapseItem>
      </Collapse>
    </el-col>
  </el-row>
</template>

<script>
import Collapse from '@/components/collapse/index.vue';
import CollapseItem from '@/components/collapseItem/index.vue';
import { arrayToTree, } from '@/utils/common';
import ServeTimeLinessForm from './dialog/serveTimelinessForm.vue';
import dialogWidth from '@/views/project/common/width/dialog';
import OtherSettingApi from '../api';
import _ from 'lodash';
export default {
  components: {
    Collapse,
    CollapseItem,
  },
  data() {
    return {
      unit: [{
        label: '分钟',
        value: 'minute',
      }, {
        label: '小时',
        value: 'hours',
      }],
      data: [],
      // 优秀单位
      excellentUnit: '<',
      // 不达标单位
      notStandardUnit: '>',
      units: [{
        label: '<',
        value: '<',
      }, {
        label: '>',
        value: '>',
      }, {
        label: '≤',
        value: '≤',
      }, {
        label: '≥',
        value: '≥',
      }],
      formData: {
        minTimeSymbol: '≥',
        maxTimeSymbol: '≤',
      },
    };
  },
  // faultTypeList
  computed: {
    FaultTypeTreeList() {
      return arrayToTree(this.data, {
        pfield: 'parentId',
        ufield: 'id',
        sub_name: 'children',
      }, null);
    },

    // 达标前部单位
    ReachTheStandardUnitBefore() {
      return this.units.filter((item) => {
        return ['>', '≥'].includes(item.value);
      });
    },
    // 达标后部单位
    ReachTheStandardUnitAfter() {
      return this.units.filter((item) => {
        return ['<', '≤'].includes(item.value);
      });
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      this.data = await OtherSettingApi.getFaultTypeResponseTime();
      this.formData = await OtherSettingApi.getServeTimeLineessRatingRules();
      this.initUnit(this.formData.minTimeSymbol);
      this.initUnit(this.formData.maxTimeSymbol);
    },

    onEdit(data) {
      this.$dialog({
        title: '编辑',
        width: dialogWidth.mini_px,
        component: () => <ServeTimeLinessForm onDone={this.initData} data={data}/>,
      });
    },
    initUnit(val) {
      if (val === '>') {
        this.excellentUnit = '≤';
      } else if (val === '≥') {
        this.excellentUnit = '<';
      } else if (val === '<') {
        this.notStandardUnit = '≥';
      } else {
        this.notStandardUnit = '>';
      }
    },
    changeUnit: _.debounce(async function (val) {
      try {
        await OtherSettingApi.setServeTimeLinesssRatingRules(this.formData);
        this.initUnit(val);
        this.$message.success('更新成功!');
      } catch (err) {
        this.$message.error(err);
      }
    }, 500),

    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.h-100 {
  height: 100%;
}
.custom-tree-node{
  flex: 1;
  display: flex;
    align-items: center;
}
.m{
&-t{
  &-16{
    margin-top: 16px;
  }
}
}
.serveTimelinessWrapper {
  height: 566px;
}
.font {
  &-18 {
    font-size: 18px;
  }
}
.select{
  &-box{
    display: flex;

  }
  &-tag{
    width:80px ;
  }
  &-text{
    text-align: center;
    flex: 1;
  }
  &-split{
    flex-basis: auto;
    padding: 0 8px;
  }
}

.label {
  font-weight: 500;
  font-size: 18px;
  color: #334266;
  letter-spacing: 0;
}
.panel {
  display: flex;
  flex-direction: column;
  .title {
    padding: 0px 0;
    font-weight: 500;
    font-size: 18px;
    color: #334266;
    letter-spacing: 0;
    box-shadow: inset 0px -1px 0px #e6eaf2;
    display: flex;
    justify-content: space-between;
  }
  .treeBox {
    flex: 1;
    overflow: auto;
  }
}
.rules{
   &-label{
font-weight: 500;
font-size: 18px;
color: #334266;
letter-spacing: 0;
   }
   &-text{
font-weight: 400;
font-size: 18px;
color: #7D8DB3;
letter-spacing: 0;
   }
}
</style>
