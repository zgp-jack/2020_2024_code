/**
* @file contactPerson.vue
* @author huang
* @date 2023/10/27
* @description 联系人
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <section>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      size="small"
    >
      <hyy-anchor-item
        v-for="(item,index) in form.contact"
        :key="index"
        :title="`联系人${index+1}`"
      >
        <template #subTitle>
          <el-tag
            v-if="item.state === 1"
            color="rgba(0,102,102,0.08)"
          >
            主要
          </el-tag>
        </template>
        <template #right>
          <div class="align-right">
            <pure-button
              v-if="item.state === 0"
              class="m-r-16"
              label="设为主要人员"
              type="text"
              @click="setMain(index)"
            />
            <i
              v-if="index > 0"
              class="el-icon-delete icon m-r-16"
              @click="delContact(index)"
            />
          </div>
        </template>

        <el-form-item
          :prop="`contact[${index}].name`"
          :rules="rules.name"
          label="姓名"
        >
          <el-input v-model="item.name" />
        </el-form-item>
        <el-form-item
          v-for="(sub, subIndex) in item.phone"
          :key="subIndex"
          :prop="`contact[${index}].phone[${subIndex}]`"
          :rules="[{
            required:true,
            message:'请输入电话',
          }]"
          label="电话"
        >
          <el-col :span="18">
            <el-input
              :value="sub"
              @input="updateOptionContent($event, index,subIndex)"
            />
          </el-col>
          <el-col :span="6">
            <i

              v-if="subIndex > 0"
              class="el-icon-minus  m-l-16"
              @click="delPhone(index,subIndex)"
            />
            <i

              class="el-icon-plus m-l-16"
              @click="addPhone(index)"
            />

          </el-col>
        </el-form-item>

      </hyy-anchor-item>
    </el-form>
    <div class="align-center m-t-16 ">
      <pure-button
        icon="add"
        label="添加联系人"
        size="medium"
        type="minor"
        @click="handleAddContactPerson"
      />
    </div>
  </section>

</template>
<script>
import PureButton from '@/common/components/button/index.vue';
import { isEmpty, } from 'lodash-es';

export default {
  components: { PureButton, },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur', },
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur', },
        ],
      },
      form: {
        contact: [
          {
            name: '',
            // 类型 0默认 1主要
            state: 1,
            phone: [
              '',
            ]
            ,
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    'data': {
      handler(val) {
        console.log(val);
        if (!isEmpty(val)) {
          this.form.contact = [
            ...val,
          ];
        }
      },
    },
    deep: true,
  },
  methods: {
    updateOptionContent(val, index, subIndex) {
      this.$set(this.form.contact[index].phone, subIndex, val);
    },
    // 删除电话
    delPhone(index, subIndex) {
      this.form.contact[index].phone.splice(subIndex, 1);
    },
    // 添加电话
    addPhone(index) {
      this.form.contact[index].phone.push('');
    },
    // 删除联系人
    delContact(index) {
      this.form.contact.splice(index, 1);
    },
    // 添加联系人
    handleAddContactPerson() {
      this.form.contact.push({
        name: '',
        state: 0,
        phone: [
          '',
        ],

      });
    },
    // 设为主要人员
    setMain(theIndex) {
      this.form.contact.forEach((item, index) => {
        if (index === theIndex) {
          item.state = 1;
        } else {
          item.state = 0;
        }
      });
    },
    async submit(cb) {
      let valid = false;
      try {
        valid = await this.$refs.form.validate();
      } catch (err) {
        valid = err;
      }
      return {
        valid,
        form: this.form,
      };
    },
  },
};
</script>
<style lang='scss'
  scoped
>
.icon {
  font-size: 16px;
  color: #ACAFB7
}

.m {
  &-t {
    &-16 {
      margin-top: 16px;
    }
  }

  &-r {
    &-16 {
      margin-right: 16px;
    }
  }

  &-l {
    &-16 {
      margin-left: 16px;
    }
  }
}

</style>

