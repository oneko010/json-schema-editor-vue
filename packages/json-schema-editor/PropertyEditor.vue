<template>
    <div class="json-schema-editor-advanced-modal">
        <a-row :gutter="6">
            <p>{{ advancedValue }}</p>
            <p>{{ advancedAttr }}</p>
            <a-col :span="8" v-for="(item,key) in advancedValue" :key="key">
                <a-form-item>
                    <span>{{ local[key] }}</span>
                    <a-input-number v-model="advancedValue[key]" v-if="advancedAttr[key].type === 'integer' || advancedAttr[key].type === 'number'" style="width:100%" :placeholder="key"/>
                    <span v-else-if="advancedAttr[key].type === 'boolean'" style="display:inline-block;width:100%">
                    <a-switch v-model="advancedValue[key]"/>
                    </span>
                    <a-textarea @blur="changeEnumValue" :value="enumText" :rows="2" v-else-if="key === 'enum'" :placeholder="local['enum_msg']"></a-textarea>
                    <a-select v-else-if="advancedAttr[key].type === 'array'" v-model="advancedValue[key]" style="width:100%" :getPopupContainer="
                    triggerNode => {
                    return triggerNode.parentNode || document.body;
                    }"
                    :placeholder="local[key]"
                    > 
                    <a-select-option value="">{{ local['nothing'] }}</a-select-option>
                    <a-select-option :key="t" v-for="t in advancedAttr[key].enums">
                        {{t}}
                    </a-select-option>
                    </a-select>
                    <a-input v-model="advancedValue[key]" v-else style="width:100%" :placeholder="key"/>
                </a-form-item>
            </a-col>
        </a-row>
        <h3 v-text="local['add_custom']" v-show="custom">添加自定义属性</h3>
        <a-form class="ant-advanced-search-form" v-show="custom">
        <a-row :gutter="6">
            <a-col :span="8" v-for="item in customProps" :key="item.key">
              <a-form-item :label="item.key">
                <a-input v-model="item.value" style="width:calc(100% - 30px)"/>
                <a-button icon="close" type="link" @click="removeCustomNode(item.key)" style="width:30px"></a-button>  
              </a-form-item>
            </a-col>
            <a-col :span="8" v-show="addProp.key != undefined">
              <a-form-item>
                <a-input slot="label" v-model="addProp.key" style="width:100px"/>
                <a-input v-model="addProp.value" style="width:100%"/>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item>
                <a-button icon="check" type="link" @click="confirmAddCustomNode(null)" v-if="customing"></a-button>  
                <a-tooltip :title="local['add_custom']" v-else>
                  <a-button icon="plus" type="link" @click="addCustomNode"></a-button>  
                </a-tooltip>
              </a-form-item>
            </a-col>
        </a-row> 
        </a-form>
        <h3 v-text="local['preview']">预览</h3>
        <pre style="width:100%" class="pre">{{completeNodeValue}}</pre>
    </div>
</template>

<script>
import { isNull } from './util'
import LocalProvider from './LocalProvider'
import {TYPE_NAME, TYPE} from './type/type'
// import { Row,Col,Button,Input,InputNumber, Icon,Checkbox,Select,Tooltip,Modal,Form,Switch} from 'ant-design-vue'
import { Row,Col, Icon,Form,Input, InputNumber, Switch, Select,Tooltip, Button} from 'ant-design-vue'
export default {
    props: {
        lang: { // i18n language
            type: String,
            default: 'zh_CN'
        },
        custom: {
            type: Boolean,
            default: false
        },
        value: {
            type: Object,
            required: true
        }
    },
    components: {
        ARow:Row,ACol:Col,
        AButton: Button,
        // eslint-disable-next-line vue/no-unused-components
        AIcon: Icon,
        AInput: Input,
        AInputNumber:InputNumber,
        ATextarea: Input.TextArea,
        // ACheckbox: Checkbox,
        ASelect: Select,
        ASelectOption:Select.Option,
        ATooltip: Tooltip,
        // AModal:Modal,
        AForm:Form,
        AFormItem: Form.Item,
        ASwitch: Switch
    },
    computed: {
        advancedAttr() {
            return TYPE[this.value['type']].attr || {}
        },
        enumText () {
            const t = this.advancedValue['enum']
            if (!t) return ''
            if (!t.length) return ''
            return t.join('\n')
        },
        advancedNotEmptyValue(){
            const jsonNode = Object.assign({},this.advancedValue);
            for(let key in jsonNode){
                isNull(jsonNode[key]) && delete jsonNode[key]
            }
            return jsonNode
        },
        completeNodeValue(){
            const t = {}
            const basicValue = { ...this.advancedValue }
            for(const item of this.customProps){
                t[item.key] = item.value
            }
            this._pickDiffKey().forEach(key => delete basicValue[key])
            let node = Object.assign({}, basicValue, t,this.advancedNotEmptyValue)
            const ownProps = this.ownProps
            for (const index in ownProps) {
                const key = ownProps[index]
                if (this.value[key] && !Object.keys(node).includes(key)) {
                    this.$set(node, key, this.value[key])
                }
            }
            console.log(JSON.stringify(node))
            return node
        },
        ownProps () {
            return ['type', 'title', 'properties', 'items','required', ...Object.keys(this.advancedAttr)]
        }
    },
    data() {
        return {
            TYPE_NAME,
            local: LocalProvider(this.lang),
            customProps: [],
            addProp: {},
            customing: false,
            advancedValue: {
                "type": ""
            },
            customPropIndex: 0
        }
    },
    methods: {
        addCustomNode(){
            this.$set(this.addProp,'key',this._joinName())
            this.$set(this.addProp,'value','')
            this.customing = true
        },
        removeCustomNode(key) {
            this.customProps.forEach((item,index) => {
                if (item.key === key) {
                this.customProps.splice(index,1)
                return
                }
            })
        },
        confirmAddCustomNode(prop) {
            const p = prop || this.addProp
            let existKey = false
            this.customProps.forEach(item => {
                if (item.key === p.key) {
                    existKey = true
                }
            })
            if (existKey) return
            this.customProps.push(p)
            this.addProp = {}
            this.customing = false
        },
        changeEnumValue (e) {
            const pickType = this.value.type
            const value = e.target.value

            if(!value || value===''){
                this.$delete(this.advancedValue, 'enum')
                return
            }
            var arr = value.split('\n')

            if (pickType === 'string') {
                this.$set(this.advancedValue, 'enum', arr.map(item => item))
            } else {
                if(arr.length ===0 || (arr.length === 1 && arr[0]=='')) {
                    this.advancedValue.enum = null
                }else {
                    this.advancedValue.enum = arr.map(item => +item);
                }
            }
            console.log("enum: "+ JSON.stringify(this.advancedValue))
        },
        _pickDiffKey () {
            const keys = Object.keys(this.value)
            return keys.filter(item => this.ownProps.indexOf(item) === -1)
        },
        _joinName() {
            const index = this.customPropIndex
            this.customPropIndex++
            return "field_" + index
        },
        getFinalProperty() {
            return this.completeNodeValue
        }
    },
    created() {
        const valueType = this.value['type'] || "string"
        this.advancedValue = {...TYPE[valueType].value}
        const keys = Object.keys(this.advancedValue)
        console.log(keys)
        for (const index in keys) {
            const key = keys[index]
            if (this.value[key]) {
                this.$set(this.advancedValue, key, this.value[key])
            }
        }
        const valueKeys = Object.keys(this.value)
        for (const index in valueKeys) {
            const key = valueKeys[index]
            if (!this.ownProps.includes(key)) {
                this.confirmAddCustomNode({"key": key, "value": this.value[key]})
            }
        }
    }
}
</script>

<style>
.json-schema-editor-advanced-modal {
  color: rgba(0, 0, 0, 0.65);
  min-width: 600px;
}
.json-schema-editor-advanced-modal pre {
  font-family: monospace;
  height: 100%;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 12px;
  width: 50%;
}
.json-schema-editor-advanced-modal h3 {
  display: block;
  border-left: 3px solid #1890ff;
  padding: 0 8px;
}
.json-schema-editor-advanced-modal .ant-advanced-search-form .ant-form-item {
  display: flex;
}
.json-schema-editor-advanced-modal .ant-advanced-search-form .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
</style>