import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import {
    longStackSupport
} from 'q';
import Vuex from 'vuex'

Vue.use(Vuex);
Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    console.log('全局导航守卫');
    console.log("to:" + to.path + "\nfrom:" + from.path);
    //
    const role = sessionStorage.getItem('ms_username');
    const login= Boolean(sessionStorage.getItem("IsLogin"));
    if(!login&&to.path!=="/login"){
        console.log("未登陆且地址不是login")
        next('/login');
    }else{
        console.log("过去")
        next()
    }
    // console.log(role)
    // if (!role && to.path !== '/login') {
    //     console.log("转到login")
    //     next('/login');
    // } else if (to.meta.permission) {
    //     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    //     role === 'admin' ? next() : next('/403');
    // } else {
    //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //             confirmButtonText: '确定'
    //         });
    //     } else {
    //         next();
    //     }
    // }
})

//创建一个简单的store 小型程序不需要很多共享状态 就不用vuex
const store = new Vuex.Store({
    state: {
        tt: 123
    },
    //getters相当于store的计算属性也可以缓存内容
    getters: {
        IsLogin: state => {
            return  window.sessionStorage.getItem("IsLogin")
        }
    },

    //mutations相当于React-redux里面的dispatch()
    //但是mutation必须是同步函数
    mutations: {
        login(state,n) {
            console.log("state==",state)
            state.IsLogin= n?n:true
            // state.IsLogin = true
            // 保存在localstorage 中
            window.sessionStorage.setItem("IsLogin", state.IsLogin)
        },
        logout(state) {
            state.IsLogin = false
        }
    },
    //异步提交commit ，并不是直接修改状态，而是提交commit
    // 可以包含异步操作
    actions:{
        login({commit,dispatch}){
            //异步提交login操作
            // dispatch("login").then(()=>{console.log('登陆成功');})
            console.log("Action -login");
            commit("login")
        }
    }
})
let vapp = new Vue({
    router,
    store, //// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
    render: h => h(App), //等同于 render:function(createElement){return  createElement(App)}
}).$mount('#app')