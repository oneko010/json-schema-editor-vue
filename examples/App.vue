<template>
  <div id="app">
    <div class="title">   
      <a href="https://github.com/zyqwst/json-schema-editor-vue" target="_blank">json-schema-editor-vue</a>
      <span class="version"> version：{{ version }}</span>
    </div>
    <div class="desc">
      <div>A json-schema editor of high efficient and easy-to-use, base on Vue.
        <!-- <a @click="visible = true">import json</a> -->
        <input type="file" @change="getFile" />
        <span>保存文件：</span><input v-model="saveFileName" />
        <button @click="saveFile">下载schema</button>
      </div>
    </div>
    <div class="container">
      <codemirror class="code" v-model="jsonStr" :readOnly="false"/>
      <div class="editor">
        <json-schema-editor class="schema" :value="tree" :hasCondition="conditions.length > 0" disabledType lang="zh_CN" custom/>
        <ConditionList class="condition" :value="tree" :modify-condition="modifyCondition" />
      </div>
    </div>
    <a-modal v-model="conditionModifyVisible" v-if="conditionModifyVisible" width="800px" height="600px" @ok="submitCondition" title="Modify Condition Required">
      <ConditionPropertyEditor v-if="isModifyProperty" :index="propertyIndex" />
      <ConditionEditor ref="conditionEditor" :value="tree" :index="conditionIndex" v-else />
    </a-modal>
    <a-modal v-model="visible" title="import json" width="800px" height="600x" @ok="handleImportJson">
      <div class="code-container">
        <codemirror class="code" v-model="importJson" :readOnly="false"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
var app = require("../package.json");
import Codemirror  from './components/Codemirror.vue'
import GenerateSchema from 'generate-schema'
import ConditionEditor from './components/ConditionEditor.vue'
import ConditionPropertyEditor from './components/ConditionPropertyEditor.vue'
import ConditionList from './components/ConditionList.vue'
export default {
  name: 'App',
  components: { Codemirror, ConditionEditor, ConditionList, ConditionPropertyEditor },
  computed: {
    jsonStr: {
      get: function () {
        return JSON.stringify(this.tree, null, 2)
      },
      set: function (newVal) {
        this.tree = JSON.parse(newVal)
      }
    }
  },
  data() {
    return {
      version: app.version,
      importJson: '',
      visible: false,
      conditionModifyVisible: false,
      conditionIndex: -1,
      conditions:[],
      propertyIndex: -1,
      properties:[],
      isModifyProperty: true,
      saveFileName: "schema.json",
      tree:
      {
  "root": {
  "type": "object",
  "properties": {
  }
}

}
    }
  },
  methods: {
    handleImportJson () {
      const  t = GenerateSchema.json(JSON.parse(this.importJson))
      delete t.$schema
      this.tree.root = t
      this.visible = false
    },
    submitCondition() {
      this.$refs.conditionEditor.submit()
      this.conditionModifyVisible = false
    },
    modifyCondition(index, isModifyProperty) {
      this.isModifyProperty = isModifyProperty
      this.conditionIndex = index
      this.conditionModifyVisible = true
    },
    getFile(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const  t = JSON.parse(e.target.result)
        delete t.$schema
        this.tree.root = t
      }
      reader.readAsText(file)
    },
    saveFile() {
      const textToSave = JSON.stringify(this.tree.root, null, 2)
      const blob = new Blob([textToSave], { type: "text/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = this.saveFileName
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>
<style>
*{
  padding:0;
  margin:0;
  box-sizing: border-box;
}
.title{
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  height:100px;
  line-height: 100px;
}
.version{
  font-size: 16px;
}
.desc{
  padding:20px;
  width:80vw;
  min-width:800px;
  margin:auto;
  padding: 0 3em;
  font-size: 1.2em;
}
.container{
  display: flex;
  padding:20px;
  width:80vw;
  min-width:800px;
  justify-content:center;
  height: calc(100vh - 150px);
  margin:auto;
}
.code-container{
  max-height: 600px;
  overflow: auto;
}
.editor{
  display: flex;
  flex-direction: column;
}
.schema, .condition{
  margin-left: 20px;
  width:100%;
  height: 50%;
  overflow-y: auto;
  overflow-x:hidden;
  border:1px solid rgba(0,0,0,.1);
  border-radius: 8px;
  padding: 12px;
}
.condition {
  margin-top: 10px;
}
.CodeMirror {
  height: 100% !important;
}
.vue-codemirror{
  flex:1;
  margin: 0 24px;
  border: 1px solid rgba(0,0,0,.1);
  min-height:300px;
  overflow: auto;
  border-radius: 6px;
}
</style>
