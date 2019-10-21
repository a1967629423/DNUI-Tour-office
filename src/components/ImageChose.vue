<template lang="pug">
    div.page-main
        el-row(:span="12") 
            label(v-show="groups.length>0") 图片分组
                el-select(v-model="selectedGroup",@change="refresh()")
                    el-option(v-for="item in groups",:value="item.id",:key="item.id",:label="item.name")
        el-row.item()
            el-col(:span="24")
                div.image(v-for="(image,index) in images")
                    div.imageMask(@click="selected(index)")
                        div.ctrl
                             el-button.del(type='danger', icon='el-icon-delete', circle='',@click="delImage(index)")
                    label() {{image.name}}
                    img.select(:src='image.url')
        el-col(:span="12")
            el-button(@click="lastPage()",v-show="npage>0") 上一页
            el-button(@click="nextPage()",v-show="(npage+1)*onePageCount<count") 下一页
        div(style="text-align:center;width:100%")
            label(v-show="count>0") 第{{npage+1}}页
        
</template>
<script>
import ApiServices from '../services/ApiService'

export default {
    props: ['handleCancelImage'],
    mounted:async function()
    {
        await Promise.all([(async function(_this){
            return _this.images = (await ApiServices.authedRequest(this).get('api/image/images?count=9')).data
        })(this),(async function(_this){
            return _this.count = (await ApiServices.authedRequest(this).get('api/image/count')).data
        })(this),(async function(_this){
            return _this.groups = [{name:'ALL',id:0},...(await ApiServices.authedRequest(this).get('api/image/groups')).data]
        })(this)])
        
    },
    data:function(){
        return{
            images:[],
            npage:0,
            onePageCount:9,
            count:0,
            groups:{name:'ALL',id:0},
            selectedGroup:0
        }
    },
    methods:{
        refresh:async function()
        {
            this.count = (await ApiServices.authedRequest(this).get(`api/image/count?group=${this.selectedGroup}`)).data
            this.groups = [{name:'ALL',id:0},...(await ApiServices.authedRequest(this).get('api/image/groups')).data] 
            await this.getPageImage();
        },
        selected:function(idx){
            this.$emit('image-confirm',this.images[idx]);
        },
        getPageImage:async function()
        {
            this.images = (await ApiServices.authedRequest(this).get(`/api/image/images?count=${this.onePageCount}&offset=${this.npage*this.onePageCount}&group=${this.selectedGroup}`)).data
        },
        nextPage:function()
        {
            if((this.npage+1)*this.onePageCount<this.count)
            {
                this.npage++;
                this.getPageImage();
            }
            
        },
        lastPage:function()
        {
            if(this.npage>0)
            {
                this.npage--;
                this.getPageImage();
            }
        },delImage:async function(index)
        {
            var image = this.images[index]
            if((await ApiServices.authedRequest(this).post('/api/image/delimage',{id:image.id})).data.success)
            {
                    this.$notify({
                        title:'删除成功',
                        message:`已删除图片${image.name}`,
                        type:'success'
                    });
                    this.refresh()
            }
        }
    }
}
</script>
<style>
img.select{
    width: 160px;
    height: 100px;
    margin: 0 5px;
    transition: 200ms;
}
div.image
{
    width: 160px;
    height: 100px;
    display: inline-table;
    position: relative;
    
}
div.image div.ctrl
{
    position:absolute;
    width: 160px;
    margin: 0 5px;
    transition: 200ms;
    
}
div.image  label
{
    position: absolute;
    bottom: 0;
    margin: 10px 10px;
    text-shadow: 0px 0px 1px #000;
    pointer-events: none;
}
div.image div.ctrl button.del
{
    position: absolute;
    right: 0;
    padding: 8px;
    margin: 0 10px;
    pointer-events: all;
}
div.imageMask
{
    opacity: 0;
    position: absolute;
    width: 160px;
    margin: 0 5px;
    height: 100px;
    transition: 200ms;
    background-color: black;
}
div.imageMask:hover
{
    opacity: 0.4;
}

</style>

