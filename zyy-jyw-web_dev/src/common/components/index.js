import PureButton from './button';
import PureTable from './table';
import PureAudio from './audio';
import PureUpload from './upload';
import PureRetrieval from './retrieval';
import PureMoreButton from './button/moreButton';
import PurePanelCard from './panelCard';
import PureTimeline from './timeline/main.vue';
import PureTimelineItem from './timeline/item.vue';
import PureDialogTemplate from './dialog/template.vue';
import PureTypeText from './typeText';
import TableLayout from './tableLayout';
import FormBox from './formBox';
import CustomDrawer from './customDrawer';
import CustomDialog from './customDialog';
import PureAttachmentList from './attachmentList';
import PureTag from './tag';
import HyySubLabelText from './subLabelText';
import HyyAnchor from './anchor';
import HyyAnchorItem from './anchor-item';
import HyyStateText from './stateText/index.vue';
import HyyViewLayout from '../layout/viewLayout.vue';

const components = {
  PureButton,
  PureAudio,
  PureTable,
  PureUpload,
  PureRetrieval,
  PureMoreButton,
  PurePanelCard,
  PureTimeline,
  PureTimelineItem,
  PureDialogTemplate,
  PureTypeText,
  TableLayout,
  FormBox,
  CustomDrawer,
  CustomDialog,
  PureAttachmentList,
  PureTag,
  HyySubLabelText,
  HyyAnchor,
  HyyAnchorItem,
  HyyStateText,
  HyyViewLayout,
};
export default {
  install: (vue, opt) => {
    for (const i in components) {
      vue.component(i, components[i]);
    }
  },
};
