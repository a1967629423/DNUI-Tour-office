<template lang="pug">
.base-container
  el-menu.el-menu-top(mode="horizontal", :router="true")
    router-link(to="/")
      li.nav-title DNUI-Tour
    el-menu-item(index="select-project", :route="{ name: 'select-project' }") Dashboard
    el-menu-item(index="account", :route="{ name: 'account' }") 账户
    el-submenu(style="float:right",index="setting")
      template(slot='title')
        span User
      el-menu-item(index="logout", :route="{ name: 'logout' }") 退出
  .container
    .project-content(style="margin: 20px;")
      router-view()
</template>

<style>
.nav-title {
  font-size: 20px;
  float: left;
  height: 60px;
  line-height: 60px;
  padding: 0 32px;
  outline: none;
  color: #333;
}
.nav-title:hover{
  color: #409EFF;
}
</style>
