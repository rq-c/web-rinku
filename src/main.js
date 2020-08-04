import Vue from 'vue'
import './plugins/vuetify'
import router from './router'
import App from './App.vue'
import { store } from './store/store'

Vue.config.productionTip = false

// Función para checar si las rutas necesitan el token de autenticación
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.loggedIn) {
      next({
        name: 'login'
      })
    } else {
      next()
    }
  }
   else {
    next() 
  }
})

new Vue({
  router,
  store: store,
  render: h => h(App),
}).$mount('#app')
