import "babel-polyfill";
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-default/index.css'
import './assets/iconfont/iconfont.css'
import './assets/less/base.less'

import axios from 'axios'
import VueAxios from 'vue-axios'
import api from '../src/api/index'

import Util from '../src/utils/utils'
import DateInput from './components/DateInput.vue'
import LvSelect from './components/LvSelect.vue'
Vue.prototype.$api = api
Vue.prototype.$get = axios.get
Vue.prototype.$post = axios.post
Vue.prototype.$Message = Message

Vue.prototype.$Util = Util

Vue.component('LvSelect', LvSelect);
Vue.component('DateInput', DateInput);


Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
