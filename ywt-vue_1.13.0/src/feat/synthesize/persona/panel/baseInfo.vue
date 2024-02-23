<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-02 10:22:03
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-21 17:06:50
 * @Description: 人员画像基本信息面板
-->
<template>
  <pure-card class="max-height pure" :disabled="!editing">
    <div slot="header">
      基本信息
    </div>
    <el-form
      label-position="right"
      label-width="90px"
      size="mini"
      :disabled="!editing"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="姓名">
            <el-input
              ref="engineerInput"
              v-model="formData.name"
              :disabled="operatorType!=='CREATE'"
              @focus="onEngineerInputFocus"
            />
          </el-form-item>
          <el-form-item label="学历">
            <dic-select v-model="formData.education" dic-key="user_education" type="string" />
          </el-form-item>
          <el-form-item label="科室">
            <department-cascader v-model="formData.deptId" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label-width="10px">
            <el-radio-group v-model="formData.gender" size="small">
              <el-radio-button label="1"><i class="el-icon-male" /></el-radio-button>
              <el-radio-button label="2"><i class="el-icon-female" /></el-radio-button>
            </el-radio-group>
          </el-form-item>

        </el-col>
        <el-col :span="5">
          <el-form-item label="出生日期">
            <el-date-picker
              v-model="formData.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="出生日期"
              class="w-100-i"
            />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="formData.phone" />
          </el-form-item>
          <el-form-item label="运维小组">
            <group-select v-model="formData.teamId" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="籍贯">
            <el-input v-model="formData.nativePlace" />
          </el-form-item>
          <el-form-item label="入职日期">
            <el-date-picker
              v-model="formData.workDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="入职日期"
              class="w-100-i"
            />
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="formData.position" />
          </el-form-item>
        </el-col>
        <el-col :span="5" class="flex">
          <div class="desc base-margin-right">
            <div class="title base-margin-bottom">照片上传</div>
            <span class="detail">
              请上传一寸照片 格式为jpg或png
            </span>
          </div>
          <avatar
            v-model="show"
            field="file"
            :width="128"
            :height="170"
            url="api/busLocalFile/upload"
            :headers="headers"
            :no-circle="true"
            img-format="png"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
          />
          <div class="avatar" @click="toggleShow">
            <i class="el-icon-plus avatar-uploader-icon" />
            <span class="text">上传照片</span>
            <img v-if="formData.photoAddr" :src="$store.state.login.uriConfig.fileBaseUri+formData.photoAddr">
            <i v-if="formData.photoAddr&&editing" class="el-icon-edit-outline avatar-edit" />
          </div>

        </el-col>
      </el-row>

    </el-form>
    <el-row>
      <el-col>
        <pure-button
          v-if="saveBtnVisible"
          label="保存"
          @click="onSubmit"
        />
        <pure-button
          v-if="editBtnVisible"
          label="编辑"
          @click="editing=true"
        />

      </el-col>
    </el-row>
    <empty-row />
  </pure-card>
</template>

<script>
import PersonaApi from '../api';
import GroupSelect from '@/feat/system/group/component/groupSelect';
import EmptyRow from '@/components/emptyRow.vue';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader';
import Avatar from 'vue-image-crop-upload/upload-2.vue';
export default {
  name: 'PersonaBaseInfoPanel',
  components: {
    GroupSelect,
    EmptyRow,
    DicSelect,
    DepartmentCascader,
    Avatar,
  },
  props: {
    operatorType: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      show: false,
      headers: {
        token: this.$store.state.login.accessToken,
      },
      editing: false,
      formData: {
        // 用户id
        userId: null,
        // 姓名 只用于显示
        name: null,
        // 性别
        gender: '1',
        // 出生日期
        birthday: null,
        // 籍贯
        nativePlace: null,
        // 学历
        education: null,
        // 职位
        position: null,
        // 入职日期
        workDate: null,
        // 头像地址
        photoAddr: '',
        // 个人信息id
        id: null,
      },
    };
  },
  computed: {
    editBtnVisible() {
      let result = true;
      if (this.editing) {
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    saveBtnVisible() {
      let result = true;
      if (this.operatorType === 'CREATE') {
        result = true;
      } else {
        result = false;
      }
      if (this.editing) {
        result = true;
      } else {
        result = false;
      }
      return result;
    },
  },
  async created() {
    if (this.id) {
      const data = await PersonaApi.baseInfoDetail(this.id);
      this.formData = Object.assign({}, this.formData, data);
    } else {
      this.editing = true;
    }
  },
  methods: {
    onEngineerInputFocus() {
      this.$refs.engineerInput.blur();
      this.$innerDrawer({
        width: '548px',
        component: () => <EngineerPanel showOrder={false} teamDisabled={true} showDuty={false} onDone={this.onSelectedEngineer} />,
      });
    },
    async onSubmit() {
      try {
        if (this.operatorType === 'UPDATE') {
          await PersonaApi.updateBaseInfo({ ...this.formData, id: this.id, });
        } else {
          const id = await PersonaApi.createBaseInfo(this.formData);
          this.$emit('createdBaseInfo', id);
        }
        this.$message.success('保存成功');
        // 操作成功后需要发事件告知列表页面刷新，并且不关闭弹窗
        this.$emit('refresh');
        this.editing = false;
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async onSelectedEngineer(engineerData) {
      try {
        this.$refs.engineerInput.blur();
        console.log(engineerData);
        this.formData.name = engineerData.name;
        const data = await PersonaApi.engineerDetail(engineerData.engineerId);
        const omittedNullData = Object.keys(data)
          .filter((key) => data[key] !== null && data[key] !== undefined)
          .reduce((acc, key) => ({ ...acc, [key]: data[key], }), {});
        this.formData = Object.assign({}, this.formData, omittedNullData);
        this.$refs.engineerInput.blur();
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        });
      }
    },
    toggleShow() {
      if (!this.editing) {
        return;
      }
      this.show = !this.show;
    },
    /**
			 * upload success
			 *
			 * [param] jsonData   服务器返回数据，已进行json转码
			 * [param] field
			 */
    cropUploadSuccess(res, field) {
      if (res.code === 0) {
        this.formData.photoAddr = `${res.body.path}/${res.body.fileName}`;
      } else {
        this.$message({
          type: 'error',
          message: '头像上传失败',
        });
      }
    },
    /**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
    cropUploadFail(status, field) {
      this.$message({
        type: 'error',
        message: '头像上传失败',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pure {
.avatar {
  width: 96px;
  height: 128px;
  position: relative;
  margin-left: auto;
   cursor: pointer;
  .text {
    position: absolute;
    left: 1px;
    width: 96px;
    text-align: center;
    opacity: 0.5;
    font-size: 16px;
    color: #7d8db3;
    bottom: 40px;
  }
  img {
    width: 96px;
    height: 128px;
    position: absolute;
    left: 0px;
  }
}
.avatar-uploader-icon, .avatar-edit {
  font-size: 13px;
  color: #8c939d;
  width: 96px;
  height: 128px;
  line-height: 128px;
  text-align: center;
  position: absolute;
  border: 1px dashed #d9d9d9;
}
.avatar-edit {
  opacity: 0;
  background-color: rgba(0,0,0,.5);
  &:hover {
    opacity: 1;
    color: #fff;
  }
}
.desc {
  width: 154px;
  text-align: right;
  .title {
    font-size: 18px;
    color: #7d8db3;
  }
  .detail {
    color: #334266;
    opacity: 0.4;
    font-size: 14px;
  }
}
}

</style>
