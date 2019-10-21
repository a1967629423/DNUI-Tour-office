<template lang="pug">
    div.page-main
        h1 音频管理
        AudioChose(v-on:image-confirm="chosedAudio",ref="audioChild")
        el-form
            el-form-item(label='图片')
                input(type="file",ref="upload_image",style="display:none",accept="audio/mp3,audio/wav,audio/ogg",@change="upload($event)")
                el-button(@click="uploadButton()") 上传音频
    
</template>
<script>
import AudioChose from '../components/AudioChose'
import ApiService from '../services/ApiService.js';
export default {
    components:{
        AudioChose
    },
    data:function(){
        return {
            groupIdx:0
        }
    },
    methods:{
        chosedAudio:function(audio)
        {

        },
        upload:function(event)
        {
            var file = event.target.files[0];
            var formdata = new FormData();
            formdata.append('audio',file);
            ApiService.authedRequest(this).post('/api/audio/upload',formdata).then(result=>{
                if(result.data.success)
                {
                    this.$notify({
                        title: '保存成功',
                        message: `已保存音频${result.data.audioName}`,
                        type: 'success'
                    });
                    this.$refs.audioChild.refresh();
                }
                else
                {
                    this.$notify({
                        title:'保存失败',
                        message:"",
                        type:'error'
                    })
                }
            })

        },
        uploadButton:function()
        {
            this.$refs.upload_image.dispatchEvent(new MouseEvent('click'));
        },
        createGroup:function()
        {
            ApiService.authedRequest(this).post('/api/image/addgroup',{name:this.groupIdx}).then(result=>{
                if(result.data.success)
                {
                    this.$notify({
                        title:'创建成功',
                        message:`已创建分组${result.data.group.name}`,
                        type:'success'
                    });
                    this.$refs.audioChild.refresh();
                }
            })
        }
    }

}
</script>

