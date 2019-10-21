<template lang="pug">
    div.page-main
        el-row.item()
            el-col(:span="24")
                div.audio(v-for="(audio,index) in audios")
                    label() {{audio.name}}
                    div.Mask(@click="selected(index)")
                        div.ctrl
                            el-button.del(type='danger', icon='el-icon-delete', circle='',@click="delAudio(index)")
                    img.select(src="../assets/logo.png")
                    audio.select(controls :src='audio.url')
                    

        el-col(:span="12")
            el-button(@click="lastPage()",v-show="npage>0") 上一页
            el-button(@click="nextPage()",v-show="(npage+1)*onePageCount<count") 下一页
        div(style="text-align:center;width:100%")
            label(v-show="count>0") 第{{npage+1}}页
        
</template>
<script>
import ApiServices from '../services/ApiService'

export default {
    props: ['handleCancelAudio'],
    mounted:async function()
    {
        await Promise.all([(async function(_this){
            return _this.audios = (await ApiServices.authedRequest(this).get('api/audio/audios?count=9')).data
        })(this),(async function(_this){
            return _this.count = (await ApiServices.authedRequest(this).get('api/audio/count')).data
        })(this)])
        
    },
    data:function(){
        return{
            audios:[],
            npage:0,
            onePageCount:9,
            count:0
        }
    },
    methods:{
        refresh:async function()
        {
            this.count = (await ApiServices.authedRequest(this).get(`api/audio/count`)).data
            await this.getPageAudio();
        },
        selected:function(idx){
            this.$emit('audio-confirm',this.audios[idx]);
        },
        getPageAudio:async function()
        {
            this.audios = (await ApiServices.authedRequest(this).get(`/api/audio/audios?count=${this.onePageCount}&offset=${this.npage*this.onePageCount}`)).data
        },
        nextPage:function()
        {
            if((this.npage+1)*this.onePageCount<this.count)
            {
                this.npage++;
                this.getPageAudio();
            }
            
        },
        lastPage:function()
        {
            if(this.npage>0)
            {
                this.npage--;
                this.getPageAudio();
            }
        },delAudio:async function(index)
        {
            var audio = this.audios[index]
            if((await ApiServices.authedRequest(this).post('/api/audio/delaudio',{id:audio.id})).data.success)
            {
                    this.$notify({
                        title:'删除成功',
                        message:`已删除音频${audio.name}`,
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
audio.select{
    width: 160px;
    height: 54px;
    left: 0;
    position: relative;
    bottom: 0;
    margin: 0 5px;
}
div.audio
{
    width: 160px;
    height: 100px;
    display: inline-block;
    
}
div.audio div.ctrl
{
    position:absolute;
    width: 160px;
    margin: 0 5px;
    transition: 200ms;
    
}
div.audio  label
{
    position: relative;
    top: 0;
    margin: 10px 10px;
    text-shadow: 0px 0px 1px #000;
    pointer-events: none;
}
div.audio div.ctrl button.del
{
    position: absolute;
    right: 0;
    padding: 8px;
    margin: 0 10px;
    pointer-events: all;
}
div.Mask
{
    opacity: 0;
    position: absolute;
    width: 160px;
    margin: 0 5px;
    height: 100px;
    transition: 200ms;
    background-color: black;
}
div.Mask:hover
{
    opacity: 0.4;
}

</style>

