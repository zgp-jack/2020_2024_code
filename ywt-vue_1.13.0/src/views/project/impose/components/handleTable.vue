
<!-- 任务列表 -->
<template>
  <el-container>
    <el-header height="48px" class="header_wrapper">
      <span class="header_wrapper--title">{{ handleTitle }}</span>
      <span class="header_wrapper--codeName">{{ _itemCode }}</span>
      <el-button
        style="margin-left:24px"
        size="small"
        plain
        type="primary"
        @click="clickSaveTemplate"
      >保存模板</el-button>
    </el-header>
    <el-main>
      <el-table
        :data="taskTreeList"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        size="mini"
        :indent="0"
        append-to-body
        :default-sort="{ prop: 'indexNum', order: 'ascending' }"
        :row-style="rowStyle"
        :cell-style="tableStyle.cellStyle"
      >
        <el-table-column prop="indexNum" label="序号" width="auto" />
        <el-table-column
          v-for="v in renderTableConfig"
          :key="v.id"
          :show-overflow-tooltip="v.overflow "
          :prop="v.property"
          :formatter="v.formatter ? v.formatter : null"
          :label="v.label"
          :min-width="v.w"
          :align="v.align ? v.align : 'center'"
        >
          <template v-if="v.slot" #default="{ row }">
            <!-- 任务处理 -->
            <!-- 当进度为100%，tempId为0时，且processState = implement_start，就显示处理按钮 -->
            <template v-if="row.quoteId === 0">
              <span v-for="(s, i) in v.childs" :key="i" style="margin: 0 3px">
                <template v-if="row.tempId !== 1 && row.parentId && row.isAct === 1">
                  <el-button
                    :disabled="row.users | isMy(row.principal)"
                    type="text"
                    @click="options(s.code, row)"
                  >{{ s.name }}
                  </el-button>
                </template>
                <template v-else-if="row.tempId !== 1 && row.parentId && row.totalProgress === 100">
                  <el-button
                    :disabled="row.users | isMy(row.principal)"
                    type="text"
                    @click="options('append', row)"
                  >补充
                  </el-button>
                </template>
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="footer_wrapper">
      <el-button size="mini" type="primary" @click="clickBackItem">
        返回项目
      </el-button>
      <el-button
        v-if="handleTitle === '确认' && showSubmit"

        type="primary"
        size="mini"
        :loading="submitButtonLoading"
        @click="clickConfirmResult"
      >提交</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { mixins_base, mixins_task, } from '@/minxins/project';
import { stringToArray, } from '@/utils/common';
import { date, member, stringifyToArr, } from '@/filters';
import { mapGetters, } from 'vuex';
import { tableCellIconData, } from '@/views/project/common/index';
import _ from 'lodash';
import moment from 'moment';
import ProjectAPI from '@/apis/project';
import store from '@/store';
import processTimeLine from '../../components/panels/childComponents/perojectInfo/processTimeLine.vue';
import tableStyle from '../../style/table';
import Handle from './handle.vue';
import SaveTemplate from '../../setUp/components/saveTemplate.vue';
import Attachment from '@/views/project/components/attachment/attachment.vue';
import Text from '@/views/project/components/text/text.vue';
const icons = {
  file: require('@/assets/project/icons/file.svg'),
};
const status = {
  0: {
    text: '未审核',
    color: '#E6A23C',
  },
  1: {
    text: '待审核',
    color: '#409EFF',
  },
  2: {
    text: '审核通过',
    color: '#67C23A',
  },
  3: {
    text: '审核失败',
    color: '#F56C6C',
  },
};
export default {
  name: 'TaskTable',
  filters: {
    isMy(users, pri) {
      const principal = member(pri);
      const allUsers = stringToArray(users + ',' + principal, ',', false);
      const me = store.state.login.userInfo.name;
      return !allUsers.includes(me);
    },
  },
  mixins: [mixins_base, mixins_task],
  props: {
    handleTitle: {
      type: String,
      default: '处理',
    },
  },
  data() {
    return {
      submitButtonLoading: false,
      tableStyle,
      progressDisabled: false,
      // tableConfig: [],
      TaskName: '添加子任务',
      taskID: 0,
      taskPID: 0,
      tableData: [],
      taskInfo: {},
      visible: false,
      userIds: [],
      maxDay: 100,
      startEnd: {
        start: '',
        end: '',
      },
      isUpload: false,
      result: [],
      beforeId: '',
    };
  },

  computed: {
    _itemCode() {
      if (this.itemCode) {
        return `需求编号:${this.itemCode}`;
      }
      return '';
    },
    isNoPass() {
      return this.researchInfo.showState !== 'program_review_reject';
    },
    ...mapGetters(['userInfo']),
    state() {
      return this.researchInfo.showState;
    },
    showSubmit() {
      return Number(this.researchInfo.principal) === Number(this.userInfo.id);
    },

    tableConfig() {
      return [
        {
          label: '任务名称',
          property: 'name',
          w: '160px',
          overflow: true,

          formatter: (v) => {
            let tag = null;
            let quto = null;
            if (v['isHinge']) {
              tag = this.$createElement('i', {
                domProps: {
                  innerHTML: '*',
                },
                style: {
                  color: 'rgb(212, 16, 16)',
                  fontWeight: 600,
                  fontSize: ' 14px',
                  fontStyle: 'initial',
                  marginRight: '10px',
                },
              });
            }
            if (v['quoteId']) {
              quto = this.$createElement('i', {
                domProps: {
                  innerHTML: '引',
                },
                style: {
                  color: 'rgb(29 163 64)',
                  fontSize: '14px',
                  fontStyle: 'initial',
                  marginRight: '10px',
                  display: 'inline-block',
                  border: '1px solid',
                  borderRadius: '100%',
                  width: '18px',
                  height: '18px',
                  textAlign: 'center',
                  lineHeight: '16px',
                },
              });
            }
            return this.$createElement('div', {
              style: {
                display: 'flex',
              },
            }, [
              quto,
              tag,
              this.$createElement(Text, {
                props: {
                  textContent: v['name'],
                },
              })
            ]);
          },
        },
        {
          label: '任务描述',
          property: 'remark',
          overflow: true,
          w: '160px',
          formatter: (v) => {
            return this.$createElement(Text, {
              props: {
                textContent: v['remark'],
              },
            });
          },
        },
        {
          label: '预计工时',
          property: 'planUse',
          overflow: true,
          w: '78px',
          formatter: (v) => {
            if (v['planUse']) {
              return v['planUse'] + '天';
            }
            return '-';
          },
        },
        {
          label: '创建人',
          property: 'createUser',
          overflow: true,
          w: '70px',
          formatter: (v) => {
            return member(v['createUser']);
          },
        },
        {
          label: '负责人',
          property: 'principal',
          overflow: true,
          w: '70px',
          formatter: (v) => {
            return member(v['principal']);
          },
        },
        {
          overflow: true,
          label: '参与人员',
          property: 'users',
          w: '100px',
        },
        {
          label: '进度',
          overflow: true,

          property: 'totalProgress',
          w: '94px',
          formatter: (v) => {
            if (v['quoteId']) {
              return '-';
            }
            if (v['totalProgress'] !== null) {
              return this.$createElement(processTimeLine, {
                props: {
                  value: v['totalProgress'] + '%',
                  id: v['id'],
                },
              });
            } else {
              return '-';
            }
          },
        },
        {
          label: '开始/截止日期',
          property: 'startTime',
          overflow: false,
          w: '145px',
          formatter: (v) => {
            if (!v['startTime'] && !v['endTime']) {
              const val = this.computedMileageSE(v['id'], this.taskList);
              return this.$createElement('div', {}, [
                this.$createElement('p', val[0]),
                this.$createElement('p', val[1])
              ]);
            }
            return this.$createElement('div', {}, [
              this.$createElement('p', date(v['startTime'], 'YYYY-MM-DD HH:mm')),
              this.$createElement('p', date(v['endTime'], 'YYYY-MM-DD HH:mm'))
            ]);
          },
        },
        {
          overflow: true,
          label: '依据',
          property: 'according',
          w: '150px',
        },
        {
          label: '附件',
          property: 'file',
          w: '70px',
          formatter: (v) => {
            const num = stringifyToArr(v['template']).length;
            return tableCellIconData(icons.file, num, v['template'], Attachment, '附件');
          },
        }
      ];
    },
    renderTableConfig() {
      if ('implement_start/item_before_project'.indexOf(this.state) > -1) {
        return [
          ...this.tableConfig,
          {
            label: '操作',
            slot: true,
            width: 'auto',
            childs: [
              {
                name: '处理',
                code: 'handle',
              }
            ],
          }
        ];
      }
      if (this.state === 'program_review_reject') {
        return [...this.tableConfig, {
          label: '评审结果',
          property: 'state',
          w: '100px',
          formatter: (e) => {
            return this.$createElement('span', {
              style: {
                color: status[e.approvalStatus].color,
              // marginLeft: '16px',
              },
              domProps: {
                innerHTML: status[e.approvalStatus].text,
              },
            });
          },
        }, {
          label: '评审人',
          property: 'reviewUser',
          formatter: (v) => {
            return member(v['reviewUser']);
          },
        }, {
          label: '操作',
          slot: true,
          w: '200px',
          childs: [{
            name: '编辑',
            code: 'edit',
          }, {
            name: '删除',
            code: 'del',
          }, {
            name: '添加子任务',
            code: 'add',
          }],
        }];
      }

      if (this.state === 'implement_over') {
        return [...this.tableConfig, {
          label: '操作',
          slot: true,
          w: 'auto',
          childs: [{
            name: '处理',
            code: 'handle',
            memo: 'PS:暂时无用',
          }],
        }];
      }
      return this.tableConfig;
    },

  },

  mounted() {
    this.getTaskList();
  },
  methods: {
    computedMileageSE(id, childList) {
      const theIdList = childList.filter(e => e.parentId === id);
      if (theIdList.length) {
        const timeStartTimeGather = theIdList.map(e => new Date(e.startTime).getTime());
        const timeEndTimeGather = theIdList.map(e => new Date(e.endTime).getTime());
        const minTime = moment(_.min(timeStartTimeGather)).format('YYYY-MM-DD HH:mm');
        const maxTime = moment(_.max(timeEndTimeGather)).format('YYYY-MM-DD HH:mm');
        return [minTime, maxTime];
      }
      return ['-', '-'];
    },
    rowStyle({ row, rowIndex, }) {
      if (row.quoteId === 1) {
        return {
          backgroundColor: '#f7f7f7',
        };
      }
      return {};
    },
    clickBackItem() {
      this.$emit('done');
    },
    async clickConfirmResult() {
      try {
        this.submitButtonLoading = true;
        await ProjectAPI.impose.confirmResult(this.itemCode);
        this.$message.success('提交成功');
        this.submitButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.submitButtonLoading = false;

        this.$message.error(error);
      }
    },
    clickSaveTemplate() {
      this.$dialog({
        width: '688px',
        position: 'center',
        title: '保存模板',
        component: () => <SaveTemplate />,
      });
    },
    options(opt, row) {
      let title = '';
      switch (opt) {
        case 'handle':
          this.taskID = row.id;
          this.userIds = stringToArray((row.userIds || '') + ',' + row.principal);
          this.isUpload = !!row.isSubmit;
          title = '处理';
          this.progressDisabled = false;

          this.$dialog({
            position: 'center',
            width: '688px',
            title: '处理',
            component: () => (
              <Handle
                info={row}
                id={this.taskID}
                user-ids={this.userIds}
                is-upload={this.isUpload}
                title={title}
                progress-disabled={this.progressDisabled}
                onDone={this.getTaskList}
              />
            ),
          });
          break;
        // 任务补充
        case 'append':
          this.taskID = row.id;
          title = '补充';
          this.userIds = stringToArray(row.userIds + ',' + row.principal);
          this.isUpload = !!row.isSubmit;
          this.progressDisabled = true;
          this.$dialog({
            position: 'center',
            width: '688px',
            title: '补充',
            component: () => (
              <Handle
                id={this.taskID}
                user-ids={this.userIds}
                is-upload={this.isUpload}
                title={title}
                progress-disabled={this.progressDisabled}
                onDone={this.getTaskList}
              />
            ),
          });
          break;
        default:
          alert('无效的操作');
          break;
      }
    },
    async getTaskList() {
      if (this.itemCode) {
        this.SET_TASK_LIST(
          await ProjectAPI.setUp.getTaskList({ itemCode: this.itemCode, })
        );
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.header {
  &_wrapper {
    display: flex;
    align-items: center;
    &--title {
      font-size: 18px;
      font-weight: 400;
      color: #2d405e;
    }
    &--btngroup {
      display: inline-block;
      margin-left: 36px;
    }
      &--codeName {
      font-size: 18px;
      font-weight: 400;
      color: #879bba;
      display: inline-block;
      margin-left: 36px;
    }
  }
}
.footer {
  &_wrapper {
    display: flex;
    align-items: center;
    padding: 0 !important;
    &-save-button {
      background: #fff;
    }
  }
}
</style>
