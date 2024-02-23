<template>
  <ul class="file-wrapper">

    <li v-for="(item,key) in FileList" :key="key" class="file-item" @click="downLoad(fileBaseUrl+item.url,item.name)">
      <i class="el-icon-folder icon" />
      <span class="file-item-name">
        {{ item.name }}
      </span>
    </li>
  </ul>
</template>

<script>
import { mapGetters, } from 'vuex';
import downLoadFile from '@/utils/downLoad';
export default {
  name: 'FileList',
  props: {
    data: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  computed: {
    ...mapGetters(['fileBaseUrl']),
    FileList() {
      const value = this.data ? JSON.parse(this.data) : [];
      return value;
    },
  },
  methods: {
    downLoad: downLoadFile,
  },
};
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  > li {
    list-style: none;
  }
}
.file {
  &-wrapper {
  }
  &-item {
    height: 32px;
    line-height: 32px;
    margin-bottom: 12px;
    padding-left: 10px;
    color:#fff;
    border-radius: 4px;
    overflow: hidden;
    &:hover{
      cursor: pointer;
      background:rgba(255,255,255,0.2) ;
      color:rgba(24,144,255,1)
    }
    > .icon {
      // color: #fff;
      font-size: 16px;
    }
    &-name {
      display: inline-block;
      margin-left: 8px;
      font-size: 18px;
      font-weight: 400;
      // color: #ffffff;
    }
  }
}
</style>
