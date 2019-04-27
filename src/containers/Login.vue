<template lang="pug">
  el-card.page-account
    .titlebox
      h1 DNUI-Tour
      h3 登录
    el-form(:model='form', :rules='rules', ref='form', @submit.native.prevent='')
      el-form-item(prop='email')
        el-input(type='text', v-model='form.username', placeholder="用户名")
      el-form-item(prop='password')
        el-input(type='password', v-model='form.password', placeholder="密码", auto-complete='off')
      el-form-item
        el-button.btn(type='primary', native-type='submit', @click='doLogin()') 提交
</template>

<script>
import ApiService from '../services/ApiService.js';

export default {
  data: function () {
    return { 
      form:{username: "", password: ""},
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' },
          { type: "string", pattern: /^[a-z0-9-.]{3,30}(#[a-z0-9-.]+)?$/, message: '只允许使用小写字母和数字', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    async doLogin() {
        let response = (await ApiService.request(this).post('/user/login',{
          username: this.form.username,
          password: this.form.password
        })).data
        if(response.session.token) await ApiService.login(response.session, response.user)
        this.$message({
          message: '登陆成功',
          type: 'success'
        });
        this.$router.push({path: '/'})
    }
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

