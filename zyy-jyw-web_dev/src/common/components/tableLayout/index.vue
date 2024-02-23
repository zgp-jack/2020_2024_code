<template>
  <div class="table-layout-container" :class="{'no-padding': noPadding}">
    <div class="top-box" :class="{'bg-white': isTopBg}">
      <div v-if="$slots.search" class="search-box">
        <slot name="search" />
      </div>
      <div v-if="$slots.operate" class="operate-box">
        <slot name="operate" />
      </div>
    </div>
    <div class="main-box" :class="{'bg-white': isContentBg}">
      <slot />
    </div>
    <div v-if="$slots.footer" class="footer-box" :class="{'bg-white': isContentBg}">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableLayout',
  props: {
    noPadding: {
      type: Boolean,
      default: false,
    },
    isTopBg: {
      type: Boolean,
      default: false,
    },
    isContentBg: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
 @import "~@/common/styles/theme/handle.scss";
.table-layout-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  padding: 16px;
  &.no-paddding {
    padding: 0;
  }
  .bg-white {
    background: #fff;
  }
  .top-box {
    flex: none;
    display: flex;
    justify-content: space-between;
    .search-box {
      flex: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      .search-item {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .operate-box {
      flex: none;
      margin-left: 20px;
    }
  }
  .main-box {
    flex: auto;
    overflow: hidden;
    min-height: 100px;
    ::v-deep {
      .operate-btn {
        margin-right: 16px;
        font-size: 14px;
        color: #006666;
        cursor: pointer;
        &.delete {
          color: #ff836b;
        }
      }
      .more-operate {
        font-size: 14px;
        color: #006666;
        cursor: pointer;
      }
    }
  }
  .footer-box {
    flex: none;
    margin-top: 16px;
  }
  .table-footer {
    flex: none;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding: 12px 20px;
    .operate-box {
      flex: none;
      display: flex;
      align-items: center;
      .operate-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 34px;
        margin-right: 10px;
        padding: 0 10px;
        border: 1px solid #757e7e;
        border-radius: 4px;
        font-size: 14px;
        color: #757e7e;
        cursor: pointer;
        [class^='el-icon-'] {
          margin-right: 6px;
        }
      }
      .checked-num {
        color: #799f9f;
      }
    }
  }
  ::v-deep{
    .el-table {
      thead {
        @include font_color_imp('color-assist-gray');
        // font-size: 16px;
        th.el-table__cell {
            @include background_color_imp('color-assist-4');
        }
      }
    }
    .el-pagination {
      padding:16px 0;
      &.is-background {
        .el-pager li {
          @include background_color_imp('color-white');
          @include border_color_imp('color-text-placeholder');
          @include font_color_imp('color-text-placeholder');
          border: 1px solid;
          border-radius: 4px;
        }
        .el-pager li:not(.disabled) {
          &.active {
            @include background_color_imp('color-primary');
        }

      }
      }
    }
  }
}
</style>
