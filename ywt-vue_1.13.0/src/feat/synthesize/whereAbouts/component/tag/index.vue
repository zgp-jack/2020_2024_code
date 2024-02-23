<script>
export default {
  name: 'ElTag',
  props: {
    text: String,
    size: String,
    color: String,
  },
  computed: {
    tagSize() {
      return this.size || (this.$ELEMENT || {}).size;
    },
  },
  methods: {
    handleClose(event) {
      event.stopPropagation();
      this.$emit('close', event);
    },
    handleClick(event) {
      this.$emit('click', event);
    },
    hexToRgb(color,) {
      if (!color) {
        color = '#000000';
      }
      // 将16进制颜色转换为RGB格式
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      // 返回RGB格式的颜色值
      return `rgb(${r}, ${g}, ${b},30%)`;
    },

  },
  render(h) {
    const { tagSize, } = this;
    const classes = [
      'el-tag',
      tagSize ? `el-tag--${tagSize}` : ''
      // 'is-hit'
    ];
    const tagEl = (
      <span
        class={ classes }
        style={{ color: this.color || '#000000', backgroundColor: this.hexToRgb(this.color), border: 'none', }}
        on-click={ this.handleClick }>
        { this.$slots.default }
      </span>
    );

    return tagEl;
  },
};
</script>
<style lang="scss" scoped>
.el-tag+.el-tag {
    margin-left: 10px;
}
</style>
