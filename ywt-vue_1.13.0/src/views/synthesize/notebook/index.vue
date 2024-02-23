<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-07 09:59:15
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-19 18:11:06
 * @FilePath: \ywt-vue-qp\src\views\synthesize\notebook\index.vue
 * @Description: 待办事项
-->
<template>
  <el-container>
    <el-main class="notebook-container">
      <div class="container-header">
        <div class="header-search">
          <el-input
            v-model="serachForm.name"
            clearable
            size="mini"
            prefix-icon="el-icon-search"
            placeholder="请输入事项名称"
            class="width-200 mr-right-10"
          />
          <el-select
            v-model="serachForm.itemCode"
            filterable
            clearable
            size="mini"
            class="width-200 mr-right-10"
            placeholder="请选择所属项目"
          >
            <el-option
              v-for="(item, index) in itemCodeList"
              :key="index"
              :value="item.itemCode"
              :label="item.title"
            />
          </el-select>
          <el-select
            v-model="serachForm.state"
            filterable
            clearable
            size="mini"
            class="width-200 mr-right-10"
            placeholder="请选择今日事项"
          >
            <el-option
              v-for="(item, index) in noteTypeList"
              :key="index"
              :value="item.value"
              :label="item.lable"
            />
          </el-select>
          <el-select
            v-show="teamList.length"
            v-model="serachForm.showRange"
            filterable
            clearable
            size="mini"
            class="width-200 mr-right-10"
            placeholder="请选择查看范围"
            @change="changeTeam"
          >
            <el-option
              v-for="(item, index) in teamList"
              :key="index"
              :value="item.showRange"
              :label="item.name"
            />
          </el-select>
          <el-select
            v-show="isShow"
            v-model="serachForm.sendUser"
            multiple
            filterable
            clearable
            collapse-tags
            size="mini"
            class="width-200 mr-right-10 Q-select"
            placeholder="请选择人员"
            @change="changeUser"
          >
            <el-option
              v-for="(item, index) in userOfTeam"
              :key="index"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
          <el-button size="mini" @click="searchClick">查询</el-button>
        </div>
        <span>
          <pure-button
            label="生成报告"
            type="wire-frame"
            @click="onGenerateReport"
          />
          <el-button
            type="primary"
            size="mini"
            calss="header-add"
            @click="onAdd('add')"
          >新增事项</el-button>
        </span>
      </div>
      <Q-table
        :table-data="tableData"
        :columns="tableColumn"
        :custom-cell-style="customCellStyle"
        :pagination="pagination"
        :total="count"
        :page-sizes="pageSizes"
        :current-change="currentChange"
        :size-change="sizeChange"
        class="container-table"
      />
    </el-main>
  </el-container>
</template>
<script>
// import dayjs from 'dayjs';
import { mapGetters, } from 'vuex';
import NotebookApi from '@/apis/notebook';
import AddNoteDrawer from './components/addNoteDrawer';
import ReportSettingDialog from './dialog/reportSetting.vue';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';
export default {
  name: 'ZhBwsx',
  components: {},
  data() {
    return {
      isShow: false,
      serachForm: {
        name: '',
        itemCode: '',
        state: 3, // 默认选中今日事项
        teamId: '',
        showRange: 0, // 默认选中全部小组
        sendUser: [],
      },
      itemCodeList: [],
      noteTypeList: Object.freeze([
        {
          value: 0,
          lable: '全部事项',
        },
        {
          value: 1,
          lable: '待开始',
        },
        {
          value: 2,
          lable: '已完成',
        },
        {
          value: 3,
          lable: '今日事项',
        },
        {
          value: 4,
          lable: '日常事务',
        }
      ]),
      teamList: [], // 查看范围下拉数据
      userOfTeam: [], // 对应组下的小组成员
      allTeam: [], // 组长管理的所有组
      tableData: [],
      tableColumn: Object.freeze([
        { label: '序号', type: 'index', width: '100px', },
        {
          label: '创建人',
          prop: 'createUserToName',
          width: '85px',
          formatter: function (row) {
            const { createUserToName, } = row;
            if (!createUserToName) {
              return '--';
            } else {
              return createUserToName;
            }
          },
        },
        {
          label: '事项名称',
          prop: 'name',
          width: '290px',
          formatter: function (row) {
            const { name, importantUrgent, } = row;
            console.log(typeof importantUrgent);
            let bgColor = '';
            switch (importantUrgent) {
              case 0:
                bgColor = '#BFBFBF';
                return (
                  <div class='name-container'>
                    <span class='circle' style={{ background: bgColor, }} /><span class='cell-text'>{name}</span>
                  </div>
                );
              case 1:
                bgColor = '#4574E6';
                return (
                  <div class='name-container'>
                    <span class='circle' style={{ background: bgColor, }} /><span class='cell-text'>{name}</span>
                  </div>
                );
              case 2:
                bgColor = '#E6A23C';
                return (
                  <div class='name-container'>
                    <span class='circle' style={{ background: bgColor, }} /><span class='cell-text'>{name}</span>
                  </div>
                );
              case 3:
                bgColor = '#F56C6C';
                return (
                  <div class='name-container'>
                    <span class='circle' style={{ background: bgColor, }} /><span class='cell-text'>{name}</span>
                  </div>
                );
              default:
                bgColor = '#BFBFBF';
                return (
                  <div class='name-container'>
                    <span class='circle' style={{ background: bgColor, }} /><span class='cell-text'>{name}</span>
                  </div>
                );
            }
          },
        },
        {
          label: '截止时间',
          prop: 'endDate',
          width: '200px',
          formatter: function (row) {
            const { endDate, endTime, } = row;
            if (!endDate && !endTime) return '--';
            let EndTime;
            endTime ? (EndTime = endTime.slice(0, endTime.length - 3)) : (EndTime = ''); // 兼容处理后台null
            return `${endDate}  ${EndTime}`;
          },
        },
        {
          label: '所属项目',
          prop: 'itemToName',
          width: '350px',
          formatter: (row) => {
            if (!row.itemToName) {
              return '--';
            } else {
              return <DemandOrProjectName data={row}/>;
            }
          },
        },
        {
          label: '所属任务',
          prop: 'workToName',
          // width: '350px',
          formatter(row) {
            if (!row.workToName) {
              return '--';
            } else {
              return row.workToName;
            }
          },
        },
        {
          label: '状态',
          prop: 'state',
          width: '100px',
          formatter: function (row) {
            switch (row.state) {
              case 1:
                return <div style='color: #F56C6C'>待开始</div>;
              case 2:
                return <div style='color: #999'>已完成</div>;
            }
          },
        },
        {
          label: '操作',
          width: '200px',
          buttons: [
            // 配置说明： click: 普通按钮   confirm：气泡按钮   hidden：按钮显示和隐藏
            {
              type: 'text',
              size: 'mini',
              label: '撤销完成',
              click: row => {
                this.onRevoke(row);
              },
              hidden: row => row.state === 1,
            },
            {
              type: 'text',
              size: 'mini',
              label: '完成',
              click: row => {
                this.onDone(row);
              },
              hidden: row => row.state === 2,
            },
            {
              type: 'text',
              size: 'mini',
              label: '编辑',
              click: row => {
                this.onAdd('edit', row);
              },
            },
            {
              type: 'text',
              size: 'mini',
              label: '删除',
              confirm: row => {
                return this.onDelete(row);
              },
              hidden: row => row.state === 2,
            }
          ],
        }
      ]),
      customCellStyle: {
        propertys: ['name', 'itemToName', 'workToName'],
        style: 'text-align:left',
      },
      pageSizes: [20, 30, 40],
      pagination: {
        pageNum: 1,
        pageSize: 20,
      },
      count: 0,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getProjectListData();
    this.getGroupListData();
    this.getNotesPageListData();
  },
  methods: {
    // 获取项目组下拉
    async getProjectListData() {
      const params = {
        pageNum: 1,
        pageSize: 9999,
        temp: 'quote',
      };
      const res = await NotebookApi.getProjectList(params);
      this.itemCodeList = res.list;
    },
    // 获取分组下拉
    async getGroupListData() {
      const res = await NotebookApi.getGroupList();
      const dataList = res.list || [];
      this.teamList = [];
      this.allUserInTeam = [];
      this.allTeam = dataList.filter(item => {
        if (item.leaderObj && item.leaderObj.id === this.userInfo.id) {
          this.teamList.push({ showRange: item.id, name: item.name, userObjs: item.userObjs, });
          this.allUserInTeam = this.allUserInTeam.concat(item.userObjs);
          return item;
        }
      });
      this.allUserInTeam = this.deduplication(this.allUserInTeam);
      !this.allUserInTeam.length
        ? (this.teamList = [])
        : (this.teamList = [
          { showRange: 0, name: '查看自己', },
          { showRange: -1, name: '查看全部', },
          ...this.teamList
        ]);
    },
    // 小组成员去重
    deduplication(arr) {
      var obj = {};
      return arr.reduce(function (item, next) {
        obj[next.id] ? '' : obj[next.id] = true && item.push(next);
        return item;
      }, []);
    },
    // 选择小组
    changeTeam(v) {
      this.isShow = this.serachForm.showRange > 0;
      this.serachForm.sendUser = [];
      const userOfTeam = this.allTeam.filter(item => {
        return v === item.id;
      });
      this.userOfTeam = userOfTeam[0] ? userOfTeam[0].userObjs : [];
    },
    changeUser(v) {
      console.log(v);
    },
    // 获取项备忘录列表
    async getNotesPageListData() {
      const { name, itemCode, state, teamId, showRange, sendUser, } = this.serachForm;
      const params = {
        name,
        itemCode,
        state,
        teamId,
        showRange,
        sendUser: sendUser.join(','),
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      const res = await NotebookApi.getNotesPageList(params);
      this.tableData = res.list;
      this.count = res.total;
    },
    onGenerateReport() {
      const { showRange, } = this.serachForm;
      let sendUser = [];
      // 此处 el-selsct  组件回显的数据 需要转成字符串
      if (showRange === 0) {
        // 只看自己 默认传登录人id
        sendUser = [this.userInfo.id + ''];
      } else if (showRange === -1) {
        // 查看全部 传全部组下的所有组员id
        sendUser = this.findAllUserId(this.allUserInTeam);
      } else {
        // 查看某组 如果未勾选具体组员 默认传该组下的所有组员id 如果勾选 传勾选的组员id
        sendUser = this.serachForm.sendUser.length > 0 ? this.serachForm.sendUser.join(',').split(',') : this.findAllUserId(this.userOfTeam);
      }
      const reportData = { showRange, sendUser, };
      this.$dialog({
        title: '生成报告',
        width: '688px',
        top: '32vh',
        position: 'center',
        component: () => <ReportSettingDialog reportData={reportData} />,
      });
    },
    // 查看全部小组 获取组长旗下全部组员
    findAllUserId(arr) {
      const res = [];
      arr.forEach(user => {
        res.push(user.id + '');
      });
      return res;
    },
    // 完成备忘录
    setCompleteNote(id) {
      NotebookApi.completeNote({ id, }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '操作成功！',
          });
          this.getNotesPageListData();
        } else {
          this.$message({
            type: 'success',
            message: res.msg,
          });
        }
      });
    },
    // 撤销完成备忘录
    setRevokeComplete(id) {
      NotebookApi.revokeComplete({ id, }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '操作成功！',
          });
          this.getNotesPageListData();
        } else {
          this.$message({
            type: 'success',
            message: res.msg,
          });
        }
      });
    },
    // 删除备忘录
    setDeleteNote(id) {
      NotebookApi.deleteNote({ id, }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '操作成功！',
          });
          this.getNotesPageListData();
        } else {
          this.$message({
            type: 'success',
            message: res.msg,
          });
        }
      });
    },
    searchClick() {
      this.getNotesPageListData();
    },
    onRevoke(row) {
      this.setRevokeComplete(row.id);
    },
    onDone(row) {
      this.setCompleteNote(row.id);
    },
    onAdd(clickType, row) {
      this.$drawer({
        width: '720px',
        component: () => (
          <AddNoteDrawer
            itemCodeList={this.itemCodeList}
            row={row}
            onDone={this.getNotesPageListData}
            title={clickType === 'add' ? '新增事项' : '编辑事项'}
          />
        ),
      });
    },
    onDelete(row) {
      this.setDeleteNote(row.id);
    },
    // 每页数量改变
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getNotesPageListData();
    },
    // 当前页改变
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getNotesPageListData();
    },
  },
};
</script>

<style lang="scss" scoped>
.notebook-container {
  background: #fff;
  padding: 10px;
  // overflow: scroll;
  .container-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-search {
      display: flex;
      align-items: center;
      // width: 648px;
    }
  }
  .container-table {
    margin-top: 10px;
    height: calc(100% - 44px);
  }
  .name-container {
    display: flex;
    align-items: center;
    .circle {
      border-radius: 50%;
      display: inline-block;
      // background: #426ED7;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
    .cell-text{
      width: 280px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
::v-deep .Q-select .el-input__inner {
  height: 32px !important;
}
</style>
