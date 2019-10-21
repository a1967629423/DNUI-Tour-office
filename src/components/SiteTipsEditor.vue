<template lang="pug">
    .site-tips-editor
        el-form(ref='form', label-width='80px')
            el-form-item
                el-button(type="primary",@click="addItem") 添加
            el-form-item(label="提示")
                el-row(v-for='(item,idx) in localTips' :key="idx")
                    el-col(:span="16")
                        el-input( v-model="item.value")
                    el-col(:span="8")
                        el-button(type='danger', icon='el-icon-delete', circle='',@click="removeItem(idx)")
            el-form-item
                el-button(type='primary', @click='save') 保存
                el-button(@click='handleClose') 取消
</template>
<script>
export default {
    mounted(){
        this.localTips = this.siteTips.map(v=>{return {...v}});
    },
    props:{siteTips:Array,handleClose:Function},
    data:function(){
        return{
            localTips:[]
        }
    },
    methods:{
        addItem:function (){
            this.localTips.push({value:''});
        },
        removeItem:function(idx){
            this.localTips.splice(idx,1);
        },
        save:function(){
            this.siteTips.length = 0;
            this.siteTips.push(...this.localTips);
            this.handleClose();
        }

    }
}
</script>
<style scoped>

</style>