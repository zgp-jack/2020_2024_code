<template>
  <div>
    <div v-for="(item,index) in assistList" :key="index">
      <pure-panel-card class="panel-card" style="padding-bottom: 16px">
        <div slot="header">
          协助信息{{ index + 1 }}
        </div>
        <div slot="subHeader">
          <span class="createTime">
            发起协作时间:
            <span>{{ item.createTime }}</span>
          </span>
        </div>
        <el-descriptions
          :column="2"
          border
          :colon="false"
        >
          <el-descriptions-item label="发起协作人">
            {{ item.createUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="电话">
            {{ item.createUserPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="协作说明" :span="2">
            {{ item.assistRemark }}
          </el-descriptions-item>
          <el-descriptions-item label="公共附件" :span="2">
            <pure-attachment-list :list="item.commonFile" />
          </el-descriptions-item>
          <template v-for="(child,index) in item.subList">
            <el-descriptions-item :key="index+1" :label="'协作人'+(index+1)">
              {{ child.sendUserName }}
            </el-descriptions-item>
            <el-descriptions-item :key="index+1" label="处理情况">
              {{ child.currStateToName }}
            </el-descriptions-item>
            <el-descriptions-item :key="index+1" label="协作事务" :span="2">
              {{ child.assistContent }}
            </el-descriptions-item>
            <el-descriptions-item :key="index+1" label="附件" :span="2">
              <pure-attachment-list :list="child.assistEnclosureList" />
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </pure-panel-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      assistList: [],
    };
  },
  watch: {
    data: {
      handler: function (val) {
        if (val.assistList) {
          this.assistList = val.assistList;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
