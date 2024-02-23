<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 17:49:43
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-18 10:49:44
 * @FilePath: \big-screenc:\Users\cunzhe\Desktop\全院\ywt-vue-qp\src\views\project\impose\components\generateReport\projectOverview.vue
 * @Description:项目概况
-->
<template>
  <div>
    <div v-if="isTrueData" class="overview-container">
      <div class="warp-one box">
        <div class="title">
          <svg-icon icon-class="user" class="mrg-right" /><span>人员</span>
        </div>
        <div class="info">
          <div class="text">
            本项目责任人：<span class="bold">{{ users.principal }}</span>
          </div>
          <div class="text">
            本项目参与人：<span class="bold">{{ users.joinUser }}</span>
          </div>
        </div>
      </div>
      <div class="warp-three">
        <div class="timeLimit box w-25">
          <div class="title">
            <svg-icon icon-class="timeLimit" class="mrg-right" /><span>工期</span>
          </div>
          <div class="info">
            <div class="text">总工期：<span class="bold">{{ period.total }} 天</span></div>
            <div class="text">
              需求管理耗时：<span class="bold">{{ period.demandTime }} 天</span>
            </div>
            <div class="text">
              项目立项耗时：<span class="bold">{{ period.establishTime }} 天</span>
            </div>
            <div class="text">
              项目实施耗时：<span class="bold">{{ period.implementTime }} 天</span>
            </div>
          </div>
        </div>
        <div class="done w-50 box">
          <div class="title">
            <svg-icon icon-class="done" class="mrg-right" /><span>项目任务完成情况</span>
          </div>
          <div class="info">
            <div class="text">
              项目任务总数：<span class="bold">{{ itemCompletion.total }} 个</span>
            </div>
            <div class="text">
              按时完成任务：<span class="bold">{{ itemCompletion.finishOnTime }}个</span>，占任务总数：<span class="bold">{{ itemCompletion.finishOnTimeRate }} %</span>
            </div>
            <div class="text">
              超时完成任务：<span class="bold">{{ itemCompletion.finishOverTime }}个</span>，占任务总数：<span class="bold">{{ itemCompletion.finishOverTimeRate }} %</span>
            </div>
          </div>
        </div>
        <div class="temporary w-25 box">
          <div class="title">
            <svg-icon icon-class="temporary" class="mrg-right" /><span>临时任务完成情况</span>
          </div>
          <div class="info">
            <div class="text">
              项目共产生任务：<span class="bold">{{ temporaryTask.total }} 个</span>
            </div>
            <div class="text">
              按时完成任务：<span class="bold">{{ temporaryTask.finishOnTime }} 个</span>
            </div>
            <div class="text">
              超时完成任务：<span class="bold">{{ temporaryTask.finishOverTime }} 个</span>
            </div>
            <div class="text">
              未完成任务：<span class="bold">{{ temporaryTask.unfinished }} 个</span>
            </div>
          </div>
        </div>
      </div>
      <div class="warp-three">
        <div class="inspection box w-25">
          <div class="title">
            <svg-icon icon-class="inspection" class="mrg-right" /><span>巡检情况</span>
          </div>
          <div class="info">
            <div class="text">
              项目共计巡检：<span class="bold">{{ patrolRepair.total }} 次</span>
            </div>
            <div class="text">
              已巡检：<span class="bold">{{ patrolRepair.finish }} 次</span>
            </div>
            <div class="text">
              未巡检：<span class="bold">{{ patrolRepair.unfinished }} 次</span>
            </div>
            <div class="text">
              超时未巡检：<span class="bold">{{ patrolRepair.finishOverTime }} 次</span>
            </div>
          </div>
        </div>
        <div class="fault w-50 box">
          <div class="title">
            <svg-icon icon-class="fault" class="mrg-right" /><span>故障报修情况</span>
          </div>
          <div class="info">
            <div class="text">
              项目过程中共计报修：{{ faultRepair.total }}例
            </div>
            <div class="text">
              已完成：<span class="bold">{{ faultRepair.totalFinish }} 例（其中按时完成
                {{ faultRepair.finishOnTime }} 例，超时完成
                {{ faultRepair.finishOverTime }} 例）</span>
            </div>
            <div class="text">
              未完成：<span class="bold">{{ faultRepair.unfinished }} 例（其中超时未完成
                {{ faultRepair.unfinishedOverTime }} 例）</span>
            </div>
            <div class="text">
              平均响应时长：<span class="bold">{{
                faultRepair.avgResponseDuration
              }} 分</span>；平均处理时长：<span class="bold">{{ faultRepair.avgHandleDuration }} 分</span>
            </div>
            <div class="text">
              临床满意度：非常满意 <span class="bold">{{ faultRepair.verySatisfied || 0 }} %</span>、
              满意 <span class="bold">{{ faultRepair.satisfied || 0 }} %</span>、
              一般 <span class="bold">{{ faultRepair.commonly || 0 }} %</span>、
              不满意 <span class="bold">{{ faultRepair.dissatisfied || 0 }} %</span>、
              非常不满意 <span class="bold">{{ faultRepair.veryDissatisfied || 0 }} %</span>
            </div>
          </div>
        </div>
        <div class="peoples w-25 box">
          <div class="title">
            <svg-icon icon-class="peoples" class="mrg-right" /><span>会议情况</span>
          </div>
          <div class="info">
            <div class="text">项目共发起会议：<span class="bold">{{ meeting.total }} 次</span></div>
            <div class="text">产生任务：<span class="bold">{{ meeting.produceTask }} 个</span></div>
            <div class="text">按时完成任务：<span class="bold">{{ meeting.finishOnTime }} 个</span></div>
            <div class="text">超时完成任务：<span class="bold">{{ meeting.finishOverTime }} 个</span></div>
            <div class="text">未完成任务：<span class="bold">{{ meeting.unfinished }} 个</span></div>
          </div>
        </div>
      </div>
      <div class="warp-unknown">
        <div class="paper box">
          <div class="title">
            <svg-icon icon-class="paper" class="mrg-right svg" /><span>合同/发票情况</span>
          </div>
          <div class="info-box">
            <div v-for="(item,idx) in contractInvoice" :key="idx" class="info contract">
              <div style="width: calc(100% - 20px);" :style="{'padding-left':idx % 2 !== 0 ? '20px' : ''}">
                <div class="text bold">合同{{ idx + 1 }}</div>
                <div class="text">合同名称：<span class="bold">{{ item.name }}</span></div>
                <div class="text">甲方：<span class="bold">{{ item.companya }}</span>，联系人：<span class="bold">{{ item.companyaPerson }} {{ item.companyaPhone }}</span></div>
                <div class="text">乙方：<span class="bold">{{ item.companyb }}</span>，联系人：<span class="bold">{{ item.companybPerson }} {{ item.companybPhone }}</span></div>
                <div class="text">丙方：<span class="bold">{{ item.companyc }}</span>，联系人：<span class="bold">{{ item.companycPerson }} {{ item.companycPhone }}</span></div>
                <div class="text">合同金额：<span class="bold">{{ item.contractPrice }}</span> 元</div>
                <div class="text">质保期：<span class="bold">{{ item.qaDate }} </span>，质保截止时间：<span class="bold">{{ item.qaEndDate }}</span>；有偿保费：<span class="bold">{{ item.qaMoney }} 元/年</span></div>
                <div class="bottom-line" />
              </div>
              <div v-if="idx % 2 === 0" class="right-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else class="not-data" description="暂无数据" />
  </div>
</template>

<script>
export default {
  props: {
    componentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      users: {
        principal: '--',
        joinUser: '--',
      },
      period: {
        total: '--',
        demandTime: '--',
        establishTime: '--',
        implementTime: '--',
      },
      itemCompletion: {
        total: '--',
        finishOnTime: '--',
        finishOnTimeRate: '--',
        finishOverTime: '--',
        finishOverTimeRate: '--',
      },
      temporaryTask: {
        total: '--',
        finishOnTime: '--',
        finishOverTime: '--',
        unfinished: '--',
      },
      patrolRepair: {
        total: '--',
        finish: '--',
        unfinished: '--',
        finishOverTime: '--',
      },
      faultRepair: {
        total: '--',
        totalFinish: '--',
        finishOnTime: '--',
        finishOverTime: '--',
        unfinished: '--',
        unfinishedOverTime: '--',
        avgResponseDuration: '--',
        avgHandleDuration: '--',
        verySatisfied: '--',
        satisfied: '--',
        commonly: '--',
        dissatisfied: '--',
        veryDissatisfied: '--',
      },
      meeting: {
        total: '--',
        produceTask: '--',
        finishOnTime: '--',
        finishOverTime: '--',
        unfinished: '--',
      },
      contractInvoice: [
        {
          name: '--',
          companya: '--',
          companyaPerson: '--',
          companyaPhone: '--',
          companyb: '--',
          companybPerson: '--',
          companybPhone: '--',
          companyc: '--',
          companycPerson: '--',
          companycPhone: '--',
          contractPrice: '--',
          qaDate: '--',
          qaEndDate: '--',
          qaMoney: '--',
        }
      ],
    };
  },
  computed: {
    isTrueData() {
      const type = JSON.stringify(this.componentData);
      if (type === '{}' || type === '[]') {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    componentData: {
      handler(newVal, oldVal) {
        for (const key in newVal) {
          if (Array.isArray(this[key])) {
            this[key] = newVal[key] || [];
          } else {
            this[key] = newVal[key] || {};
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  opacity: 0.75;
  border-radius: 8px;
  padding: 16px 26px;
  margin-bottom: 16px;
}
.warp-one {
  background: #fff1f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}
.warp-three {
  display: flex;
  justify-content: space-between;
  .timeLimit {
    background: #fff2e8;
    border: 1px solid #ffd8bf;
    color: #ff7a45;
  }
  .done {
    background: #fff7e6;
    border: 1px solid #ffe7ba;
    color: #ffa940;
  }
  .temporary {
    background: #effae3;
    border: 1px solid #d0f2b1;
    color: #73d13d;
  }
  .inspection {
    background: #e1faf6;
    border: 1px solid #adebe2;
    color: #35c9c4;
  }
  .fault {
    background: #e6f7ff;
    border: 1px solid #bae7ff;
    color: #40a9ff;
  }
  .peoples {
    background: #f9f0ff;
    border: 1px solid #efdbff;
    color: #9254de;
  }
}
.warp-unknown {
  background: #fff0f6;
  border: 1px solid #ffd6e7;
  color: #f759ab;
  .paper {
    display: flex;
    flex-direction: column;
    .info-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .contract {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 50%;
      }
    }
  }
}
.w-25 {
  width: calc(25% - 10px);
}
.w-50 {
  width: calc(50% - 10px);
}
.title {
  font-weight: Bold;
  font-size: 24px;
}
.mrg-right {
  margin-right: 10px;
  width: 24px;
  height: 24px;
}
.svg {
  fill: currentColor;
  color: #ff4d4f;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .text {
    margin-top: 10px;
    font-weight: 400;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.65);
  }
  .bold {
    font-weight: 600;
    color: #000000;
  }
}
.bottom-line{
  height: 1px;
  width: 100%;
  margin-top: 10px;
  background: #dcdfe6;;
}
.right-line{
  height: calc(100% - 20px);
  width: 1px;
  background: #dcdfe6;;
}
</style>
