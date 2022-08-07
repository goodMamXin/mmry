import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
// 第三方库需要use一下才能用
Vue.use(VueRouter)

// 静态导入
// import Msginfo from '../components/msginfo'
// import page1 from '../components/page1'
// 动态导入(路由懒加载)
// const UserDetails = () => import('./views/UserDetails')

// 定义routes路由的集合，数组类型
const routes = [
  // 单个路由均为对象类型，path代表的是路径，component代表组件
  {
    path:'/',
    name:'msginfo',
    component:function(resolve){
      require(['../components/MsgInfo.vue'],resolve) 
    },
    meta: {
      title:'健康打卡详情'
    }
    /*
    // 进入组件时执行
    // 路由独享守卫 作用：单个路由内部进行参数传递    
    // 不！能！获取组件实例 `this`
    beforeEnter: (to, from, next) => {
      console.log("beforeEnter", to, from);
      next()
    }*/
  },  
  {
    path:'/msginfo',
    name:'msginfo',
    component:function(resolve){
      require(['../components/MsgInfo.vue'],resolve) 
    },
    meta: {
      title:'健康打卡详情'
    }
  },
  {
    path:'/updepinfo',
    name:'updepinfo',
    component:function(resolve){
      require(['../components/UpdepInfo.vue'],resolve) 
    },
    meta: {
      title:'打卡调科'
    }
  },
  {
    path:'/unlock',
    name:'unlock',
    component:function(resolve){
      require(['../components/Unlock.vue'],resolve) 
    },
    meta: {
      title:'解除锁定'
    }
  },
  {
    path:'/noCheckedIn',
    name:'noCheckedIn',
    component:function(resolve){
      require(['../components/NoCheckedIn.vue'],resolve) 
    },
    meta: {
      title:'未打卡人员'
    }
  }
];

// 实例化Router并将routes添加进去
const router = new VueRouter({
  // ES6简写，等于routes：routes
  routes
});

// 前置守卫--路由跳转之前
// 每次跳转路由之前，都会拦截，next方法表示下一步
router.beforeEach((to, from, next) => {
  /*
  // 获取浏览器的缓存中，保存的当前登录用户的权限
  let role = sessionStorage.getItem('role')
  // 验证用户访问权限
  if(to.meta.roles && to.meta.roles.includes(role)){
    // next()方法，表示继续向下执行
    next()
  }
  */
  // 获取浏览器url的参数
  // let url_param_uid = this.$route.query.uid;
  // console.log('url_param_uid = ' + url_param_uid);
  // console.log(to);

  // 路由发生变化修改页面title ,配置当前页的标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // to: 即将要进入的目标 路由对象
  // from: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
  // next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
  // next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。
  // next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

  // console.log(to);
  window.scrollTo(0, 0); // 跳转到新页面 页面滚动到顶部；
  next();  
});

// 后置守卫--路由跳转完成
router.afterEach((to, from) => {
  // console.log(to)
  // console.log(from)  
})



// 抛出这个这个实例对象方便外部读取以及访问
export default router

/*
export default new Router({
  routes: [
    {
      path: '/',// 默认路由地址
      name: 'Msginfo',
      //component: function(resolve){ require(['../components/Msginfo.vue'],resolve) },      
      //component: function(resolve){ require(['../components/msginfo'],resolve)},
      //component: () => import('../components/Msginfo.vue'),
      //component: Msginfo,
      meta: {
        title:'健康打卡明细'
      }
    }
  ]
})
*/
