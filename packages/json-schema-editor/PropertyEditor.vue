<template>
    <div>
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
    </div>
</template>

<script>
import LocalProvider from './LocalProvider'
import {TYPE_NAME, TYPE} from './type/type'
// import { Row,Col,Button,Input,InputNumber, Icon,Checkbox,Select,Tooltip,Modal,Form,Switch} from 'ant-design-vue'
import { Row,Col, Icon,Form,Input, InputNumber, Switch, Select} from 'ant-design-vue'
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
        // AButton: Button,
        // eslint-disable-next-line vue/no-unused-components
        AIcon: Icon,
        AInput: Input,
        AInputNumber:InputNumber,
        ATextarea: Input.TextArea,
        // ACheckbox: Checkbox,
        ASelect: Select,
        ASelectOption:Select.Option,
        // ATooltip: Tooltip,
        // AModal:Modal,
        // AForm:Form,
        AFormItem: Form.Item,
        ASwitch: Switch
    },
    computed: {
        advancedAttr() {
            console.log(this.value)
            return TYPE[this.value['type']].attr
        },
        enumText () {
        const t = this.advancedValue['enum']
        if (!t) return ''
        if (!t.length) return ''
        return t.join('\n')
        }
    },
    data() {
        return {
            TYPE_NAME,
            local: LocalProvider(this.lang),
            customProps: [],
            addProp: {},
            customing: false,
            advancedValue: {}
        }
    },
    methods: {
        addCustomNode(){
            this.$set(this.addProp,'key',this._joinName())
            this.$set(this.addProp,'value','')
            this.customing = true
        },
        completeNodeValue(){
            const t = {}
            const basicValue = { ...this.pickValue }
            for(const item of this.customProps){
                t[item.key] = item.value
            }
            this._pickDiffKey().forEach(key => delete basicValue[key])
            return Object.assign({}, basicValue, t,this.advancedNotEmptyValue)
        },
        changeEnumValue (e) {
            const pickType = this.pickValue.type
            const value = e.target.value

            if(!value || value===''){
                this.advancedValue.enum = null
                return
            }
            var arr = value.split('\n')

            if (pickType === 'string') {
                this.advancedValue.enum = arr.map(item => item);
            } else {
                if(arr.length ===0 || (arr.length === 1 && arr[0]=='')) {
                this.advancedValue.enum = null
                }else {
                this.advancedValue.enum = arr.map(item => +item);
                }
            }
        }
    },
    created() {
        const valueType = this.value['type'] || "string"
        this.advancedValue = TYPE[valueType].value
        for (const k in this.advancedValue) {
            if (this.value[k]) {
                this.advancedValue[k] = this.value[k]
            }
        }
    }
}
</script>

<style>

</style>