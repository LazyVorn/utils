import Vue from 'vue'
import Router from 'vue-router'
import Body from './views/Body.vue'
import About from './views/About.vue'
import Week from './views/Week.vue'
import Plan from './views/Plan.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:projectId/VueRouteFrame',
      name: 'body',
      component: Body
    },
    {
      path: '/:projectId/about',
      name: 'about',
      component: About
    },
    {
      path: '/:projectId/Week',
      name: 'Week',
      component: Week
    },
    {
      path: '/:projectId/Plan',
      name: 'Plan',
      component: Plan
    }
  ]
})
