<template lang="pug">
    div.page-main
        h1 图片管理
        ImageChose(v-on:image-confirm="chosedImage",ref="imageChild")
        el-form
            el-form-item(label='图片')
                input(type="file",ref="upload_image",style="display:none",accept="image/jpeg,image/png,image/gif",@change="upload($event)")
                el-button(@click="uploadButton()") 上传图片
            el-form-item(label='分组')
                el-input(v-model="groupIdx")
                el-button(@click="createGroup()") 添加分组
    
</template>
<script>
import ImageChose from '../components/ImageChose'
import ApiService from '../services/ApiService.js';
export default {
    components:{
        ImageChose
    },
    data:function(){
        return {
            groupIdx:0
        }
    },
    methods:{
        chosedImage:function(image)
        {

        },
        upload:function(event)
        {
            var file = event.target.files[0];
            var formdata = new FormData();
            formdata.append('image',file);
            formdata.append('group',this.$refs.imageChild.selectedGroup)
            ApiService.authedRequest(this).post('/api/image/upload',formdata).then(result=>{
                if(result.data.success)
                {
                    this.$notify({
                        title: '保存成功',
                        message: `已保存图片${result.data.imageName}`,
                        type: 'success'
                    });
                    this.$refs.imageChild.refresh();
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
                    this.$refs.imageChild.refresh();
                }
            })
        }
    }

}
</script>

