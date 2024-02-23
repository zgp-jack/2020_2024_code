<template>
  <div>

    <!-- 项目看板的ITBP 任务操作 -->
    <template v-if="IsProjectBoardITBP">
      <el-button
        v-if="!data.quoteId"
        type="text"
        @click="onHandelOption('edit')"
      >
        编辑
      </el-button>
      <el-button
        v-if="!data.quoteId"
        type="text"
        @click="onHandelOption('del')"
      >
        删除
      </el-button>
      <el-button
        type="text"
        @click="onHandelOption('add')"
      >
        {{ data.parentId ?'添加子任务':'添加任务' }}
      </el-button>
    </template>
    <template v-else>

      <!-- 变更 + 编辑状态 -->
      <template v-if="ControlChangeOrUpdateStateButtonShow">
        <template v-if="!data.quoteId">
          <el-button
            v-if="[data.principal,data.createUser].indexOf(UserId) > -1 || IsLoader"
            type="text"
            @click="onHandelOption('edit')"
          >
            编辑
          </el-button>
        </template>

        <template v-if="HiddenDelButton">
          <template v-if="!data.quoteId">
            <el-button
              v-if="[data.principal,data.createUser].indexOf(UserId) > -1 || IsLoader "
              type="text"
              @click="onHandelOption('del')"
            >
              删除
            </el-button>
          </template>
        </template>

        <el-button
          v-if="[data.principal,data.createUser,data.userIds].indexOf(UserId) > -1 || IsJoinUser || IsLoader"
          type="text"
          @click="onHandelOption('add')"
        >
          {{ data.parentId ?'添加子任务':'添加任务' }}
        </el-button>
      </template>
      <!-- 处理状态 -->
      <template v-if="ControlHandleStateButtonShow">
        <template v-if="!data.quoteId&&data.tempId !== 1 && data.parentId && data.isAct === 1">
          <el-button
            :disabled="data.userIds | isMy(data.principal)"
            type="text"
            @click="onHandelOption('handle')"
          >
            处理
          </el-button>
        </template>
        <template v-else-if="!data.quoteId && data.tempId !== 1 && data.parentId && data.totalProgress === 100">
          <el-button
            :disabled="data.userIds | isMy(data.principal)"
            type="text"
            @click="onHandelOption('append')"
          >补充
          </el-button>
        </template>
      </template>
      <!-- 确认结果 -->
      <template v-if="ControlSupplementStateButtonShow">
        <template v-if="data.quoteId !== 1 && data.tempId !== 1 && data.parentId && data.totalProgress === 100">
          <el-button
            :disabled="data.userIds | isMy(data.principal)"
            type="text"
            @click="onHandelOption('append')"
          >补充
          </el-button>
        </template>
      </template>
    </template>

  </div>
</template>

<script>
import { mapGetters, } from 'vuex';
import { stringToArray, } from '@/utils/common';
import store from '@/store';
export default {
  filters: {
    isMy(users, pri) {
      const allUsers = stringToArray(users + ',' + pri, ',', false);
      const me = store.state.login.userInfo.id.toString();
      return !allUsers.includes(me);
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    params: {
      type: Object,
      default: () => {},
    },
    // code : change / handle / append / confirm / update / check

    code: {
      type: String,
      default: '',
    },
    isProjectBoard: Boolean,
  },
  computed: {
    ...mapGetters(['userInfo']),
    UserId() {
      return this.userInfo.id;
    },
    IsJoinUser() {
      return this.params?.joinUser?.includes(this.UserId);
    },
    IsLoader() {
      return [this.params?.principal || '', this.params?.createUser].includes(this.UserId);
    },
    ControlChangeOrUpdateStateButtonShow() {
      return ['change', 'update'].includes(this.code);
    },
    ControlHandleStateButtonShow() {
      return ['handle'].includes(this.code);
    },
    ControlSupplementStateButtonShow() {
      return ['append'].includes(this.code);
    },
    HiddenDelButton() {
    // <!-- 变更状态下，没有删除 -->
      return !(this.code === 'change');
    },
    MyPermissions() {
      return this.userInfo.permissions || [];
    },
    // 项目看板的任务编辑 , ITBP 可以添加 删除，编辑

    IsProjectBoardITBP() {
      if (this.isProjectBoard) {
        return this.MyPermissions.includes('ITBP_MANAGER');
      }
      return false;
    },
  },
  methods: {
    onHandelOption(code) {
      this.$emit('click', {
        code,
        data: this.data,
      });
    },
  },
};
</script>

<style>

</style>
