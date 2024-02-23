<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-07 18:59:05
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-18 15:18:20
 * @Description:
-->
<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="header">
        <el-tooltip :content="cardData.title" :disabled="cardData.title.length<10">
          <div class="title" @click="$emit('VIEW',cardData.id)">{{ cardData.title }} </div>
        </el-tooltip>

        <div class="type">分类:{{ cardData.typeToName }}</div>
        <div class="time">{{ cardData.createTime }} - {{ cardData.createUserToName }}</div>
        <i class="el-icon-edit" @click="$emit('UPDATE',cardData.id)">编辑</i>
      </div>
      <div class="content">
        {{ cardData.question }}
      </div>
    </div>
    <div v-if="cardData.attrs" class="attachment">
      <!-- <div class="title base-margin-bottom">附件</div> -->
      <div class="list">
        <pure-attachment-list :list="cardData.attrs" />
        <!-- <div v-for="(item,index) in cardData.attrs" :key="index">
          <div class="item">
            <i class="el-icon-download" />
            <span>{{ item.name }}</span>
          </div>
        </div> -->
      </div>
    </div>
  </el-card>
</template>

<script>
import PureAttachmentList from '@/components/attachment/list';
export default {
  components: {
    PureAttachmentList,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          title: '',
          type: '',
          createTime: '',
          createUser: '',
          question: '',
        };
      },
    },
  },
  data() {
    return {
      cardData: {
        title: '',
        type: '',
        createTime: '',
        createUser: '',
        question: '',
      },
    };
  },
  watch: {
    data: {
      handler(val) {
        this.cardData = Object.assign({}, val);
        this.cardData.attrs = JSON.parse(this.cardData.attrs);
      },
      deep: true,
    },
  },
  created() {
    this.cardData = Object.assign({}, this.data);
    this.cardData.attrs = JSON.parse(this.cardData.attrs);
  },

};
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 0;
  margin:16px 16px 0 16px;
  padding-bottom: 16px;
}
::v-deep .el-card__body {
  padding-bottom: 0px;
}

.header {
  display: flex;
  line-height: 24px;
  .title {
    font-size: 24px;
    font-weight: 400;
    color: #334266;
    width:405px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-right: 45px;
    cursor: pointer;
  }
  .type,.time {
    font-size: 14px;
    color: #7d8db3;
    width: 405px;
  }
}
.content {
  font-size: $--pure-base-font-size;
  color: #334266;
  margin-top: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.attachment {
  font-size: $--pure-base-font-size;
  color: #334266;
  cursor: pointer;
}
.el-icon-edit {
  font-size: $--pure-base-font-size;
  color: #426ED7;
  cursor: pointer;
  line-height: $--pure-base-font-size;
}
</style>
