import { createRouter, createWebHistory } from 'vue-router'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/',
      component: ()=> import('../views/DashBoard.vue')     
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: ()=> import('../views/DashBoard.vue')
    },
    {
      path: '/signal',
      name: 'signal',
      component: ()=> import('../views/FindSignal.vue')
    }, 
    {
      path: '/trend',
      name: 'trend',
      component: ()=> import('../views/SingleTrend.vue')
    },  
    {
      path: '/double-trend',
      name: 'double-trend',
      component: ()=> import('../views/TrendCmp.vue')
    }, 
    {
      path: '/trade-study',
      name: 'trade-study',
      component: ()=> import('../views/TradeStudy.vue')
    }, 
    {
      path: '/up-down',
      name: 'up-down',
      component: ()=> import('../views/UpDown.vue')
    },
    {
      path: '/symbol',
      name: 'symbol',
      props: route => ({ foo: route.query.q }),
      meta: {
          title: '个股详情', 
          target: '_blank'
      },
      component: ()=> import('../views/SymbolTrend.vue')
    },
    {
      path:"/hot-symbol",
      name:"hot-symbol",
      component: ()=> import('../views/HotSymbol.vue')
    },
  ]
})

export default router
