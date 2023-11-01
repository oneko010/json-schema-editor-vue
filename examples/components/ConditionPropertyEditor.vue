<script>
import Vue from 'vue'
import { Modal, Checkbox } from 'ant-design-vue'
import PropertyEditor from '../../packages/json-schema-editor/PropertyEditor.vue'
import { isNull } from '../../packages/json-schema-editor/util'
Modal.install(Vue)
export default {
    components: { 
        PropertyEditor, 
        AModal: Modal,
        ACheckbox: Checkbox
    },
    data() {
        return {
            visible: false,
            advancedValue: {},
            tree: {
                "root": {}
            }
        }
    },
    created() {
        const node = this.pickValue
        node.allOf || this.$set(node, 'allOf', [])

        if (this.index < 0) {
            const conditionObject = {
                "if": {
                    "properties": {
                    }
                }, 
                "then": {
                    "type": "object",
                    "properties": {
                    },
                    "required":[]
                }
            }
            node.allOf.push(conditionObject)
        }
    },
    props: {
        value: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            default: -1
        },
        custom: { //enable custom properties
            type: Boolean,
            default: true
        }
    },
    computed: {
        pickValue(){
            return  Object.values(this.value)[0]
        },
        condition: {
            get: function() {
                const node = this.pickValue
                node.allOf || this.$set(node, 'allOf', [])

                let index = this.index < 0 ? node.allOf.length - 1 : this.index
                const ifnode = node.allOf[index].if
                
                ifnode.type || this.$set(ifnode, "type", "object")
                const conditionNode = {}
                this.$set(conditionNode, "if", ifnode)

                return conditionNode
            }
        },
        thenNode() {
            const node = this.pickValue
            node.allOf || this.$set(node, 'allOf', [])

            let index = this.index < 0 ? node.allOf.length - 1 : this.index
            const thennode = node.allOf[index].then
            return {
                "root": thennode
            }
        },
        ownProps () {
            return [ 'type', 'title', 'properties', 'items','required', ...Object.keys(this.advancedAttr)]
        },
        allPropertyList() {
            const node = this.pickValue
            node.properties || this.$set(node, 'properties', {})
            return Object.keys(node.properties)
        },
        requiredList() {
            const node = this.pickValue
            node.allOf || this.$set(node, 'allOf', [])

            let index = this.index < 0 ? node.allOf.length - 1 : this.index
            const thennode = node.allOf[index].then
            if (thennode.required == undefined) {
                this.$set(thennode, 'required', [])
            }
            return thennode.required
        }
    },
    methods: {
        submit() {
            const node = this.pickValue
            node.allOf || this.$set(node, 'allOf', [])

            let index = this.index < 0 ? node.allOf.length - 1 : this.index
            const thennode = node.allOf[index].then
            let hasRequired = true
            let hasProperties = true
            if (thennode.required.length == 0) {
                this.$delete(thennode, 'required')
                hasRequired = false
            }
            if (Object.keys(thennode.properties).length == 0) {
                this.$delete(thennode, 'properties')
                hasProperties = false
            }
            const ifnode = node.allOf[index].if
            const isValid = Object.keys(ifnode.properties).length > 0 && (hasRequired || hasProperties)
            if (!isValid) {
                node.allOf.splice(this.index, 1)
            }
            if (node.allOf.length == 0) {
                this.$delete(node,'allOf')
            }
        },
        propertySelectChanged(property) {
            const node = this.pickValue
            node.allOf || this.$set(node, 'allOf', [])

            let index = this.index < 0 ? node.allOf.length - 1 : this.index
            const thennode = node.allOf[index].then
            if (thennode.required.includes(property)) {
                const index = thennode.required.findIndex(item => item === property)
                thennode.required.splice(index, 1)
            } else {
                thennode.required.push(property)
            }
        },
        selectedAllChanged() {
            const node = this.pickValue
            node.allOf || this.$set(node, 'allOf', [])

            let index = this.index < 0 ? node.allOf.length - 1 : this.index
            const thennode = node.allOf[index].then
            const selectedAll = this.requiredList.length != this.allPropertyList.length
            if (selectedAll) {
                this.allPropertyList.forEach(element => {
                    if (!thennode.required.includes(element)) {
                        thennode.required.push(element)
                    }
                })
            } else {
                thennode.required.splice(0, thennode.required.length)
            }
        },
        modifyProperty(property) {
            this.advancedValue = property
            this.visible = true
        },
        submitProperty() {
            this.visible = false
            const finalProperty = this.$refs.propertyEditor.getFinalProperty()

            // 更新/删除固定属性
            const keys = this.$refs.propertyEditor.ownProps
            console.log("final: " + JSON.stringify(finalProperty))
            for (const index in keys) {
                const key = keys[index]
                if (!isNull(finalProperty[key])) {
                    this.$set(this.advancedValue, key, finalProperty[key])
                } else {
                    this.$delete(this.advancedValue, key)
                }
            }
            // 更新自定义属性
            const finalKeys = Object.keys(finalProperty)
            for (const index in finalKeys) {
                const key = finalKeys[index]
                if (!keys.includes(key)) {
                    this.$set(this.advancedValue, key, finalProperty[key])
                }
            }
            // 清除编辑后没有指定的自定义属性
            const valueKeys = Object.keys(this.advancedValue)
            for (const index in valueKeys) {
                const key = valueKeys[index] 
                if (!keys.includes(key) && !finalKeys.includes(key)) {
                    this.$delete(this.advancedValue, key)
                }
            }
        }
    }
}
</script>

<template>
    <div>
        <p>{{ condition }}</p>
        <json-schema-editor class="schema" :value="condition" :onSettingCallback="modifyProperty" disabledType lang="zh_CN" custom/>
        <json-schema-editor class="schema" :value="thenNode" :onSettingCallback="modifyProperty" disabledType lang="zh_CN" custom/>
        <a-checkbox v-for="item in allPropertyList" :key="item" :checked="requiredList.includes(item)" class="ant-col-name-required" @change="propertySelectChanged(item)">{{ item }}</a-checkbox>
        <a-checkbox @change="selectedAllChanged" :checked="requiredList.length == allPropertyList.length">全选</a-checkbox>
        <a-modal v-model="visible" v-if="visible"  width="800px" height="600px" @ok="submitProperty" title="Modify Condition Required">
            <PropertyEditor :value="advancedValue" :custom="custom" ref="propertyEditor" />
        </a-modal>
    </div>
</template>

<style>
</style>