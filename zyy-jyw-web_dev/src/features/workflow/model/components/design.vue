<template>
  <div :style="'display: flex; height:' + height">
    <div class="my-process-designer">
      <div class="my-designer-header">
        <el-button-group key="file-control">
          <el-button type="primary" icon="el-icon-edit-outline" @click="onSave">保存流程</el-button>
        </el-button-group>
      </div>
      <div class="my-process-designer__container">
        <div ref="canvas" class="my-process-designer__canvas" />
      </div>
    </div>
  </div>
</template>

<script>
// --加载
import BpmnModeler from 'bpmn-js/lib/Modeler';
// 汉化文件
import customTranslate from '@/plugins/CustomTranslate';

export default {
  name: 'Designer',
  props: {
    bpmnXml: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 120 + 'px;',
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlString: this.bpmnXml,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const canvas = this.$refs.canvas;
      const customTranslateModule = {
        translate: ['value', customTranslate,
        ],
      };
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        additionalModules: [
          customTranslateModule,
        ],
      });
      this.createNewDiagram(this.xmlString);
    },
    createNewDiagram(xml) {
      try {
        const newId = `Process_${new Date().getTime()}`;
        const newName = `业务流程_${new Date().getTime()}`;
        const xmlStr = xml || this.getXmlString(newId, newName);
        this.bpmnModeler.importXML(xmlStr);
      } catch (err) {
        console.log(err.message, err.warnings);
      }
    },
    /* 保存流程 */
    onSave() {
      this.bpmnModeler.saveXML({ format: true, }).then(res => {
        this.$emit('save', res.xml);
      });
    },
    getXmlString(key, name) {
      return `
    <?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
      xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
      xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
      id="diagram_${key}"
      targetNamespace="http://flowable.org/bpmn">
      <bpmn2:process id="${key}" name="${name}" isExecutable="true">
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn2:definitions>
  `;
    },
  },
};
</script>
<style scoped>
.my-designer-header {
  width: 100%;
  min-height: 36px;
}

.my-process-designer {
  padding: 5px 0 10px 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .my-process-designer__container {
    display: inline-flex;
    width: 100%;
    flex: 1;

    .my-process-designer__canvas {
      flex: 1;
      width: 100%;
      height: 100%;
      position: relative;
      background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+") repeat !important;

      div.toggle-mode {
        display: none;
      }
    }

    svg {
      width: 100%;
      height: 100%;
      min-height: 100%;
      overflow: hidden;
      visibility: hidden;
    }
  }
}

</style>
