<template lang="pug">
  div.page-main
    el-row.page-header
      el-col(:span="12")
        h1 地点列表
      el-col.right(:span="12")
        el-button(type="primary", icon="el-icon-plus", @click="createSite()") 添加地点
    el-table(:data='sites', style='width: 100%')
      el-table-column(prop='name', label='名称')
      el-table-column(prop='views', label='访问量')
      el-table-column(fixed='right', label='操作', width='100')
        template(slot-scope='scope')
          el-button(@click='editSite(scope.row)', type='text', size='small') 编辑

    el-dialog(
      title='添加地点', 
      :visible.sync="showEditSiteDialog", 
      v-if="showEditSiteDialog",
      width='80%', 
      :before-close='handleEditSiteDialogClose'
      :append-to-body='true'
    )
      SiteEditor(v-if="showEditSiteDialog", :siteId="selectedSiteId", :handleClose="handleEditSiteDialogClose")

</template>

<script>
import ApiServices from '../services/ApiService'
import SiteEditor from '../components/SiteEditor'

export default {
  components: { SiteEditor },
  mounted: async function() {
    await this.loadSite()
  },
  data: function() {
    return { 
      showEditSiteDialog: false,
      sites: [],
      selectedSiteId: null
    };
  },
  methods: {
    loadSite: async function() {
      this.sites = (await ApiServices.authedRequest(this).get('/api/manage/site/')).data
    },
    handleEditSiteDialogClose: async function(){
      this.showEditSiteDialog = false;
      await this.loadSite();
    },
    createSite: async function(){
      this.showEditSiteDialog = true
    },
    editSite: async function(site){
      this.selectedSiteId = site.id;
      this.showEditSiteDialog = true
    }
  }
};
</script>

<style scoped>
</style>

