/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-02 16:34:43
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-29 10:29:15
 * @Description: 送修复用
 */
import Moment from 'moment';
import {
  isNil,
  omitBy,
} from 'lodash';
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentUser: this.$store.state.login.userInfo.name,
      currentTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  },
  created() {
    if (this.data.id) {
      this.formData = Object.assign({}, this.formData, omitBy(this.data, isNil));
      this.currentTime = this.formData.createTime;
      this.currentUser = this.formData.createUserToName;
    }
  },
};
