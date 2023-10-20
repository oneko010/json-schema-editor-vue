<template>
    <div>
        <!-- <p v-for="(item, index) in conditions" :key="index" >{{ getCondition(index) }}</p> -->
        <a-row :gutter="6" v-for="(item, index) in conditions" :key="index" class="row">
            <a-col :span="18">
                <a-input :value="getCondition(index)" :disabled="disabled"></a-input>
            </a-col>
            <a-col>
                <a-tooltip class="button">
                    <span slot="title">编辑</span>
                    <a-button  icon="setting" class="setting-icon" @click="onSetting(index)"/>
                </a-tooltip>
                <a-tooltip class="button">
                    <span slot="title">编辑</span>
                    <a-button class="close-icon ant-btn-icon-only" @click="removeNode(index)">
                        <i aria-label="icon: plus" class="anticon anticon-plus">
                        <svg viewBox="64 64 896 896" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z" p-id="1142"></path></svg>
                        </i>
                    </a-button>
                </a-tooltip>
            </a-col>
        </a-row>
    </div>
</template>
<script>
import Vue from 'vue'
import { Row,Col,Button,Input,Tooltip,Modal } from 'ant-design-vue'
Modal.install(Vue)
export default {
    components: {
        ARow:Row,ACol:Col,
        AButton: Button,
    // eslint-disable-next-line vue/no-unused-components
        AInput: Input,
        ATooltip: Tooltip
    },
    props: {
        value: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        pickValue(){
            return  Object.values(this.value)[0]
        },
        conditions() {
            return this.pickValue.allOf
        }
    },
    methods: {
        getCondition(index) {
            const ifnode = this.conditions[index].if
            const properties = ifnode.properties
            var arr = []
            Object.keys(properties).forEach(key => {
                arr.push(key + ":" + JSON.stringify(properties[key], null, 2))
            })
            return arr.join(",")
        },
        onSetting(index) {
            console.log("onsetting" + index)
        },
        removeNode(index) {
            console.log("removeNode" + index)
        }
    }

}
</script>
<style>
.row {
    margin-bottom: 10px;
}
.button{
    margin-left: 10px;
}
</style>

