<template>
  <div class="comp-group-manage">
    <div class="group-box">
      <div class="group-box-search-box">
        <el-input v-model="searchKey" placeholder="查询小组" prefix-icon="el-icon-search" class="search-input" clearable />
        <div style="width: 200px">
          <pure-button v-auth="'system:team:add'" type="special" label="新增小组" icon="add" @click="onAdd" />
        </div>
      </div>
      <div
        v-for="item in showTeamList"
        :key="item.id"
        class="group-item"
        :class="{active: currentTeam && currentTeam.id === item.id}"
        @click="onChangeGroup(item)"
      >
        <span>{{ item.teamName }}</span>
        <div class="operate-box">
          <i v-auth="'system:team:edit'" class="el-icon-edit" @click="onEdit(item)" />
          <i v-auth="'system:team:remove'" class="el-icon-delete" @click="onDel(item.id)" />
        </div>
      </div>
    </div>
    <custom-dialog :title="dialogTitle" width="600px" :visible.sync="showAddEditDialog" @closed="onDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-suffix=":">
        <el-form-item label="小组名称" prop="teamName">
          <el-input
            v-model="formData.teamName"
            placeholder="请输入小组名称"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="管理科室" prop="deptId">
          <dept-select v-model="formData.deptId" placeholder="请选择管理科室" />
        </el-form-item>
        <el-form-item label="小组事务" prop="teamBusiness">
          <el-input
            v-model="formData.teamBusiness"
            placeholder="请输入小组事务"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

      </el-form>
      <template v-slot:footer>
        <pure-button :label="saveBtnText" @click="onSave" />
        <pure-button label="取消" type="patch" @click="showAddEditDialog = false" />
      </template>
    </custom-dialog>
  </div>
</template>

<script>
import { getTeamList, addTeam, editTeam, delTeam, } from '../api';
import DeptSelect from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
export default {
  components: {
    DeptSelect,
  },
  data() {
    return {
      searchKey: '',
      teamList: [],
      currentTeam: null,
      operateType: 'add',
      showAddEditDialog: false,
      formData: {},
      rules: {
        teamName: [
          { required: true, message: '请输入小组名称', },
          { max: 30, message: '小组名称长度不超过30字符', },
        ],
        deptId: [
          { required: true, message: '请选择管理科室', },
        ],
        teamBusiness: [
          { max: 200, message: '小组事务长度不超过200字符', },
        ],
      },
    };
  },
  computed: {
    showTeamList() {
      return this.teamList.filter(item => item.teamName.includes(this.searchKey));
    },
    dialogTitle() {
      return this.operateType === 'edit' ? '编辑小组' : '新增小组';
    },
    saveBtnText() {
      return this.operateType === 'edit' ? '确认修改' : '确认';
    },
  },
  watch: {
    currentTeam: {
      handler(newTeam) {
        if (newTeam) {
          this.$emit('teamChange', newTeam.id);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      const loading = this.showLoading();
      getTeamList().then((data) => {
        const { rows, } = data;
        if (rows && rows.length) {
          this.teamList = rows;
          this.currentTeam = rows[0];
        }
      }).finally(() => {
        loading.close();
      });
    },
    onChangeGroup(data) {
      this.currentTeam = data;
    },
    onAdd() {
      this.operateType = 'add';
      this.showAddEditDialog = true;
    },
    onEdit(data) {
      this.operateType = 'edit';
      const { id, teamName, teamBusiness, deptId, } = data;
      this.formData = {
        id,
        teamName,
        teamBusiness,
        deptId,

      };
      this.showAddEditDialog = true;
    },
    onDialogClosed() {
      this.formData = {};
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    submitData() {
      this.loading = true;
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const request = this.operateType === 'edit' ? editTeam : addTeam;
          request(this.formData)
            .then(() => {
              this.$message.success('操作成功');
              this.getListData();
              this.showAddEditDialog = false;
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          this.$message.error('请正确填写');
        }
      });
    },
    onSave() {
      this.submitData();
    },
    sumbitDelete(ids) {
      const loading = this.showLoading({ text: '操作中...', });
      delTeam(ids.join())
        .then(() => {
          this.getListData();
          this.$message({
            type: 'success',
            message: '删除小组成功',
          });
        })
        .finally(() => {
          loading.close();
        });
    },
    onDel(id) {
      this.$confirm('确认删除该小组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.sumbitDelete([
            id,
          ]);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.group-box {
  .group-box-search-box {
    display: flex;
    margin-bottom: 16px;
    .search-input {
      margin-right: 16px;
    }
  }
  .group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 34px;
    line-height: 34px;
    padding: 0 16px;
    font-size: 14px;
    cursor: pointer;
    &.active {
      color: #006666;
      background: #F0F8F8;
    }
    .operate-box {
      display: none;
      [class^='el-icon-'] {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    &:hover {
      .operate-box {
        display: block;
      }
    }
  }
}
</style>
