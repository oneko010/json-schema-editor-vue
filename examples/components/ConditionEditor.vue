<script>
import Vue from 'vue'
import { Modal, Checkbox } from 'ant-design-vue'
import PropertyEditor from '../../packages/json-schema-editor/PropertyEditor.vue'
Modal.install(Vue)
export default {
    components: { 
        ACheckbox: Checkbox, 
        PropertyEditor, 
        AModal: Modal 
    },
    data() {
        return {
            visible: false,
            advancedValue: {},
        }
    },
    created() {
        const node = this.pickValue
        node.allOf || this.$set(node, 'allOf', [])

        if (this.index < 0) {
            const conditionObject = {
                "if": {
                    "properties": {
                        "bbb": {
                            "const": "67"
                        }
                    }
                }, 
                "then": {
                    "required": [
                        "a"
                    ]
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
        propertyList: {
            get: function() {
                const node = this.pickValue
                node.properties || this.$set(node, 'properties', {})
                return Object.keys(node.properties)
            }
        },
        selectedPropertyList() {
            const node = this.pickValue
            node.allOf || this.$set(node, 'allOf', [])

            let index = this.index < 0 ? node.allOf.length - 1 : this.index
            const thennode = node.allOf[index].then
            return thennode.required
        }
    },
    methods: {
        submit() {
            const node = this.pickValue
            node.allOf || this.$set(node, 'allOf', [])

            let index = this.index < 0 ? node.allOf.length - 1 : this.index
            const ifnode = node.allOf[index].if
            if (Object.keys(ifnode.properties).length == 0) {
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
            const selectedAll = this.selectedPropertyList.length != this.propertyList.length
            if (selectedAll) {
                this.propertyList.forEach(element => {
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

        }
        
    }
}
</script>

<template>
    <div>
        <p>{{ propertyList }}</p>
        <json-schema-editor class="schema" :value="condition" :onSettingCallback="modifyProperty" disabledType lang="zh_CN" custom/>
        <div class="required">
        <a-checkbox v-for="item in propertyList" :key="item" :checked="selectedPropertyList.includes(item)" class="ant-col-name-required" @change="propertySelectChanged(item)">{{ item }}</a-checkbox>
        <a-checkbox @change="selectedAllChanged" :checked="selectedPropertyList.length == propertyList.length">全选</a-checkbox>
        </div>
        <a-modal v-model="visible" v-if="visible"  width="800px" height="600px" @ok="submitProperty" title="Modify Condition Required">
            <PropertyEditor :value="advancedValue" :custom="custom"/>
        </a-modal>
    </div>
</template>

<style>
.required {
    margin-left: 20px;
    margin-top: 10px;
}
</style>