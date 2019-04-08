<template lang="pug">
  el-card.page-account
    .titlebox
      h1 DNUI-Tour
      h3 登录
    el-form(:model='form', :rules='rule', ref='form', @submit.native.prevent='')
      el-form-item(prop='email')
        el-input(type='text', v-model='form.username', placeholder="用户名")
      el-form-item(prop='password')
        el-input(type='password', v-model='form.password', placeholder="密码", auto-complete='off')
      el-form-item
        el-button.btn(type='primary', native-type='submit', @click='submitForm()', :loading='formSubmiting') 提交
</template>

<script>
export default {
  data: function () {
    return { form:{username: "", password: ""}}
  }
};
</script>

<style scoped>
.page-account {
    width: 420px;
    margin: 48px auto 0;
  }
  .page-account .el-form{
    text-align: left;
    padding: 20px 32px;
  }
  .btn{
    width: 100%;
  }
  .page-account .titlebox{
    text-align: center;
  }

</style>

