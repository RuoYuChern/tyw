// import { userTokenStore } from '@/stores/stores'
import { userTokenStore } from '@/stores/stores'
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
    {
      path:"/user-register",
      name:"user-register",
      component: ()=> import('../views/UserRegister.vue')
    },
    {
      path:"/user-login",
      name:"user-login",
      component: ()=> import('../views/UserLogin.vue')
    },
    {
      path:"/do-trading",
      name:"do-trading",
      component: ()=> import('../views/DoTrading.vue'),
      meta:{
        requiresAuth:true 
      }
    },{
      path:"/quant-cal",
      name:"quant-cal",
      component: ()=> import('../views/QuantCal.vue'),
      meta:{
        requiresAuth:true 
      }
    },            
  ]
})

router.beforeEach((to, from, next) =>{
  if(to.meta.requiresAuth){
      const userToken = userTokenStore()
      if(!userToken.isAuth()){
        next({name:'user-login', query: {redirect: to.fullPath}})
      }else{
        next()
      }
  }else{
      next()
  }
})

export default router
