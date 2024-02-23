<!--  -->
<template>
  <ul class="hyy-ul">
    <li class="hyy-ul-li-title">
      {{ info.title }}
    </li>
    <li class="hyy-ul-li-info">
      可容纳:{{ info.userNum }}人
      <div v-if="showBadge" class="badge">
        <span> 约满 </span>
      </div>
    </li>
    <li class="hyy-ul-li-info">配置:{{ info.config }}</li>
  </ul>
</template>

<script>
export default {
  name: 'First',
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    showBadge() {
      return !!this.info.flag;
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.hyy-ul {
  padding: 0;
  margin: 0 24px;
  list-style: none;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  > li {
    margin-top: 12px;
    letter-spacing: 1px;
  }
  &-li {
    &-title {
      font-size: 14px;
      // font-weight: 600;
      text-align: left;
      color: #ffffff;
    }
    &-info {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #c0c4cc;
      white-space: 1px;
      position: relative;
      > .badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 36px;
        height: 18px;
        background: rgba(245, 108, 108, 0.2);
        border: 1px solid rgba(245, 108, 108, 0.5);
        border-radius: 2px;
        text-align: center;
        line-height: 14px;
        > span {
          font-size: 14px;
          font-weight: 400;
          color: #f56c6c;
        }
      }
    }
  }
}
</style>
