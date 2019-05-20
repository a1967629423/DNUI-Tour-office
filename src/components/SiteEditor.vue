<template lang="pug">
  div.page-main
    el-form(ref='form', :model='form', label-width='80px')
      el-form-item(label='地点名称')
        el-input(v-model='site.name')
      el-form-item(label='地点描述')
        el-input(type='textarea', :rows='2', placeholder='请输入内容', v-model='site.description')
      el-form-item(label='坐标地点')
        el-row(:gutter="20")
          el-col(:span="5", style="padding-left: 0")
            el-button(type="primary", @click="showMapComponent = true", style="width: 100%;") 地图选点
          el-col(:span="8")
            el-input(v-model='site.location.lat')
          el-col(:span="8")
            el-input(v-model='site.location.lng')
      el-form-item(label='地点详情')
        el-input(type='textarea', :rows='2', placeholder='请输入内容', v-model='site.content')
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
      MapLocationSelector(v-model="showMapComponent", v-on:cancel="handleCancelMap", v-on:map-confirm="selectedMapLocation")
</template>

<script>
import ApiServices from '../services/ApiService'
import MapLocationSelector from '../components/MapLocationSelector'
export default {
  props: ['siteId', 'close'],
  components: { MapLocationSelector },
  mounted: async function() {
    if(this.siteId) loadSite(this.siteId)
  },
  data: function() {
    return { 
      site: {
        sort: 0,
        name: '',
        description: '',
        //geohash: '',
        location: {
          lat: 0,
          lng: 0
        },
        content: '',
        views: 0
      },
      showMapComponent: false
    };
  },
  methods: {
    loadSite: async function(siteId) {
      let site = (await ApiServices.authedRequest(this).get(`/api/manage/site/${siteId}`)).data
      this.site = site
    },
    selectedMapLocation: function(location){
      console.log(JSON.stringify(location))
      this.site.location.lat = location.lat
      this.site.location.lng = location.lng
      this.showMapComponent = false
    },
    handleCancelMap: function(){
      this.showMapComponent = false
    },
    save: async function(){
      let result
      if(this.siteId){
        // 修改
        result = (await ApiServices.authedRequest(this).post(`/api/manage/site/${this.siteId}`,{
          ...this.site
        }))
      }else{
        // 新增
        result = (await ApiServices.authedRequest(this).post(`/api/manage/site/`,{
          ...this.site
        }))
      }
      if(result.id){
        this.$notify({
          title: '保存成功',
          message: `已保存地点${result.name}`,
          type: 'success'
        });
        this.handleClose()
      }
    }
  }
};
</script>

<style scoped>
</style>

