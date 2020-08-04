<template>
  <div id="table">
    <!--Dialog utilizado para modificar datos del empleado-->
    <v-dialog v-model="editDialog" width="500" persistent>
      <v-card>
          <v-card-title>
              <h2>{{head}} empleado</h2>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-layout wrap justify-space-between>
              <v-flex xs12 md4>
                <v-form ref="form">
                  <v-text-field :disabled="show" v-model="empleado.nombre" label="Nombre"></v-text-field>
                  <v-text-field :disabled="show" v-model="empleado.num_empleado" label="No. Empleado"></v-text-field>
                </v-form>
              </v-flex>

              <v-flex xs12 md6>
                <v-form ref="form">
                  <v-select :items="roles" :disabled="show" v-model="empleado.rol_id" item-text="desc_rol" item-value="_id" label="Rol" prepend-icon="group"></v-select>
                  <v-select :items="tipos" :disabled="show" v-model="empleado.tipo_id"  item-text="desc_tipo" item-value="_id" label="Tipo" prepend-icon="check"></v-select>
                  <v-select :items="estatus" :disabled="show" v-model="empleado.estatus_id"  item-text="desc_estatus" item-value="_id" label="Estatus" prepend-icon="check"></v-select>
                </v-form>
              </v-flex>
            </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outline color="error" v-if="show == false" @click="editDialog = false">Cancelar</v-btn>
            <v-btn outline color="primary" @click="updateEmployee(empleado)">Aceptar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Tabla utilizada para mostrar datos del empleado y movimientos-->
    <v-data-table :headers="headers" :items="items" class="elevation-1" v-if="flag == 'empleado'">
      <template v-slot:items="props">
        <td text-center>{{ props.item.num_empleado }}</td>
        <td>{{ props.item.nombre }}</td>
        <td>{{ props.item.rol_id.desc_rol }}</td>
        <td>{{ props.item.tipo_id.desc_tipo }}</td>
        <td class="text-center">{{ props.item.estatus_id.desc_estatus }}</td>
        <td class="layout px-0 justify-center">
          <v-icon small class="mr-2" @click="showEmployee(props.item)">search</v-icon>
          <v-icon small class="mr-2" @click="editEmployee(props.item)">edit</v-icon>
          <v-icon small @click="deleteEmployee(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
    <v-data-table :headers="headers" :items="items" class="elevation-1" v-else-if="flag == 'movimiento'">
      <template v-slot:items="props">
        <td>{{ props.item.id_empleado.nombre }}</td>
        <td>{{ props.item.entregas }}</td>
        <td>{{ props.item.saldo_mov }}</td>
        <td>{{ props.item.fecha_mov }}</td>
      </template>
    </v-data-table>

    <template v-if="flag == 'movimiento'">
      <div class="text-xs-right">
      <!--Dialog utilizado para generar nomina del empleado-->
        <v-dialog v-model="dialog" width="750" persistent>
          <template v-slot:activator="{ on }">
            <v-btn color="grey darken-3" v-on="on">Generar nómina</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">Nómina</v-card-title>
            <v-form v-model="valid">
              <v-container grid-list-xl>
                <v-layout wrap justify-space-between>
                  <v-flex xs12 md5>
                      <v-select :items="empleados" :rules="rules" v-model="nomina.id_empleado" item-text="nombre" item-value="_id" label="Empleado" prepend-icon="face" required></v-select>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width min-width="300px">
                      <template v-slot:activator="{ on }">
                          <v-text-field v-model="nomina.fecha_inicio" label="Fecha Inicio" prepend-icon="event" readonly v-on="on" required></v-text-field>
                      </template>
                      <v-date-picker v-model="nomina.fecha_inicio" no-title scrollable>
                      <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.menu.save(nomina.fecha_inicio)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                    <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width min-width="300px">
                      <template v-slot:activator="{ on }">
                          <v-text-field v-model="nomina.fecha_fin" label="Fecha Fin" prepend-icon="event" readonly v-on="on" required></v-text-field>
                      </template>
                      <v-date-picker v-model="nomina.fecha_fin" no-title scrollable>
                      <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.menu2.save(nomina.fecha_fin)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-form>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outline color="error" @click="dialog = false">Cancelar</v-btn>
              <!--Se llama la función (generateNomina) para generar la nómina haciendo los calculos con la lógica requerida-->
              <v-btn outline color="success" :disabled="loading || !valid" :loading="loading" @click="generateNomina">Generar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--Dialog que muestra los datos de la nómina ya calculda-->
        <v-dialog v-model="dialog2" max-width="600px" persistent>
          <v-card>
            <v-card-title class="headline grey darken-3" primary-title>
              Nómina 
              <v-spacer></v-spacer>
              <span class="body-1">Entre las fechas: {{r_nomina.fecha_inicio}} - {{r_nomina.fecha_fin}}</span> 
            </v-card-title>
    
            <v-card-text>
              <v-form>
                <v-container>
                  <v-layout row wrap>
                    <v-flex x12 sm6>
                      <h3>Datos del empleado</h3>
                      <v-text-field v-model="r_nomina.empleado" label="Nombre" disabled></v-text-field>
                      <v-text-field v-model="r_nomina.n_empleado" label="No. Empleado" disabled></v-text-field>
                      <v-text-field v-model="r_nomina.dias_trabajados" label="Días trabajados" disabled></v-text-field>
                    </v-flex>
                     <v-flex x12 sm6>
                       <h3>Pago de nómina</h3>
                      <v-text-field v-model="r_nomina.total_parcial" label="Total Parcial" disabled></v-text-field>
                      <v-text-field v-model="r_nomina.isr" label="ISR" disabled></v-text-field>
                      <v-text-field v-model="r_nomina.vales" label="Vales" disabled></v-text-field>
                      <v-text-field v-model="r_nomina.total_neto" label="Total Neto" disabled></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outline color="error" @click="dialog2 = false">Cancelar</v-btn>
              <!--Se almacena la nómina generada en nuestra base de datos-->
              <v-btn outline color="primary" @click="addNomina">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <Popup :flag="flag"/>
  </div>
</template>

<script>
import Popup from "@/components/Popup"
import {mapState} from 'vuex'

  export default {
    components:{
        Popup
    },
    props:{
      items:Array,
      headers:Array,
      flag:String
    },
    data () {
      return {
        valid:true,
        date:null,
        nomina:{fecha_inicio:null,fecha_fin:null, id_empleado:null},
        menu: false,
        menu2: false,
        dialog:false,
        dialog2:false,
        editDialog:false,
        loading:false,
        show:false,
        head:null,
        empleado:{},
        msg:null,
        alert:false,
        rules: [
          v => !!v || 'Is required'
        ],
      }
    },
    mounted() {
      //se ejecutan los siguientes métodos de mi 'store'
        this.$store.dispatch('getType')
        this.$store.dispatch('getRol')
        this.$store.dispatch('getStatus')
        this.$store.dispatch('getEmployees')
    },
    computed: {
      //se hace referencia al state de mi 'store (vuex)' 
        ...mapState([
            'tipos',
            'roles',
            'estatus',
            'empleados',
            'r_nomina'
        ])
    },
    methods: {
      addNomina(){ //guardar nómina
          this.$store.dispatch('addNomina', this.$store.state.r_nomina)
          this.dialog2 = false
          alert('Nómina guardada')

          
      },
      editEmployee (item) { //mostrar datos para editar
        this.head='Editar'
        this.show = false
        this.editDialog = true
        this.empleado = item
      },
      updateEmployee(e){ //modificar datos del empleado
          this.$store.dispatch('updateEmployee', e)
          this.editDialog = false
      },
      showEmployee(item){ //mostrar datos del empleado 
        this.head='Mostrar'
        this.show = true
        this.editDialog = true
        this.empleado = item
      },
      deleteEmployee (item) { //eliminar empleado
        var emp = { _id:item._id, estatus:0 }
        confirm('Are you sure you want to delete this item?') && this.$store.dispatch('deleteEmployee', emp)
      },
      generateNomina(){ //hacer el cálculo de nómina
        this.loading = true
        this.$store.dispatch('generateNomina', this.nomina)
        this.loading = false
        this.dialog2 = true
      }
    }
  }
</script>

