import "babel-polyfill";
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import {Message} from 'element-ui';
import 'element-ui/lib/theme-default/index.css'
import './assets/iconfont/iconfont.css'
import './assets/less/base.less'

import axios from 'axios'
import VueAxios from 'vue-axios'
import {tj} from '../src/utils/tj'
import api from '../src/api/index'

// axios.defaults.headers.common['Authorization'] = "Bearer 6a46dc3a-c90f-4496-b715-851c7dc53850";
axios.interceptors.request.use(  
    config => {  
        if(config.method=='post'){  
            config.data = {  
                ...config.data,  
                _t: Date.parse(new Date())/1000,  
            }  
        }else if(config.method=='get'){  
            config.params = {  
                _t: Date.parse(new Date())/1000,  
                ...config.params  
            }  
        }  
        return config  
    },function(error){  
        return Promise.reject(error)  
    }  
) 

Vue.prototype.$tj = tj
Vue.prototype.$api = api
Vue.prototype.$get = axios.get
Vue.prototype.$post = axios.post
Vue.prototype.$Message = Message


Vue.use(VueAxios,axios);
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
