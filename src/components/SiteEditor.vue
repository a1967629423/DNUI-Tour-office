<template lang="pug">
  div.page-main
    el-form(ref='form', :model='site', label-width='80px')
      el-form-item(label='地点名称')
        el-input(v-model='site.name')
      el-form-item(label='地点链接')
        el-input(v-model='site.link')
      el-form-item(label='地点描述')
        el-input(type='textarea', :rows='2', placeholder='请输入内容', v-model='site.description')
      el-form-item(label='坐标地点')
        el-row(:gutter="20")
          el-col(:span="5", style="padding-left: 0")
            el-button(type="primary", @click="showMapComponent = true", style="width: 100%;") 地图选点
          el-col(:span="8")
            el-input(v-model='site.lat')
          el-col(:span="8")
            el-input(v-model='site.lng')
      el-form-item(label='地点详情')
        el-input(type='textarea', :rows='2', placeholder='请输入内容', v-model='site.content')
      el-form-item(label='地点图片')
        el-button(plain,@click="addImage") 添加图片
        el-row.item(v-for="(img,index) in site.images")
          el-col(:span="12")
            el-input(v-model='site.images[index]')
            el-button(plain,v-show='site.images[index]==""',@click='choseImage(index)') 选择图片
            el-button(type='danger', icon='el-icon-delete', circle='',@click="delImage(index)")
      el-form-item(label='地点音频')
        el-input(v-model='site.soundLink')
        el-button(plain,v-show='site.soundLink==""',@click="choseAudio()") 选择音频
      el-form-item(label='地点全景照片')
        el-input(v-model='site.panoramaLink')
        el-button(plain,v-show="site.panoramaLink==''",@click="choseImage('panoramaLink')") 选择图片
      el-form-item(label="活动")
          el-button(@click="showSiteTipsEditor=true") 编辑提示
          span(style='margin: 0 10px') {{`当前有 ${siteTips.length} 条提示`}}
      el-form-item
        el-button(type='primary', @click='save') 保存
        el-button(@click='handleClose') 取消
    el-dialog(
      title='添加地点', 
      :visible.sync="showMapComponent", 
      width='80%', 
      :before-close='handleCancelMap'
      :append-to-body='true'
    )
      MapLocationSelector(v-model="showMapComponent", v-on:cancel="handleCancelMap", v-on:map-confirm="selectedMapLocation",:nPosition="{lng:site.lng,lat:site.lat}")
    el-dialog(
      title='选择图片',
      :visible.sync="showImageChose",
      width='80%',
      :before-close='handleCancelImage'
      :append-to-body='true'
    )
      ImageChose(v-model="showImageChose",v-on:cancel="handleCancelImage",v-on:image-confirm="chosedImage",:selectIdx="selectIdx")
    el-dialog(
      title='选择音频',
      :visible.sync="showAudioChose",
      width='80%',
      :before-close='handleCancelAudio'
      :append-to-body='true'
    )
      AudioChose(v-model="showAudioChose",v-on:cancel="handleCancelAudio",v-on:audio-confirm="chosedAudio")
    el-dialog(title="编辑地点提示",:visible.sync="showSiteTipsEditor",width='80%',:append-to-body='true')
      SiteTipsEditor(:siteTips="siteTips",:handleClose='handleSiteTipsClose')
      
</template>

<script>
import ApiServices from '../services/ApiService'
import MapLocationSelector from '../components/MapLocationSelector'
import ImageChose from '../components/ImageChose'
import AudioChose from '../components/AudioChose'
import SiteTipsEditor from './SiteTipsEditor'
export default {
  props: ['siteId', 'handleClose'],
  components: { MapLocationSelector,ImageChose,AudioChose,SiteTipsEditor },
  mounted: async function() {
    if(this.siteId){
      this.loadSite(this.siteId);
      this.loadTips(this.siteId);
    } 
  },
  data: function() {
    return { 
      site: {
        link: '',
        name: '',
        description: '',
        //geohash: '',
        lat: 38.899056,
        lng: 121.542833,
        content: '',
        views: 0,
        images: [],
        soundLink: '',
        panoramaLink: ''
      },
      showMapComponent: false,
      showImageChose:false,
      showAudioChose:false,
      showSiteTipsEditor:false,
      selectIdx:0,
      siteTips:[]
    };
  },
  methods: {
    addImage: async function(){
      return this.site.images.push('')
    },
    delImage: async function(i){
      this.site.images.splice(i,1);
    },
    loadSite: async function(siteId) {
      var data = (await ApiServices.authedRequest(this).get(`/api/manage/site/${siteId}`)).data
      this.site = data;
    },
    loadTips:async function(siteId){
      var data = (await ApiServices.authedRequest(this).get(`/api/manage/site/${siteId}/tips`)).data.map(v=>{return {value:v.tips}});
      this.siteTips = data;
    },
    selectedMapLocation: function(location){
      this.site.lat = location.lat
      this.site.lng = location.lng
      this.showMapComponent = false
    },
    handleCancelMap: function(){
      this.showMapComponent = false
    },
    handleCancelImage:function(){
      this.showImageChose = false;
    },
    handleCancelAudio:function(){
      this.showAudioChose = false;
    },
    handleSiteTipsClose:function(){
      this.showSiteTipsEditor = false;
    }
    ,
    save: async function(){
      let result
      if(this.siteId){
        // 修改
        result = (await ApiServices.authedRequest(this).post(`/api/manage/site/${this.siteId}`,{
          ...this.site
        })).data
        await ApiServices.authedRequest(this).post(`/api/manage/site/${this.siteId}/tips`,this.siteTips.map(v=>v.value));
      }else{
        // 新增
        result = (await ApiServices.authedRequest(this).post(`/api/manage/site/`,{
          ...this.site
        })).data
      }
      if(result.id){
        this.$notify({
          title: '保存成功',
          message: `已保存地点${result.name}`,
          type: 'success'
        });
        this.handleClose()
      }
    },
    choseImage: function(idx){
      this.selectIdx = idx
      this.showImageChose = true;
    },
    chosedImage:function(image)
    {
      switch(this.selectIdx)
      {
        case 'panoramaLink':
          this.site.panoramaLink = image.url
          break;
        default :
          this.site.images[this.selectIdx] = image.url;
        break;
      }
      
      
      this.handleCancelImage();
    },
    choseAudio:function()
    {
      this.showAudioChose = true;
    },
    chosedAudio:function(audio)
    {
      this.site.soundLink = audio.url;
      this.handleCancelAudio();
    }
  }
};
</script>

<style scoped>
</style>

