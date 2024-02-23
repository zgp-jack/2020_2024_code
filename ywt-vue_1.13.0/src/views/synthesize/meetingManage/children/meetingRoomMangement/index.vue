<!--
   会议室管理
 -->
<template>
  <el-container class="scheduled-wrapper">
    <el-main>
      <pure-table-area>
        <template #header>
          <el-row
            class="flex base-margin-left base-margin-top scheduled-row m-r-16"
          >
            <el-col :span="12">
              <Search v-model="searchValue" style="width: 200px" />
            </el-col>
            <el-col :span="12" class="t-r">
              <el-button
                type="primary"
                size="mini"
                @click="clikAddRule"
              >新增会议室</el-button>
            </el-col>
          </el-row>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              :data="data"
              border
              :cell-style="tableStyle.cellStyle"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
            >
              <el-table-column
                width="85px"
                label="序号"
                :fixed="true"
                align="left"
                type="index"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                width="245px"
                label="名称"
                :fixed="true"
                align="left"
                prop="name"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                width="119px"
                label="容纳人数"
                :fixed="true"
                align="left"
                prop="peopleNumber"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                width="210px"
                label="所属院区"
                :fixed="true"
                align="left"
                prop="deptHospitalName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                width="210px"
                label="所属科室"
                :fixed="true"
                align="left"
                prop="deptName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                width="210px"
                label="地址"
                :fixed="true"
                align="left"
                prop="address"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                width="300px"
                label="预定时间范围"
                :fixed="false"
                align="left"
                prop="busMeetingRoomTimeDtos"
                :show-overflow-tooltip="true"
              >
                <template #default="{ row }">
                  <Popover :data="row" />
                </template>
              </el-table-column>
              <el-table-column
                width="130px"
                label="启用"
                fixed="right"
                align="left"
                prop="state"
                :show-overflow-tooltip="true"
              >
                <template #default="{ row }">
                  <el-switch
                    :value="row.state"
                    active-text="是"
                    :active-value="1"
                    active-color="#409EFF"
                    inactive-color="#ccc"
                    inactive-text="否"
                    :inactive-value="0"
                    @change="changeEnable($event, row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="140px"
                label="操作"
                fixed="right"
                align="left"
                prop=""
                :show-overflow-tooltip="true"
              >
                <template #default="{ row }">
                  <el-button
                    type="text"
                    size="mini"
                    @click="clickEdit(row)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="clickDel(row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template #footer>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </pure-table-area>
    </el-main>
  </el-container>
</template>

<script>
import tableStyle from '@/views/project/style/table';
import Search from '@/components/input/search.vue';
import AddRulePanel from './panel/addRule.vue';
import PaginationTable from '@/minxins/common/paginationTable';
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';
import Popover from './components/tablePopver.vue';
import { debounce, } from 'lodash';

export default {
  components: {
    Search,
    Popover,
  },
  mixins: [PaginationTable],
  data() {
    return {
      listApi: MeetingMangementApi.getMeetingRoomList,
      tableStyle,
      result: {},
    };
  },
  computed: {},
  mounted() {
    this.fetchData();
  },
  methods: {
    changeEnable: debounce(async function (val, row) {
      try {
        await MeetingMangementApi.enable({
          state: val,
          id: row.id,
        });
        row.state = val;
      } catch (error) {
        this.$message.error(error);
      }
    }, 300),
    changeReserve: debounce(async function (val, row) {
      try {
        await MeetingMangementApi.reserve({
          id: row.id,
          reserve: val,
        });
        row.reserve = val;
      } catch (error) {
        this.$message.error(error);
      }
    }, 300),
    clickEdit(row) {
      this.$drawer({
        width: '720px',
        component: () => <AddRulePanel onDone={this.onDone} id={row.id} />,
      });
    },
    clikAddRule() {
      this.$drawer({
        width: '720px',
        component: () => <AddRulePanel onDone={this.onDone}/>,

      });
    },
    onDone() {
      this.fetchData();
    },
    async clickDel(row) {
      this.$confirm(`是否删除「${row.name}」?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await MeetingMangementApi.deleteMeetingRoom({ id: row.id, });
            this.fetchData();
          } catch (error) {
            this.$message.error(error);
          }
        })
        .catch({});
    },
  },
};
</script>
<style lang="scss" scoped>
.scheduled {
  &-row {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
.m-r-16 {
  margin-right: 16px;
}
.t-r {
  text-align: right;
}
</style>
