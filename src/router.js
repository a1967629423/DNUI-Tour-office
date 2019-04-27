import VueRouter from 'vue-router'

let routes = [
    {
      path: '/login',
      name: 'login',
      component: async () =>
        import('./containers/Login.vue'),
      meta: {},
    },
    {
      path: '/',
      props: true,
      component: async () =>
        import('./layouts/Base.vue'),
      meta: {},
      children: [
        {
          path: '/',
          component: async () =>
            import('./containers/Index.vue'),
        },
        {
          path: '/site',
          component: async () =>
            import('./containers/SiteList.vue'),
        },
        {
          path: '/404',
          component: async () =>
            import('./containers/404.vue'),
        },
      ]
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
export default new VueRouter({ routes });