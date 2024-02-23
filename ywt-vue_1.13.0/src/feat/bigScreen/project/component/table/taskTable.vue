
<!--  -->
<template>
  <el-table
    :data="data"
    height="100%"
    row-key="id"
    default-expand-all
    :tree-props="{ children: 'children' }"
    size="mini"
    :indent="0"
    :default-sort="{ prop: 'indexNum', order: 'ascending' }"
    :row-style="rowStyle"
    :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle"
    :cell-style="cellStyle"
    :cell-class-name="cellClassName"
  >
    <el-table-column align="left" :show-overflow-tooltip="false" prop="indexNum" label="序号" width="atuo" min-width="100px" fixed="left" />
    <el-table-column align="left" :show-overflow-tooltip="true" prop="name" label="任务名称" width="auto" min-width="200px">
      <template #default="{row}">
        <i v-if="row['isHinge']" class="hinge">*</i>
        {{ row['name'] }}
      </template>
    </el-table-column>
    <el-table-column align="left" :show-overflow-tooltip="true" prop="remark" label="任务描述" width="200px" />
    <el-table-column align="left" :show-overflow-tooltip="true" prop="planUse" label="预计工时" width="100px">
      <template #default="{row}">
        {{ row['planUse']?row['planUse']+'天':'-' }}
      </template>
    </el-table-column>
    <el-table-column align="left" :show-overflow-tooltip="true" prop="createUser" label="创建人" width="100px">
      <template #default="{row}">
        {{ row['createUser']| member }}
      </template>
    </el-table-column>
    <el-table-column align="left" :show-overflow-tooltip="true" prop="principal" label="负责人" width="100px">
      <template #default="{row}">
        {{ row['principal']| member }}
      </template>
    </el-table-column>
    <el-table-column align="left" :show-overflow-tooltip="true" prop="users" label="参与人员" width="200px" />

    <el-table-column align="left" :show-overflow-tooltip="true" prop="startTime" label="开始/截止日期" width="200px">
      <template #default="{row}">
        <template v-if="!row['startTime']">
          <p class="tag-p">{{ computedMileageSE(row['id'], taskList)[0] }}</p>
          <p class="tag-p">{{ computedMileageSE(row['id'], taskList)[1] }}</p>
        </template>
        <template v-else>
          <p class="tag-p">{{ row['startTime'] | date('YYYY-MM-DD HH:mm') }}</p>
          <p class="tag-p">{{ row['endTime'] | date('YYYY-MM-DD HH:mm') }}</p>
        </template>
      </template>
    </el-table-column>
    <el-table-column align="left" :show-overflow-tooltip="true" prop="totalProgress" label="进度" width="95px" min-width="95px" fixed="right">
      <template #default="{row}">
        <ProcessTimeLine v-if="row['totalProgress']" :id="row['id']" :value="row['totalProgress'] + '%'" />
        <span v-else>
          -
        </span>
      </template>
    </el-table-column>
    <el-table-column align="left" :show-overflow-tooltip="false" prop="file" label="附件" width="70px" min-width="70px" fixed="right">
      <template #default="{row}">
        <IconFile :data="row['template'] || '' " />
      </template>
    </el-table-column>
    <el-table-column align="left" :show-overflow-tooltip="false" label="操作" width="70px" fixed="right">
      <template #default="{row}">
        <Button :type="'text'" @click="clickLook(row)">
          查看
        </Button>
      </template>
    </el-table-column>
    <Dialog :visible="dialogVisible" :width="'688px'" :title="dialogTitle" @close="dialogVisible = false">
      <component :is="componentName" :data="componentData" :task-list="taskList" />
    </Dialog>
  </el-table>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import ElTableStyle from '@/feat/bigScreen/style/table';
import Dialog from '../dialog/index.vue';
import IconFile from '../file/tableCellFile.vue';
import Button from '../button/index.vue';
import TaskMain from '../task/main.vue';
import TaskChild from '../task/child.vue';
import ProcessTimeLine from '../process/taskHandle.vue';
export default {
  name: 'TaskTableDialog',
  components: {
    ProcessTimeLine,
    Dialog,
    IconFile,
    Button,
    TaskMain,
    TaskChild,
  },
  mixins: [ElTableStyle],
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    taskList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      componentData: {},
      componentName: '',
      dialogTitle: '',
    };
  },

  computed: {
  },
  mounted() {},
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
    clickLook(row) {
      this.componentData = row;
      this.dialogVisible = true;
      if (row.parentId) {
        this.dialogTitle = '任务信息';
        this.componentName = 'TaskChild';
      } else {
        this.dialogTitle = '里程碑信息';
        this.componentName = 'TaskMain';
      }
    },

  },
};
</script>
<style  lang="scss">
  .bigScreenTaskTableFileCell{
    > div{
      overflow: initial !important;
    }
  }

</style>
<style lang='scss' scoped>

.hinge{
color: rgb(212, 16, 16);
font-weight: 600;
 font-size:  14px;
 font-style:inherit;
margin-right: 10px;

}
.tag{
  &-p{
    margin: 0;
    margin-bottom: 4px;
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
