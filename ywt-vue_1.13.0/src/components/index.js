import PDialog from './PDialog/index.vue';
import Panel from '@/views/project/components/panel/index.vue';
import Upload from './upload/index.vue';
import DeparmetSelect from './select/departmentSelect.vue';
import Audio from './audio/audio.vue';
import SourceRadio from './radio/sourceRadio.vue';
import EngineerSelect from './select/engineerSelect.vue';
import FaultTyupeSelect from './select/faultTypeSelect.vue';
import DegreeRadio from './radio/degreeRadio.vue';
import RangeRadio from './radio/rangeRadio.vue';
import ResponseRadio from './radio/responseRadio.vue';
import CaretButton from './button/caretButton.vue';
const compoents = {
  PDialog,
  Panel,
  Upload,
  DeparmetSelect,
  Audio,
  SourceRadio,
  EngineerSelect,
  FaultTyupeSelect,
  DegreeRadio,
  RangeRadio,
  ResponseRadio,
  CaretButton,
};

export default {
  install: (vue, opt) => {
    for (const i in compoents) {
      vue.component('JYW' + i, compoents[i]);
    }
  },
};
