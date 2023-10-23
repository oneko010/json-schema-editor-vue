<template>
    <div>
        <h3 v-text="local['base_setting']">基础设置</h3>
        <a-form v-model="advancedValue" class="ant-advanced-search-form">
          <a-row :gutter="6">
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
        </a-form>
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
        <pre style="width:100%">{{completeNodeValue}}</pre>
    </div>
</template>

<script>
import LocalProvider from './LocalProvider'
export default {
    props: {
        lang: { // i18n language
        type: String,
        default: 'zh_CN'
        }
    },
    components: {

    },
    data() {
        return {
            local: LocalProvider(this.lang)
        }
    }
}
</script>

<style>

</style>