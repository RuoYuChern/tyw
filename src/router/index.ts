import { createRouter, createWebHistory } from 'vue-router'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ]
})

export default router
