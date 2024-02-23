<template>
  <el-input
    v-model="formattedValue"
    v-money="{precision, decimal, thousands, prefix, suffix}"
    style="width:100%"
    :disabled="disabled"
    :placeholder="placeholder"
    @input="inputChange"
  />
</template>

<script>
import money from './directive';
import defaults from './options';
import { format, unformat, } from './utils';

export default {
  name: 'CashInput',
  directives: { money, },
  props: {
    value: {
      required: true,
      type: [Number, String],
      default: 0,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    masked: {
      type: Boolean,
      default: false,
    },
    precision: {
      type: Number,
      default: () => defaults.precision,
    },
    decimal: {
      type: String,
      default: () => defaults.decimal,
    },
    thousands: {
      type: String,
      default: () => defaults.thousands,
    },
    prefix: {
      type: String,
      default: () => defaults.prefix,
    },
    suffix: {
      type: String,
      default: () => defaults.suffix,
    },
  },

  data() {
    return {
      formattedValue: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, oldValue) {
        var formatted = format(newValue, this.$props);
        if (formatted !== this.formattedValue) {
          this.formattedValue = formatted;
        }
      },
    },
  },

  methods: {
    inputChange(value) {
      if (this.masked) {
        this.$emit('input', value);
      } else {
        this.$emit('input', unformat(value, this.precision));
      }
    },
  },
};
</script>
