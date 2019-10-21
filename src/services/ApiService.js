import axios from 'axios'

//const API_BASEURL = 'http://tour.neusoft.edu.cn/'
const API_BASEURL = 'http://127.0.0.1:8687/'
let getUser = function () { 
  if(!localStorage || !localStorage.session || !localStorage.user) return null
  return {
    session: JSON.parse(localStorage.session),
    user: JSON.parse(localStorage.user),
  }
}

let logout = function (){
  localStorage.removeItem('session')
  localStorage.removeItem('user')
}

let login = function (session, user) { 
  localStorage.setItem('session', JSON.stringify(session));
  localStorage.setItem('user', JSON.stringify(user));
}

let request = function(_this){
  let inst = axios.create({
    baseURL: API_BASEURL,
    timeout: 2000,
    //headers: {'X-Custom-Header': 'foobar'}
  });
  inst.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    const h = _this.$createElement;
    console.log("========")
    console.warn(JSON.stringify(error))
    console.log("========")
    if(error.response.status == 403){
      _this.$msgbox({
        title: '用户名或密码错误！',
        confirmButtonText: '确定',
      })
    }
    if(error.response.status == 401)
    {
      logout();
      _this.$notify({
        title: '需要登陆',
        message: '登陆已过期或登陆失效，请重新登陆',
        type: 'warning'
      });
      _this.$router.push({path: '/login'})
    }
    if(error.response.status == 500){
      _this.$msgbox({
        title: 'Oops，服务器返回500错误！',
        message: h('div', null, [
          h('p', null, error.response.data.name),
          h('p', null, error.response.data.message),
          h('pre', { style: 'color: teal;overflow:auto;' }, error.response.data.stack)
        ]),
        confirmButtonText: '确定',
      })
    }
    return error
  });
  return inst
}


let authedRequest = function(_this,timeout=50000){
  if(!getUser()){
    _this.$notify({
      title: '需要登陆',
      message: '登陆已过期或登陆失效，请重新登陆',
      type: 'warning'
    });
    _this.$router.push({path: '/login'})
  }
  let inst = axios.create({
    baseURL: API_BASEURL,
    timeout: timeout,
    headers: {'X-Admin-Token': getUser().session.token}
  });
  inst.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    const h = _this.$createElement;
    if(error.response.status == 401){
      _this.$notify({
        title: '需要登陆',
        message: '登陆已过期或登陆失效，请重新登陆',
        type: 'warning'
      });
      _this.$router.push({path: '/login'})
    }
    if(error.response.status == 500){
      _this.$msgbox({
        title: 'Oops，服务器返回500错误！',
        message: h('div', null, [
          h('p', null, error.response.data.name),
          h('p', null, error.response.data.message),
          h('pre', { style: 'color: teal;overflow:auto;' }, error.response.data.stack),
          h('pre', { style: 'color: teal;overflow:auto;' }, error.response.data)
        ]),
        confirmButtonText: '确定',
      })
    console.warn(error)

    }
    return Promise.reject(error);
  });
  return inst
}

export default {
  request: request,
  authedRequest: authedRequest,
  api: API_BASEURL,
  logout: logout,
  login: login
}