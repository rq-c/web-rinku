import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import CONST  from '@/const.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    token:localStorage.getItem('access_token') || null,
    title:'empleados',
    empleados:[],
    tipos:[],
    roles:[],
    estatus:[],
    movimientos:[],
    r_nomina:{}
  },
  actions: {
    getType({commit}){
      axios.get(CONST.BASE_URL + CONST.EMPLOYEES.GETYPE)
      .then(response =>{
          let tipos = response.data.data
          commit('SET_TYPES', tipos)
      })
      .catch(e =>{
          return e
      })
    },
    getRol({commit}){
      axios({
        method: 'get',
        url: CONST.BASE_URL + CONST.EMPLOYEES.GETROL, 
        headers: {'Content-Type':'application/json'}
        }).then(response => {
          let roles = response.data.data
          commit('SET_ROLES', roles)
        }).catch(e => {
            return e
      })
    },
    getStatus({commit}){
      axios({
        method: 'get',
        url: CONST.BASE_URL + CONST.EMPLOYEES.GETSTATUS, 
        headers: {'Content-Type':'application/json'}
        }).then(response => {
          let estatus = response.data.data
          commit('SET_STATUS', estatus)
        }).catch(e => {
            return e
      })
    },
    getEmployees({commit}){
      axios({
        method: 'get',
        url: CONST.BASE_URL + CONST.EMPLOYEES.GET, 
        headers: {'Content-Type':'application/json'}
        }).then(response => {
          let empleados = response.data.data
          commit('SET_EMPLOYEES', empleados)
        }).catch(e => {
            return e
      })
    },
    getMovements({commit}){
      axios({
        method: 'get',
        url: CONST.BASE_URL + CONST.NOMINA.GET_MOVEMENT, 
        headers: {'Content-Type':'application/json'}
        }).then(response => {
          let movimientos = response.data.response.data
          commit('SET_MOVEMENTS', movimientos)
        }).catch(e => {
            return e
      })
    },
    addEmployee(context, payload){
      axios({
        method: 'post',
        url: CONST.BASE_URL + CONST.EMPLOYEES.ADD, 
        data: payload,
        headers: {'Content-Type':'application/json'},
        }).then(response => {
            context.dispatch('getEmployees')
            return response.data
        }).catch(e => {
            return e
      })
    },
    addMovement(context, payload){
      axios({
          method: 'post',
          url: CONST.BASE_URL + CONST.NOMINA.ADD_MOVEMENT, 
          data: payload,
          headers: {'Content-Type':'application/json'},
          }).then(response => {
            context.dispatch('getMovements')
            return response.data
          }).catch(e => {
              return e
      })
    },
    addNomina(context, payload){

      var nomina = {
        folio: Math.floor((Math.random() * 999999999999999) + 1),
        n_empleado: payload.n_empleado,
        fecha_inicio: payload.fecha_inicio,
        fecha_fin: payload.fecha_fin,
        dias_trabajados: payload.dias_trabajados,
        fechas_trabajadas: payload.fechas_trabajadas,
        total_parcial: payload.total_parcial,
        isr: payload.isr,
        vales: payload.vales,
        total_neto: payload.total_neto,
        fecha_nomina: payload.fecha_nomina
      }
      axios({
          method: 'post',
          url: CONST.BASE_URL + CONST.NOMINA.ADD_NOMINA, 
          data: nomina,
          headers: {'Content-Type':'application/json'},
          }).then(response => {
            return response.data
          }).catch(e => {
              return e
      })
    },
    updateEmployee(context, payload){
      var empleado = {
                        num_empleado:payload.num_empleado,
                        nombre:payload.nombre,
                        rol_id:payload.rol_id,
                        tipo_id:payload.tipo_id,
                        estatus_id:payload.estatus_id
                      }
      axios({
        method: 'put',
        url: CONST.BASE_URL + CONST.EMPLOYEES.UPDATE, 
        params: {id:payload._id},
        data: empleado,
        headers: {'Content-Type':'application/json'}
        })
        .then(response => {
          context.dispatch('getEmployees')
          return response
        }).catch(e => {
          return e
      })
    },
    deleteEmployee(context, payload){
      var empleado = {
                        estatus:payload.estatus
                      }
      axios({
        method: 'put',
        url: CONST.BASE_URL + CONST.EMPLOYEES.UPDATE, 
        params: {id:payload._id},
        data: empleado,
        headers: {'Content-Type':'application/json'}
        })
        .then(response => {
          context.dispatch('getEmployees')
          return response
        }).catch(e => {
          return e
      })
    },
    generateNomina({commit}, payload){
      axios({
        method: 'post',
        url: CONST.BASE_URL + CONST.NOMINA.GENERATE, 
        data: payload,
        headers: {'Content-Type':'application/json'}
        }) 
        .then((response) => {
          let nomina = response.data.response
          commit('SET_NOMINA', nomina)
        }).catch(e => {
            return e
  
      })
    },
    login(context, payload){
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: CONST.LOGIN_URL, 
          data: payload,
          headers: {'Content-Type':'application/json'},
          }).then(response => {
            const token =  response.data.token
            localStorage.setItem('access_token', token)
            context.commit('RETRIEVE_TOKEN', token)
            resolve(response)
          }).catch(e => {
              reject(e)
        })

      })
    },
    destroyToken(context){
      if(context.getters.loggedIn){
        localStorage.removeItem('access_token')
        context.commit('DESTROY_TOKEN')
      }
    }
  },
  mutations: {
    DESTROY_TOKEN(state){
      state.token = null
    },
    RETRIEVE_TOKEN(state, token){
      state.token = token
    },
    SET_TYPES(state, tipos){
      state.tipos = tipos
    },
    SET_ROLES(state, roles){
      state.roles = roles
    },
    SET_STATUS(state, estatus){
      state.estatus = estatus
    },
    SET_EMPLOYEES(state, empleados){
      state.empleados = empleados
    },
    SET_MOVEMENTS(state, movimientos){
      state.movimientos = movimientos
    },
    SET_NOMINA(state, nomina){
      state.r_nomina = nomina

    }
  },
  getters: {
    loggedIn(state){
      return state.token !== null
    }
  }
})