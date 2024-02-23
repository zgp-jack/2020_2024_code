<!--
    用于展示附件列表
 -->
<template>
  <el-container>
    <el-main>
      <div class="attachament_container">
        <div v-for="(v, i) in attachment" :key="i" class="attachament">
          <div class="attachament_wrapper">
            <div class="attachament_head">
              <template v-if="isImg(v.suffix)">
                <el-image
                  style="width: 100%; height: 100%"
                  :src="v.url"
                  fit="cover"
                  :preview-src-list="[v.url]"
                  :z-index="7000"
                />
              </template>
              <template v-else>
                <span> {{ v.suffix }} </span>
              </template>
            </div>
            <div class="attachament_body">
              <div>
                <img
                  :src="iconDown"
                  width="20px"
                  height="20px"
                  :alt="v.name"
                  @click="downLoad(v.url, v.name)"
                >
              </div>
            </div>
          </div>

          <div class="attachment_footer">
            <el-tooltip effect="dark" :content="v.name" placement="bottom">
              <span>{{ v.name }}</span>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer class="el-footer-tag" height="auto">
      <el-button size="mini" type="primary" @click="close"> 关闭 </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { stringifyToArr, } from '@/filters';
import { mapState, } from 'vuex';
export default {
  name: 'Attachment',
  props: {
    data: {
      type: String,
      default: JSON.stringify([]),
    },
  },
  data() {
    return {
      loading: null,
      iconDown: require('@/assets/project/icons/down.png'),
    };
  },
  computed: {
    formatter() {
      return stringifyToArr(this.data);
    },
    ...mapState('login/index', {
      baseUrl: (v) => {
        return v['uriConfig'].fileBaseUri;
      },
    }),
    attachment() {
      const val = [];
      const suffix_reg = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      for (const i of this.formatter) {
        val.push({
          name: i.name.replace(suffix_reg, ''),
          suffix: i.name.match(suffix_reg)[1],
          url: this.baseUrl + i.url,
        });
      }
      return val;
    },
  },
  methods: {
    close() {
      this.$emit('done');
    },
    isImg(fix) {
      const imgReg = /(JPG|PNG|GIF|JPEG)/i;
      return imgReg.test(fix);
    },
    downLoad(url, filename) {
      const self = this;
      self.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      self.getBlob(url, function (blob) {
        self.saveAs(blob, filename);
      });
    },

    getBlob(url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (xhr.status === 200) {
          cb(xhr.response);
        }
      };
      xhr.send();
    },

    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement('a');

        var body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);

        link.download = filename;

        // fix Firefox

        link.style.display = 'none';

        body.appendChild(link);

        link.click();

        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
      }
      this.loading.close();
    },
  },
};
</script>
<style lang='scss' scoped>
.el-footer-tag {
  padding: 0;
  text-align: right;
}
.attachament_container {
  display: flex;
  flex-direction: row;
  .attachament {
    width: 127px;
    display: flex;
    flex-direction: column;
    margin: 0 0 20px 20px;
    > .attachament_wrapper {
      background: #d7e5f9;
      overflow: hidden;
      border-radius: 4px;
      height: 135px;
      position: relative;

      > .attachament_head {
        height: 100%;
        text-align: center;
        line-height: 108px;
        > span {
          display: inline-block;
          // transform: scale(2.7);
          font-weight: 600;
          color: #1890ff;
        }
        > .attachment_head--img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      }
      > .attachament_body {
        height: 27px;
        background-color: rgba(96, 155, 239, 0.6);
        // text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        > div {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          > img {
            cursor: pointer;
          }
        }
      }
    }
    > .attachment_footer {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-align: center;
      margin-top: 6px;
      color: #575757;
      font-size: 14px;
    }
  }
}
</style>
