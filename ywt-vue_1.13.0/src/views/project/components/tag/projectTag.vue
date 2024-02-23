<template>
  <div>
    <div class="tag" :class="TagClass">
      {{ data.projectLevel | projectLevel |replaceText }}
    </div>
    {{ data.title }}
  </div>
</template>

<script>
export default {
  filters: {
    replaceText(val) {
      return val.replace('级', '');
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    TagClass() {
      const level = Number(this.data.projectLevel);
      let tagClass = 'tag-';
      if (level === 1) {
        tagClass += 'S';
      } else if (level === 2) {
        tagClass += 'M';
      } else {
        tagClass += 'L';
      }
      return tagClass;
    },
  },
};
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  width: 26px;
  height: 26px;
  text-align: center;
  line-height: 26px;
  border-radius: 4px;
  font-weight: 400;
  font-size: 18px;
}
.tag-S {
  background: #ffeded;
  color: #f26161;
}
.tag-M {
  background: #faf2e3;
  color: #e6ac39;
}
.tag-L {
  background: #e6effc;
  color: #4574e6;
}
</style>
