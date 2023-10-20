<template>
    <div>
        <p v-for="(item, index) in conditions" :key="index" >{{ getCondition(index) }}</p>
    </div>
</template>
<script>
import Vue from 'vue'
import { Modal } from 'ant-design-vue'
Modal.install(Vue)
export default {
    props: {
        value: {
            type: Object,
            required: true
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
        }
    }

}
</script>
<style>
</style>