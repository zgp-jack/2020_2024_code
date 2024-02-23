<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-01 21:45:32
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-17 17:15:39
 * @Description: 修改排班人员
-->
<template>
  <el-form
    ref="form"
    label-width="120px"
    label-position="right"
    size="mini"
    :model="formData"
  >
    <template v-for="hospital in hospitalList">
      <el-form-item
        :key="hospital.id"
        label-width="0px"
        class="form-item-wrapper"
      >
        <el-col :span="8">
          <el-form-item label=" " label-width="50px">
            <el-checkbox v-model="hospital.checked">{{ hospital.name }}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            v-if="hospital.checked"
            label="值班人员"
          >
            <engineer-draggable-select v-model="hospital.user" draggable multiple />
          </el-form-item>
        </el-col>
      </el-form-item>
    </template>
    <el-row>
      <el-col :span="24" style="text-align:right">
        <el-button size="mini" type="primary" @click="handleSaveScheduleUser">保存</el-button>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>
import DepartmentApi from '@/apis/system/department';
import EngineerDraggableSelect from '@/feat/system/user/component/v2/engineerDraggableSelect.vue';
export default {
  components: {
    EngineerDraggableSelect,
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      formData: {},
      hospitalList: [],
    };
  },
  async created() {
    await this.fetchHospitalList();
    this.data.map(item => {
      this.hospitalList = this.hospitalList.map(innerItem => {
        if (item.hospital === innerItem.id) {
          innerItem.checked = true;
          innerItem.user = item.user;
        }
        return innerItem;
      });
    });
  },
  methods: {
    async handleSaveScheduleUser() {
      try {
        const data = this.hospitalList.filter(item => item.checked)
          .map(item => {
            if (!item.user) {
              throw new Error('请为选中院区添加值班人员');
            }
            return {
              hospital: item.id,
              user: item.user,
            };
          });
        this.$emit('done', data);
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async fetchHospitalList() {
      try {
        const { list, } = await DepartmentApi.list({ deptType: 1, state: 1, });
        this.hospitalList = list.map(item => {
          return { id: item.id, name: item.deptName, checked: false, user: '', };
        });
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
}
</style>
