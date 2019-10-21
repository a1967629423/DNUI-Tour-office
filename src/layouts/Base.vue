<template lang="pug">
el-container.base-container
  el-header.base-header
    h1 DNUI-Tour
  el-container
    el-aside
      el-menu(:router="true",:default-active='defaultActive', style='min-height: 100%;', theme='dark', router='')
        el-menu-item(index='manage',:route="{ path: '/' }")
          i.el-icon-menu
          | Dashboard
        el-submenu(index='2')
          template(slot='title')
            i.el-icon-document
            | 地点
          el-menu-item(index='siteList',:route="{ path: '/site' }") 地点列表
        el-submenu(index='3')
          template(slot='title')
            i.el-icon-plus
            | 添加数据
          el-menu-item(index='addImage',:route="{path:'/image'}") 添加图片
          el-menu-item(index='addAudio',:route="{path:'/audio'}") 添加音频
    el-main
      .container
        .project-content(style="margin: 20px;")
          router-view()
</template>

<style>
body, div, span, header, footer, nav, section, aside, article, ul, dl, dt, dd, li, a, p, h1, h2, h3, h4,h5, h6, i, b, textarea, button, input, select, figure, figcaption {
    padding: 0;
    margin: 0;
    list-style: none;
    font-style: normal;
    text-decoration: none;
    border: none;
    font-family: "Microsoft Yahei",sans-serif;
    -webkit-tap-highlight-color:transparent;
    -webkit-font-smoothing: antialiased;
}
.base-header{
  background-color: #409EFF;
  color: #fff;
  line-height: 60px;
}

.page-main{
  background: #fff;
  padding: 20px;
}
.page-header{
  line-height: 40px;
  font-size: 20px;
  margin-bottom: 20px;
}
.page-header .right{
  text-align: right;
}
</style>
