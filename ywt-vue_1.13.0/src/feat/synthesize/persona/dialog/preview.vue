<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-10 15:08:17
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 13:56:55
 * @Description:人员画像预览弹窗
-->
<template>
  <el-row class="h-100 preview" :gutter="20" type="flex">
    <el-col
      :span="8"
      class="h-100 flex space-between"
      style="flex-direction: column;"
    >

      <el-skeleton :loading="loading" animated>
        <template slot="template" />
        <template>
          <div>
            <div class="card base-info">
              <el-row>
                <span class="title">基本信息</span>
              </el-row>
              <div class="content">
                <el-row>
                  <el-col :span="12">
                    <span class="label">姓名</span>
                    <span class="value">{{ previewData.name }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span class="label">性别</span>
                    <span class="value">{{ previewData.genderToName }}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span class="label">年龄</span>
                    <span class="value">{{ previewData.age }}岁</span>
                  </el-col>
                  <el-col :span="12">
                    <span class="label">籍贯</span>
                    <span class="value">{{ previewData.nativePlace }}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span class="label">学历</span>
                    <span class="value">{{ previewData.educationToName }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span class="label">科室</span>
                    <span class="value">{{ previewData.deptToName }}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span class="label">电话</span>
                    <span class="value">{{ previewData.phone }}</span>
                  </el-col>

                </el-row>
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>

      <el-skeleton :loading="loading" animated>
        <template slot="template" />
        <template>
          <div>
            <div class="card qualification-info">
              <el-row>
                <span class="title">学历信息</span>
              </el-row>
              <ul class="content">
                <li v-for="(item,index) in previewData.personnelEducations" :key="index" class="base-margin-bottom">
                  <el-row :gutter="1">
                    <el-col :span="1">
                      <i class="el-icon-caret-right" />
                    </el-col>
                    <el-col :span="7">
                      {{ item.startDate }}-{{ item.endDate }}
                    </el-col>
                    <el-col :span="6">
                      {{ item.school }}
                    </el-col>
                    <el-col :span="5">
                      {{ item.major }}
                    </el-col>
                    <el-col :span="4">
                      {{ item.educationToName }}
                    </el-col>
                  </el-row>

                </li>
              </ul>
            </div>
          </div>

        </template>
      </el-skeleton>

      <el-skeleton :loading="loading" animated>
        <template slot="template" />
        <template>
          <div>
            <div class="card skill-info">
              <el-row>
                <span class="title">技能分布</span>
              </el-row>
              <ul class="content">
                <li v-for="(item, index) in previewData.specialties" :key="index" class="base-margin-bottom">
                  <el-row :gutter="1">
                    <el-col :span="1">
                      <i class="el-icon-caret-right" />
                    </el-col>
                    <el-col :span="23">
                      {{ item }}
                    </el-col>
                  </el-row>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </el-skeleton>

      <el-skeleton :loading="loading" animated>
        <template slot="template" />
        <template>
          <div>
            <div class="card work-experience-info">
              <el-row>
                <span class="title">工作履历</span>
              </el-row>
              <ul class="content">
                <li v-for="(item,index) in previewData.experiences" :key="index" class="base-margin-bottom">
                  <el-row :gutter="1">
                    <el-col :span="1">
                      <i class="el-icon-caret-right" />
                    </el-col>
                    <el-col :span="7">
                      {{ item.startDate }}-{{ item.endDate }}
                    </el-col>
                    <el-col :span="11">
                      {{ item.companyName }}
                    </el-col>
                    <el-col :span="4">
                      {{ item.station }}
                    </el-col>
                  </el-row>

                </li>
              </ul>
            </div>
          </div>
        </template>
      </el-skeleton>

    </el-col>
    <el-col :span="8">

      <el-skeleton :loading="loading" animated>
        <template slot="template" />
        <template>
          <div>
            <div class="card profile">
              <el-row type="flex" justify="space-between">
                <el-col :span="8">
                  <img :src="$store.state.login.uriConfig.fileBaseUri+previewData.photoAddr">
                  <el-rate
                    v-model="previewData.stars"
                    disabled
                    text-color="#ff9900"
                  />
                </el-col>
                <el-col :span="15">
                  <div class="name">{{ previewData.name }} <i :class="gender" /></div>
                  <div class="item"><span>人员分期</span> {{ previewData.staging }}</div>
                  <div class="item"><span>科室</span> {{ previewData.deptToName }}</div>
                  <div class="item"><span>职位</span> {{ previewData.position }}</div>
                  <div class="item"><span>工作年限</span> {{ previewData.workYear }}</div>
                  <div class="item"><span>运维小组</span> {{ previewData.teamToName }}</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
      </el-skeleton>

    </el-col>
    <el-col
      :span="8"
      class="h-100 flex space-between"
      style="flex-direction: column;"
    >

      <el-skeleton :loading="loading" animated>
        <template slot="template" />
        <template>
          <div>
            <div class="card growth-info">
              <el-row>
                <span class="title">成长计划</span>
              </el-row>
              <ul class="content">
                <li v-for="(item, index) in previewData.planContents" :key="index" class="base-margin-bottom">
                  <el-row :gutter="1">
                    <el-col :span="1">
                      <i class="el-icon-caret-right" />
                    </el-col>
                    <el-col :span="23">
                      {{ item }}
                    </el-col>
                  </el-row>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </el-skeleton>

      <el-skeleton :loading="loading" animated>
        <template slot="template" />
        <template>
          <div>
            <div class=" card research-project-info">
              <el-row>
                <span class="title">科研课题及论文发表情况</span>
              </el-row>
              <ul class="content">
                <li v-for="(item,index) in previewData.topics" :key="index" class="base-margin-bottom">
                  <el-row :gutter="1">
                    <el-col :span="1">
                      <i class="el-icon-caret-right" />
                    </el-col>
                    <el-col :span="4">
                      {{ item.year }}年
                    </el-col>
                    <el-col :span="19">
                      {{ item.title }}
                    </el-col>
                  </el-row>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </el-skeleton>

      <el-skeleton :loading="loading" animated :rows="10">
        <template slot="template" />
        <template>
          <div>
            <div class="card work-analytical">
              <el-row>
                <span class="title">工作分析</span>
              </el-row>
              <div class="content">
                <div>故障工单</div>
                <el-row>
                  <el-col :span="5"><div style="min-height: 1px;" /></el-col>
                  <el-col :span="9">
                    <div id="ticket" style="width: 100%;height:160px" />
                  </el-col>
                  <el-col :span="10">
                    <div class="item"><span>接单率</span>{{ previewData.backRate }}%</div>
                    <div class="item"><span>协作率</span>{{ previewData.cooperationRate }}%</div>
                    <div class="item"><span>按时完成率</span>{{ previewData.completeRate }}%</div>
                  </el-col>
                </el-row>
                <div>项目</div>
                <el-row>
                  <el-col :span="5"><div style="min-height: 1px;" /></el-col>
                  <el-col :span="9">
                    <div id="project" style="width: 160px;height:160px" />
                  </el-col>
                  <el-col :span="10">
                    <div class="item"><span>按时完成率</span>{{ previewData.itemCompleteRete }}%</div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>

    </el-col>
  </el-row>
</template>

<script>
import PersonaApi from '../api.js';
import * as echarts from 'echarts';
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      baseInfo: {
        name: null,
        genderToName: null,
        age: null,
        nativePlace: null,
        educationToName: null,
        deptToName: null,
        phone: null,
      },
      previewData: {},
      ticketChart: null,
      projectChart: null,
      loading: true,
    };
  },
  computed: {
    researchInfo() {
      let data = [];
      data = [...this.previewData];
      return data;
    },
    gender() {
      switch (this.previewData.gender) {
        // 男
        case '1':
          return 'el-icon-male';
          // 女
        case '2':
          return 'el-icon-female';
        default:
          return 'el-icon-male';
      }
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {

  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const data = await PersonaApi.preview(this.id);
        this.loading = false;
        this.$nextTick(() => {
          const ticketChartDom = document.getElementById('ticket');
          const projectChartDom = document.getElementById('project');
          this.projectChart = echarts.init(projectChartDom);
          this.ticketChart = echarts.init(ticketChartDom);

          this.previewData = Object.assign({}, this.previewData, data);
          this.setChartOption(this.ticketChart, this.previewData.orderTypes);
          this.setChartOption(this.projectChart, this.previewData.itemTypes);
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async setChartOption(chart, data) {
      const option = {
        color: ['#1890FF', '#FA8C16', '#3FC1E7', '#EB2F96', '#FADB14', '#52C41A', '#985EE9', '#FA541C', '#48D3A0', '#DD3A43'],
        tooltip: { show: true, },
        series: {
          type: 'sunburst',
          data: data,
          radius: [0, '90%'],
          levels: [
            {},
            {
              itemStyle: {
                opacity: 1,
              },
            }, {
              itemStyle: {
                opacity: 0.75,
              },
            },
            {
              itemStyle: {
                opacity: 0.45,
              },
            },
            {
              itemStyle: {
                opacity: 0.25,
              },
            }
          ],
          label: {
            rotate: 'radial',
            show: false,
          },
        },
      };
      chart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
  margin-left: 0;
  i {
    opacity: 0.75;
    color: #1890ff;
  }
}
.preview {
  &::v-deep .el-skeleton.is-animated .el-skeleton__item {
    background: linear-gradient(90deg, #172231 25%, #0D1724 37%, #172231 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
}
  .card {
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    border:10px solid transparent;
    border-image:url('~@/assets/personaCardBorder.png') 10 10 stretch;
    color: white;

  }
  .base-info,
  .qualification-info,
  .skill-info,
  .work-experience-info,
  .profile,
  .growth-info,
  .research-project-info,
  .work-analytical
  {
    height: 195px;
    width: 575px;
    .title {
      display: inline-block;
      background-color: #e8e8e8;
      padding: 7px 14px;
      opacity: 0.55;
      background: #ffffff;
      color: #000000;
      margin-bottom: 10px;
    }
    .content {
      padding: 3px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-y: scroll;
      &::-webkit-scrollbar{
        width:2px;
        height:50%;
      }
      &::-webkit-scrollbar-thumb{
        background-color: #DEE2EE;
        border-radius: 1px;
      }
    }
    .label {
      margin-right: 12px;
      color: #e6f3ff;
      opacity: 0.45;
      font-size: 18px;
    }
    .value {
      color: #ffffff;
    }
  }
  .profile {
    margin: auto;
  }
  .profile,.work-analytical{
    width: 416px;
    height: 216px;

    img {
      width: 128px;
      height: 170px;
    }
    .name {
      margin-bottom: 16px;
      font-size: 24px;
    }
    .item {
      font-size: 18px;
      color: #ffffff;
      margin-bottom: 16px;
      span {
        display: inline-block;
        width: 83px;
        color: #e6f3ff;
        opacity: 0.45;
      }
    }
  }
  .growth-info {
    width: 575px;
    height: 127px;
  }
  .research-project-info {
    height: 161px;
  }
  .work-analytical{
    height: 526px;
    width:575px;
    .item {
      span {
        width: 105px;
      }
    }
  }
  .qualification-info {
    .content {
      justify-content: unset;

    }
  }
.el-icon-male {
  color: #1890ff;
}
.el-icon-female {
  color: #f279d8;
}
}
.el-rate {
  ::v-deep .el-rate__icon {
    margin-right: 4px;
  }
}

.el-skelenton {
  .el-skeleton.is-animated .el-skeleton__item {
    background: linear-gradient(90deg, #c04444 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
}
}
</style>
<style lang="scss">
.persona-preview-dialog {
  background: url('~@/assets/personaBg.png');
  background-size: contain;

  .el-dialog__header {
    padding: 0px !important;
  }
  .el-dialog__body {
    overflow: hidden !important;
    max-height: 100% !important;
  }
  .el-dialog__headerbtn {
    z-index: 9999;
  }
}

</style>
