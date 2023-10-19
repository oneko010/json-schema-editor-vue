<script>
import Vue from 'vue'
import { Modal } from 'ant-design-vue'
Modal.install(Vue)
export default {
    data() {
        return {
            
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
        }
    },
    computed: {
        pickValue(){
            return  Object.values(this.value)[0]
        },
        jsonStr: {
            get: function () {
                return JSON.stringify(this.value, null, 2)
            },
            set: function (newVal) {
                this.value = JSON.parse(newVal)
            }
        },
        condition: {
            get: function() {
                const node = this.pickValue
                node.allOf || this.$set(node, 'allOf', [])
                
                if (this.index >= 0 && this.value) {
                    const ifnode = node.allOf[this.index].if
                    ifnode.type || this.$set(ifnode, "type", "object")
                    const conditionNode = {}
                    this.$set(conditionNode, "if", ifnode)
                    return conditionNode
                } else {
                    return {
                        "root": {
                            "type": "object",
                            "properties": {
                                "acode": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</script>

<template>
    <div>
        <p>{{ condition }}</p>
    <json-schema-editor class="schema" :value="condition" disabledType lang="zh_CN" custom/>
    </div>
</template>

<style>
</style>