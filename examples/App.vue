<template>
  <div id="app">
    <div class="title">   
      <a href="https://github.com/zyqwst/json-schema-editor-vue" target="_blank">json-schema-editor-vue</a>
      <span class="version"> version：{{ version }}</span>
    </div>
    <div class="desc">
      <div>A json-schema editor of high efficient and easy-to-use, base on Vue.
        <a @click="visible = true">import json</a>
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
        <ConditionEditor ref="conditionEditor" :value="tree" :index="conditionIndex" />
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
import ConditionList from './components/ConditionList.vue'
export default {
  name: 'App',
  components: { Codemirror, ConditionEditor, ConditionList },
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
      conditions:[],
      conditionIndex: -1,
      tree:
      {
  "root": {
  "type": "object",
  "properties": {
    "acode": {
      "enum": [
        "67",
        "42",
        "38",
        "44",
        "43",
        "45",
        "40"
      ]
    },
    "adsid": {
      "type": "string"
    },
    "ad_po": {
      "enum": [
        "attach",
        "detailcircle",
        "detail_exc",
        "detail_one",
        "download_one",
        "drama_sticker",
        "exit",
        "focus",
        "homebanner",
        "homeBanner2",
        "homebanner_ani",
        "homebanner_epi",
        "homebanner_film",
        "homebanner_show",
        "homecircle",
        "homedraw_epi",
        "homedraw_film",
        "home_float",
        "inplay",
        "launch",
        "myBanner",
        "new_svideo_feed1",
        "pause",
        "pre_ad",
        "pre-roll",
        "proscreen",
        "quit",
        "recom1",
        "recom2",
        "related_flow",
        "search_proscreen",
        "splash",
        "svideo_back",
        "svideo_feed1",
        "svideo_feed2",
        "svideo_flow",
        "svideo_flow_game",
        "videoclipsfeeds",
        "window_sticker"
      ]
    },
    "ad_pro": {
      "type": "string"
    },
    "ad_type": {
      "enum": [
        "dadi",
        "dadi2"
      ]
    },
    "tid": {
      "type": "string"
    },
    "cp_adid": {
      "type": "string"
    },
    "idea_type": {
      "type": "string"
    },
    "errorcode": {
      "type": "number"
    },
    "result": {
      "enum": [
        "success",
        "fail",
        "error",
        "nofill",
        "failure"
      ]
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "acode": {
            "const": "67"
          }
        }
      },
      "then": {
        "required": [
          "acode",
          "adsid",
          "ad_po"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "acode": {
            "const": "42"
          }
        }
      },
      "then": {
        "if": {
          "properties": {
            "result": {
              "const": "success"
            }
          }
        },
        "then": {
          "required": [
            "acode",
            "adsid",
            "ad_po",
            "ad_pro",
            "tid"
          ]
        },
        "else": {
          "required": [
            "acode",
            "adsid",
            "ad_po"
          ]
        }
      }
    },
    {
      "if": {
        "properties": {
          "acode": {
            "enum": [
              "38"
            ]
          }
        }
      },
      "then": {
        "required": [
          "acode",
          "adsid",
          "cp_adid",
          "ad_po",
          "ad_pro",
          "tid"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "acode": {
            "enum": [
              "44",
              "45",
              "40"
            ]
          }
        }
      },
      "then": {
        "required": [
          "acode",
          "adsid",
          "cp_adid",
          "ad_po",
          "ad_pro",
          "tid",
          "idea_type"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "acode": {
            "enum": [
              "43"
            ]
          }
        }
      },
      "then": {
        "required": [
          "acode",
          "adsid",
          "cp_adid",
          "ad_po",
          "ad_pro",
          "tid",
          "errorcode"
        ]
      }
    }
  ]
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
    modifyCondition(index) {
      this.conditionIndex = index
      this.conditionModifyVisible = true
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
