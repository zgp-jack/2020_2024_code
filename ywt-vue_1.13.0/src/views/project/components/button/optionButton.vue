<template>
  <div>
    <el-button v-for="item in Buttons" :key="item.code" size="mini" type="text" @click="onEmit(item)">
      {{ item.name }}
    </el-button>

    <el-dropdown v-if="DownItemButtons.length" style="margin-left:10px" @command="onEmit">
      <el-button size="mini" type="text">
        更多
        <i class="el-icon-arrow-down " />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="sub in DownItemButtons" :key="sub.code" :command="sub">
          {{ sub.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>

</template>

<script>
export default {
  props: {
    buttonList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    Buttons() {
      if (this.buttonList.length <= 3) {
        return this.buttonList;
      } else {
        return this.buttonList.slice(0, 2);
      }
    },
    DownItemButtons() {
      if (this.buttonList.length > 3) {
        return this.buttonList.slice(2);
      }
      return [];
    },
  },
  methods: {
    onEmit(emitData) {
      this.$emit('click', emitData.code);
    },
  },
};
</script>

<style>

</style>
