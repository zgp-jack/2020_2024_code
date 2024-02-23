<!--  -->
<template>
  <el-container>
    <el-header v-show="showHeader" height="180px">
      <div v-loading="loading" class="wrapper">
        <div :span="10" class="wrapper-left flex flex-column">
          <div
            class="wrapper-header"
            :class="activePanelName | activeHeaderClass('demand')"
          >
            <HeaderButton @click="onJumpBoardDemand">
              <b> 需求管理 </b>
            </HeaderButton>
          </div>
          <div class="wrapper-left-main flex flex-row flex-1">
            <div class="wrapper-left-main-container flex">
              <div
                class=" flex  flex-column  flex-justify-center wrapper-left-main-container-group-column"
              >
                <div class="border P-3 M-L-9">
                  <p>
                    <ProcessButton
                      :active="
                        ProcessConfigMap['orderUpgrade'].code === _activeCode
                      "
                      :badge-value="ProcessConfigMap['orderUpgrade'].num"
                      :disabled="ProcessConfigMap['orderUpgrade'].disabled"
                      @click="clickButton(ProcessConfigMap['orderUpgrade'].code)"
                    >
                      {{ ProcessConfigMap["orderUpgrade"].text }}
                    </ProcessButton>
                  </p>
                  <p>
                    <ProcessButton
                      :active="ProcessConfigMap['oaSystem'].code === _activeCode"
                      :badge-value="ProcessConfigMap['oaSystem'].num"
                      :disabled="ProcessConfigMap['oaSystem'].disabled"
                      @click="clickButton(ProcessConfigMap['oaSystem'].code)"
                    >
                      {{ ProcessConfigMap["oaSystem"].text }}
                    </ProcessButton>
                  </p>

                  <p>
                    <ProcessButton
                      :active="ProcessConfigMap['newMake'].code === _activeCode"
                      :badge-value="ProcessConfigMap['newMake'].num"
                      :disabled="ProcessConfigMap['newMake'].disabled"
                      @click="clickButton(ProcessConfigMap['newMake'].code)"
                    >
                      {{ ProcessConfigMap["newMake"].text }}
                    </ProcessButton>
                  </p>
                </div>
              </div>
              <div class="M-0-5 flex flex-align-center">
                <img
                  class="icon-1"
                  src="../../../../assets/project/demand/arrow1.png"
                >
              </div>
              <div class="flex flex-align-center">
                <ProcessButton
                  :active="ProcessConfigMap['demand'].code === _activeCode"
                  :badge-value="ProcessConfigMap['demand'].num"
                  :disabled="ProcessConfigMap['demand'].disabled"
                  @click="clickButton(ProcessConfigMap['demand'].code)"
                >
                  {{ ProcessConfigMap["demand"].text }}
                </ProcessButton>
              </div>
              <div class="  M-0-5 ">
                <img src="../../../../assets/project/demand/arrow2.png" class="icon-2  M-T-67">
              </div>
              <div
                class="flex-column flex  M-T-58 wrapper-left-main-container-group-small"
              >
                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['assigned'].code === _activeCode"
                    :badge-value="ProcessConfigMap['assigned'].num"
                    :disabled="ProcessConfigMap['assigned'].disabled"
                    @click="clickButton(ProcessConfigMap['assigned'].code)"
                  >
                    {{ ProcessConfigMap["assigned"].text }}
                  </ProcessButton>
                </p>
                <p>
                  <img
                    class="rotate-right-90 icon-1"
                    src="../../../../assets/project/demand/arrow1.png"
                  >
                </p>
                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['beAllocated'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['beAllocated'].num"
                    :disabled="ProcessConfigMap['beAllocated'].disabled"
                    @click="clickButton(ProcessConfigMap['beAllocated'].code)"
                  >
                    {{ ProcessConfigMap["beAllocated"].text }}
                  </ProcessButton>
                </p>
              </div>
              <div class="M-0-5 flex flex-align-center ">
                <img src="../../../../assets/project/demand/arrow1.png" class="icon-1">
              </div>
              <div
                class="flex-column flex  M-T-12 flex-justify-strat wrapper-left-main-container-group-small"
              >
                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['continueInv'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['continueInv'].num"
                    :disabled="ProcessConfigMap['continueInv'].disabled"
                    @click="clickButton(ProcessConfigMap['continueInv'].code)"
                  >
                    {{ ProcessConfigMap["continueInv"].text }}
                  </ProcessButton>
                </p>
                <p>
                  <img
                    class="rotate-left-90 icon-1"
                    src="../../../../assets/project/demand/arrow1.png"
                  >
                </p>
                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['investigate'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['investigate'].num"
                    :disabled="ProcessConfigMap['investigate'].disabled"
                    @click="clickButton(ProcessConfigMap['investigate'].code)"
                  >
                    {{ ProcessConfigMap["investigate"].text }}
                  </ProcessButton>
                </p>
              </div>
              <div class="position-relative flex">
                <div class="position-absolute top-6 left-10">
                  <img src="../../../../assets/project/demand/arrow6.png" class="icon-8">
                </div>

                <div class="M-0-5 ">
                  <img src="../../../../assets/project/demand/arrow2.png" class="icon-2 M-T-67">
                </div>
                <div
                  class="flex-column flex  M-T-58 wrapper-left-main-container-group-small"
                >
                  <p>
                    <ProcessButton
                      :active="ProcessConfigMap['waitInv'].code === _activeCode"
                      :badge-value="ProcessConfigMap['waitInv'].num"
                      :disabled="ProcessConfigMap['waitInv'].disabled"
                      @click="clickButton(ProcessConfigMap['waitInv'].code)"
                    >
                      {{ ProcessConfigMap["waitInv"].text }}
                    </ProcessButton>

                  </p>
                  <p>
                    <img
                      class="rotate-left-90 icon-1"
                      src="../../../../assets/project/demand/arrow1.png"
                    >
                  </p>
                  <p>
                    <ProcessButton
                      :active="ProcessConfigMap['waitGrading'].code === _activeCode"
                      :badge-value="ProcessConfigMap['waitGrading'].num"
                      :disabled="ProcessConfigMap['waitGrading'].disabled"
                      @click="clickButton(ProcessConfigMap['waitGrading'].code)"
                    >
                      {{ ProcessConfigMap["waitGrading"].text }}
                    </ProcessButton>
                  </p>
                </div>
                <div class="M-0-5 flex flex-align-end M-B-20">
                  <img src="../../../../assets/project/demand/arrow1.png" class="icon-1">
                </div>

                <div
                  class="  flex-column flex flex-justify-center wrapper-left-main-container-group-small "
                >
                  <p>
                    <ProcessButton
                      :active="ProcessConfigMap['demandAssess'].code === _activeCode"
                      :badge-value="ProcessConfigMap['demandAssess'].num"
                      :disabled="ProcessConfigMap['demandAssess'].disabled"
                      @click="clickButton(ProcessConfigMap['demandAssess'].code)"
                    >
                      {{ ProcessConfigMap["demandAssess"].text }}
                    </ProcessButton>
                  </p>
                  <p>
                    <img
                      class="rotate-right-90 icon-1"
                      src="../../../../assets/project/demand/arrow1.png"
                    >
                  </p>
                  <p>
                    <ProcessButton
                      :active="
                        ProcessConfigMap['technicalAnalysis'].code === _activeCode
                      "
                      :badge-value="ProcessConfigMap['technicalAnalysis'].num"
                      :disabled="ProcessConfigMap['technicalAnalysis'].disabled"
                      @click="clickButton(ProcessConfigMap['technicalAnalysis'].code)"
                    >
                      {{ ProcessConfigMap["technicalAnalysis"].text }}
                    </ProcessButton>
                  </p>
                  <p>
                    <img
                      class="rotate-right-90 icon-1"
                      src="../../../../assets/project/demand/arrow1.png"
                    >
                  </p>
                  <p>
                    <ProcessButton
                      :active="ProcessConfigMap['demandAnalysis'].code === _activeCode"
                      :badge-value="ProcessConfigMap['demandAnalysis'].num"
                      :disabled="ProcessConfigMap['demandAnalysis'].disabled"
                      @click="clickButton(ProcessConfigMap['demandAnalysis'].code)"
                    >
                      {{ ProcessConfigMap["demandAnalysis"].text }}
                    </ProcessButton>
                  </p>
                </div>
                <div class="M-0-5 M-T-23">
                  <img
                    class="icon-9"
                    src="../../../../assets/project/demand/arrow5.png"
                  >
                </div>
                <div class="flex flex-align-center">
                  <ProcessButton
                    :active="ProcessConfigMap['reviewInv'].code === _activeCode"
                    :badge-value="ProcessConfigMap['reviewInv'].num"
                    :disabled="ProcessConfigMap['reviewInv'].disabled"
                    @click="clickButton(ProcessConfigMap['reviewInv'].code)"
                  >
                    {{ ProcessConfigMap["reviewInv"].text }}
                  </ProcessButton>
                </div>
              </div>
              <div class="M-0-5 flex flex-align-center">
                <img
                  class="icon-4"
                  src="../../../../assets/project/demand/arrow4.png"
                >
              </div>
              <div
                class="P-5 flex-column flex wrapper-left-main-container-group-default flex-justify-center M-R-15"
              >
                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['rejectInv'].code === _activeCode"
                    :badge-value="ProcessConfigMap['rejectInv'].num"
                    :disabled="ProcessConfigMap['rejectInv'].disabled"
                    @click="clickButton(ProcessConfigMap['rejectInv'].code)"
                  >
                    {{ ProcessConfigMap["rejectInv"].text }}
                  </ProcessButton>
                </p>
                <p>

                  <ProcessButton
                    :active="
                      ProcessConfigMap['conversion'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['conversion'].num"
                    :disabled="ProcessConfigMap['conversion'].disabled"
                    @click="clickButton(ProcessConfigMap['conversion'].code)"
                  >
                    {{ ProcessConfigMap["conversion"].text }}
                  </ProcessButton>
                </p>
                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['demandStand'].code === _activeCode"
                    :badge-value="ProcessConfigMap['demandStand'].num"
                    :disabled="ProcessConfigMap['demandStand'].disabled"
                    @click="clickButton(ProcessConfigMap['demandStand'].code)"
                  >
                    {{ ProcessConfigMap["demandStand"].text }}
                  </ProcessButton>
                </p>
              </div>
            </div>
            <div class="position-absolute bottom-10  zIndex-99 right-7-minus">
              <img src="../../../../assets/project/demand/arrow1.png" class="icon-1">
            </div>
          </div>
        </div>

        <div class="wrapper-center flex flex-column" :span="8">
          <div
            class="wrapper-header"
            :class="activePanelName | activeHeaderClass('stand')"
          >
            <HeaderButton @click="onJumpBoardProject">
              <b> 项目立项 </b>
            </HeaderButton>
          </div>

          <div class="wrapper-center-main flex flex-row flex-1">
            <div class="wrapper-center-main-container flex">
              <div class="position-relative">
                <div class="position-absolute top-23 left-43">
                  <img
                    class="icon-5"
                    src="../../../../assets/project/approval/approval4.png"
                  >
                </div>
              </div>
              <div class="flex-column flex  M-T-58 wrapper-left-main-container-group-small M-L-15">
                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['program'].code === _activeCode"
                    :badge-value="ProcessConfigMap['program'].num"
                    :disabled="ProcessConfigMap['program'].disabled"
                    @click="clickButton(ProcessConfigMap['program'].code)"
                  >
                    {{ ProcessConfigMap["program"].text }}
                  </ProcessButton>
                </p>
                <p>
                  <img
                    class="rotate-right-90 icon-1"
                    src="../../../../assets/project/demand/arrow1.png"
                  >
                </p>
                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['stand'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['stand'].num"
                    :disabled="ProcessConfigMap['stand'].disabled"
                    @click="clickButton(ProcessConfigMap['stand'].code)"
                  >
                    {{ ProcessConfigMap["stand"].text }}
                  </ProcessButton>
                </p>

              </div>
              <div class="M-0-5 flex   flex-align-end">
                <img src="../../../../assets/project/demand/arrow2.png" class="icon-2 M-B-20">
              </div>
              <div
                class="flex-column flex  M-T-58 wrapper-left-main-container-group-small"
              >
                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['submitted'].code === _activeCode"
                    :badge-value="ProcessConfigMap['submitted'].num"
                    :disabled="ProcessConfigMap['submitted'].disabled"
                    @click="clickButton(ProcessConfigMap['submitted'].code)"
                  >
                    {{ ProcessConfigMap["submitted"].text }}
                  </ProcessButton>
                </p>
                <p>
                  <img
                    class="rotate-right-90 icon-1"
                    src="../../../../assets/project/demand/arrow1.png"
                  >
                </p>
                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['waitSubmit'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['waitSubmit'].num"
                    :disabled="ProcessConfigMap['waitSubmit'].disabled"
                    @click="clickButton(ProcessConfigMap['waitSubmit'].code)"
                  >
                    {{ ProcessConfigMap["waitSubmit"].text }}
                  </ProcessButton>
                </p>
              </div>
              <div class="M-0-5 flex flex-align-center">
                <img src="../../../../assets/project/demand/arrow1.png" class="icon-1">
              </div>
              <div class="flex flex-align-center">
                <ProcessButton
                  :active="
                    ProcessConfigMap['programReview'].code === _activeCode
                  "
                  :badge-value="ProcessConfigMap['programReview'].num"
                  :disabled="ProcessConfigMap['programReview'].disabled"
                  @click="clickButton(ProcessConfigMap['programReview'].code)"
                >
                  {{ ProcessConfigMap["programReview"].text }}
                </ProcessButton>
              </div>
              <div class="M-0-5 flex flex-align-center P-bottom-28">
                <img class="icon-6" src="../../../../assets/project/approval/approval3.png">
              </div>
              <div
                class="flex-column flex flex-justify-start wrapper-center-main-container-group-small M-T-12 M-R-15"
              >
                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['notPass'].code === _activeCode"
                    :badge-value="ProcessConfigMap['notPass'].num"
                    :disabled="ProcessConfigMap['notPass'].disabled"
                    @click="clickButton(ProcessConfigMap['notPass'].code)"
                  >
                    {{ ProcessConfigMap["notPass"].text }}
                  </ProcessButton>
                </p>

                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['pass'].code === _activeCode"
                    :badge-value="ProcessConfigMap['pass'].num"
                    :disabled="ProcessConfigMap['pass'].disabled"
                    @click="clickButton(ProcessConfigMap['pass'].code)"
                  >
                    {{ ProcessConfigMap["pass"].text }}
                  </ProcessButton>
                </p>
              </div>
            </div>
            <div class="position-absolute top-55-per zIndex-99 right-7-minus">
              <img src="../../../../assets/project/demand/arrow1.png" class="icon-1">
            </div>
          </div>
        </div>
        <div class="wrapper-right flex flex-column" :span="8">
          <div
            class="wrapper-header"
            :class="activePanelName | activeHeaderClass('impose')"
          >
            <b>项目实施</b>
          </div>
          <div class="wrapper-right-main flex flex-row flex-1 M-L-15">
            <div class="wrapper-right-main-container flex">
              <!-- ---- -->
              <div class="position-relative">
                <div class="position-absolute  bottom-20 left-35 w-293">
                  <img
                    class="icon-7"
                    src="../../../../assets/project/approval/approval7.png"
                  >
                </div>
              </div>
              <div class="flex flex-align-center">
                <ProcessButton
                  :active="ProcessConfigMap['implStart'].code === _activeCode"
                  :badge-value="ProcessConfigMap['implStart'].num"
                  :disabled="ProcessConfigMap['implStart'].disabled"
                  @click="clickButton(ProcessConfigMap['implStart'].code)"
                >
                  {{ ProcessConfigMap["implStart"].text }}
                </ProcessButton>
              </div>
              <div class="M-0-5  ">
                <img class="icon-2 M-T-20" src="../../../../assets/project/approval/approval5.jpg">
              </div>
              <div
                class="flex-column flex  M-T-12 flex-justify-strat wrapper-left-main-container-group-small"
              >
                <p>
                  <ProcessButton
                    :active="ProcessConfigMap['notAcc'].code === _activeCode"
                    :badge-value="ProcessConfigMap['notAcc'].num"
                    :disabled="ProcessConfigMap['notAcc'].disabled"
                    @click="clickButton(ProcessConfigMap['notAcc'].code)"
                  >
                    {{ ProcessConfigMap["notAcc"].text }}
                  </ProcessButton>
                </p>
                <p>
                  <img
                    class="rotate-left-90 icon-1"
                    src="../../../../assets/project/demand/arrow1.png"
                  >
                </p>
                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['completeAcc'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['completeAcc'].num"
                    :disabled="ProcessConfigMap['completeAcc'].disabled"
                    @click="clickButton(ProcessConfigMap['completeAcc'].code)"
                  >
                    {{ ProcessConfigMap["completeAcc"].text }}
                  </ProcessButton>
                </p>
              </div>
              <div class="M-0-5 flex flex-align-center">
                <img src="../../../../assets/project/demand/arrow1.png" class="icon-1">
              </div>
              <div class="flex flex-align-center">
                <ProcessButton
                  :active="
                    ProcessConfigMap['verifyResults'].code === _activeCode
                  "
                  :badge-value="ProcessConfigMap['verifyResults'].num"
                  :disabled="ProcessConfigMap['verifyResults'].disabled"
                  @click="clickButton(ProcessConfigMap['verifyResults'].code)"
                >
                  {{ ProcessConfigMap["verifyResults"].text }}
                </ProcessButton>
              </div>
              <div class="M-0-5 flex flex-align-center P-top-30">
                <img class="icon-6" src="../../../../assets/project/approval/approval6.png">
              </div>
              <div
                class="flex-column flex flex-justify-end wrapper-center-main-container-group-small M-B-12 M-R-15"
              >
                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['endCompleted'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['endCompleted'].num"
                    :disabled="ProcessConfigMap['endCompleted'].disabled"
                    @click="clickButton(ProcessConfigMap['endCompleted'].code)"
                  >
                    {{ ProcessConfigMap["endCompleted"].text }}
                  </ProcessButton>
                </p>

                <p>
                  <ProcessButton
                    :active="
                      ProcessConfigMap['notCompleted'].code === _activeCode
                    "
                    :badge-value="ProcessConfigMap['notCompleted'].num"
                    :disabled="ProcessConfigMap['notCompleted'].disabled"
                    @click="clickButton(ProcessConfigMap['notCompleted'].code)"
                  >
                    {{ ProcessConfigMap["notCompleted"].text }}
                  </ProcessButton>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-header>

    <el-footer class="wrapper-footer" height="auto">
      <slot />
    </el-footer>
  </el-container>
</template>

<script>
import { processConfig, } from './processPanel';
import { keyBy, map, assign, } from 'lodash';
import { mapMutations, } from 'vuex';
import ProjectAPI from '@/apis/project';
import { unset, } from 'lodash';
import ProcessButton from '../button/processButton.vue';
import HeaderButton from '../button/processPanelHeaderButton.vue';
export default {
  name: 'ProcessPanel',
  components: {
    ProcessButton,
    HeaderButton,
  },
  filters: {
    activeHeaderClass(n, code) {
      let isTrue = false;
      if (n === code) {
        isTrue = true;
      } else if (n === code) {
        isTrue = true;
      } else if (n === code) {
        isTrue = true;
      } else {
        isTrue = false;
      }

      return isTrue ? 'wrapper-header-active' : 'wrapper-header-default';
    },
  },
  props: {
    activePanelName: {
      type: String,
      default: '',
    },
    activeButton: {
      type: String,
      default: '',
    },
    showHeader: Boolean,
    // cbFn: Function,
  },
  data() {
    return {
      processConfig,
      loading: true,
      activeCode: '',
      ProcessConfigMap: {},
    };
  },
  computed: {
    _activeCode: {
      get() {
        return this.activeCode || this.activeButton;
      },
    },
  },
  activated() {
    this.initPanelActive();
    this.init();
  },
  created() {
    this.initPanelActive();
    this.activeCode = this.activeButton;
    this.SET_INJECT_EVENT({
      name: 'process',
      fun: this.init,
      immediate: true,
    });
  },
  methods: {
    ...mapMutations('project/index', ['SET_INJECT_EVENT']),
    onJumpBoardProject() {
      this.$router.push({
        path: '/project/projectKanBan',
      });
    },
    onJumpBoardDemand() {
      this.$router.push({
        path: '/project/demandKanBan',
      });
    },
    async init() {
      if (this.activePanelName) {
        try {
          this.loading = true;
          const demandResult = await ProjectAPI.demand.getProcessNumm() || {};
          const setUpReusult = await ProjectAPI.setUp.getProcessData() || {};
          Object.assign(demandResult, { demandStand: demandResult.stand, });
          unset(demandResult, 'stand');
          const allRed = { ...demandResult, ...setUpReusult, };
          for (const i of this.processConfig) {
            i.num = allRed[i.code] || '';
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    },
    clickButton(code) {
      this.activeCode = code;
      this.$emit('click', code);
    },

    initPanelActive() {
      const rs = map(this.processConfig, (e) => {
        let disabled = true;
        if (this.activePanelName === '') {
          disabled = false;
        } else {
          disabled = !e.where.includes(this.activePanelName);
        }
        return assign(e, { disabled, });
      });
      this.ProcessConfigMap = keyBy(rs, 'code');
    },
  },
};
</script>
<style lang='scss' scoped>
.border {
  border: 1px solid #dee2ee;
  border-radius: 4px;
}

.icon {
  &-wrapper{
    position: relative;

  }
  &-item{
      &-absolute{
      position: absolute;
    }
  }
  &-1 {
    width: 14px;
    height: 12px;
  }
  &-2 {
    width: 24px;
    height: 56px;
  }
  &-3 {
    width: 176px;
    height: 34px;
  }
  &-4 {
    width: 22px;
    height: 90px;
  }
  &-5{
    width: 262px;
    height: 32px;
  }
  &-6{
      width:24px;
    height: 39px;
  }
  &-7{
    width: 262px;
    height: 32px;
  }
  &-8{
        width:259px;
    height: 49px;
  }
  &-9{
    width: 24px;
    height: 53px;
  }
}

.wrapper {
  flex: 1;
  display: inline-flex;
  flex-direction: row;
  border-radius: 4px;
  overflow: hidden;
  // overflow: auto;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  height: 180px;
  &-header {
    height: 38px;
    line-height: 38px;
    text-align: center;
    &-default {
      background-color: #dcdfe6;

      > b {
        font-size: 18px;
        font-weight: 400;
        color: #334266;
      }
    }
    &-active {
      background-color: #7997f2;
      > b {
        font-size: 18px;
        font-weight: 400;
        color: #fff;
      }
    }
  }
  &-footer {
    padding: 0;
  }
  &-left,
  &-center,
  &-right {
    position: relative;
    &-main {
      // height: 150px;

      // padding: 15px 0 0 5px;
      // padding: 15px 9px 15px 15px;
      overflow: hidden;
      &-container {
        // height: 120px;
        position: relative;
      }
    }
  }
  &-left {
    &-main {
      box-shadow: inset -1px 0px 0 0px #e6eaf2;

      &-container {
        &-group {
          &-default {
            > p {
              padding: 0;
              margin: 0 0 12px 0;
              &:nth-of-type(3) {
                margin-bottom: 0;
              }
            }
          }
          &-column{
                p {
              padding: 0;
              margin: 0 0 14px 0;
              &:nth-of-type(3) {
                margin-bottom: 0;
              }
            }
          }
          &-small {
            > p {
              // flex: 1;
              padding: 0;
              // margin: 0 0 12px 0;
              margin: 0;
              text-align: center;
              &:nth-of-type(3) {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  }
  &-center {
    &-main {
      box-shadow: inset -1px 0px 0 0px #e6eaf2;
      &-container {
        &-group {
          &-small {
            > p {
              padding: 0;
              margin: 0;
              &:first-child {
                margin-bottom: 20px;
              }
            }
          }
        }
      }
    }
  }
  &-right {
    .w-293 {
      width: 293px;
    }
    &-main {
      &-container {
        &-group {
          &-small {
            > p {
              padding: 0;
              margin: 0;
              &:first-child {
                margin-bottom: 18px;
              }
            }
          }
        }
      }
    }
  }
  .position {
    &-relative {
      position: relative;
    }
    &-absolute {
      position: absolute;
      overflow: hidden;
    }
  }

  // div{
  //   display: inline-block;
  // }

  .flex {
    display: flex;
    &-1 {
      flex: 1;
    }
    &-column {
      flex-direction: column;
    }
    &-row {
      flex-direction: row;
    }
    &-align {
      &-center {
        align-items: center;
      }
      &-end {
        align-items: flex-end;
      }
      &-start {
        align-items: start;
      }
    }
    &-justify {
      &-center {
        justify-content: center;
      }
      &-end {
        justify-content: flex-end;
      }
      &-start {
        justify-content: start;
      }
    }
  }
  .display {
    &-inline {
      display: inline;
      &-block {
        display: inline-block;
      }
    }
    &-block {
      display: block;
    }
  }
  .rotate {
    &-left {
      &-90 {
        transform: rotate(90deg);
      }
    }
    &-right {
      &-90 {
        transform: rotate(-90deg);
      }
    }
  }
  .top {
    &-6 {
      top: 6px;
    }
    &-8 {
      top: 8px;
    }
    &-23{
      top: 23px;
    }
    &-55-per {
      top: 55%;
    }
  }
  .left {
    &-10 {
      left: 10px;
    }
    &-35 {
      left: 35px;
    }
    &-43{
      left: 43px;
    }
  }
  .right {
    &-7-minus {
      right: -7px;
    }
  }
  .bottom {
    bottom: 0;
    &-10{
      bottom: 10%;
    }
    &-20{
      bottom: 20px;
    }
  }
  .zIndex {
    &-99 {
      z-index: 99;
    }
  }
  .P {
    &-3{
      padding: 3px;
    }
    &-5 {
      padding: 5px;
    }

    &-0-2 {
      padding: 0 4px;
    }
    &-0-3 {
      padding: 0 3px;
    }
    &-0-8 {
      padding: 0 8px;
    }
    &-0-5 {
      padding: 5px;
    }
    &-bottom-7 {
      padding-bottom: 7px;
    }
    &-bottom-28 {
      padding-bottom: 28px;
    }
    &-top-5 {
      padding-top: 5px;
    }
    &-top-30 {
      padding-top: 30px;
    }
  }
  .M {
    &-0-2 {
      margin: 0 4px;
    }
    &-0-8 {
      margin: 0 8px;
    }
    &-0-5 {
      margin:0 5px;
    }
    &-5{
      margin: 5px;

    }
    &-L{
        &-9{
          margin-left: 9px;
        }
        &-15{
          margin-left: 15px;
        }
    }
    &-R{
      &-15{
        margin-right: 15px;
      }
    }
    &-T{
      &-58{
        margin-top: 58px;
      }
      &-67{
        margin-top: 67px;
      }
      &-12{
        margin-top: 12px;
      }
       &-20{
        margin-top: 20px;
      }
      &-23{
        margin-top: 23px;
      }
    }
    &-B{
      &-20{
        margin-bottom: 20px;
      }
        &-12{
        margin-bottom: 12px;
      }
    }
  }
}
</style>
