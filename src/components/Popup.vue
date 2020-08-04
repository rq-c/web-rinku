<template>
    <div class="popup">
        <!--Dialog utilizado para guardar empleado o movimientos del empleado-->
        <v-dialog max-width="600px" v-model="dialog" persistent>
            <v-btn dark fab fixed bottom right color="blue darken-3" slot="activator">
                <v-icon>add</v-icon>
            </v-btn>
            <v-card>
                <v-card-title>
                    <h2>Agregar nuevo {{ flag }}</h2>
                </v-card-title>
                <v-container>
                    <v-form class="px-3" ref="form" v-if="flag == 'empleado'" v-model="valid">
                        <v-text-field type="number" :rules="rules" label="# Empleado" v-model="employee.num_empleado" prepend-icon="label"></v-text-field>
                        <v-text-field label="Nombre" :rules="rules" v-model="employee.nombre" prepend-icon="face"></v-text-field>
                        <v-select :items="roles" :rules="rules" v-model="employee.rol_id" item-text="desc_rol" item-value="_id" label="Rol" prepend-icon="group"></v-select>
                        <v-select :items="tipos" :rules="rules" v-model="employee.tipo_id"  item-text="desc_tipo" item-value="_id" label="Tipo" prepend-icon="check"></v-select>
                        <v-select :items="estatus" :rules="rules" v-model="employee.estatus_id"  item-text="desc_estatus" item-value="_id" label="Estatus" prepend-icon="check"></v-select>
                    </v-form>
        
                    <v-form class="px-3" ref="form" v-if="flag == 'movimiento'"  v-model="valid">
                        <v-select :items="empleados" :rules="rules" v-model="movement.id_empleado" item-text="nombre" item-value="_id" label="Empleado" prepend-icon="face"></v-select>
                        <v-text-field label="# Entregas" :rules="rules" v-model="movement.entregas" prepend-icon="local_shipping"></v-text-field>
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width min-width="300px">
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="rules" v-model="movement.fecha_mov" label="Fecha de movimiento" prepend-icon="event" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker :rules="rules" v-model="movement.fecha_mov" no-title scrollable>
                            <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.menu.save(movement.fecha_mov)">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                        <v-switch v-model="switch1" :label="`Cubrió turno?`"></v-switch>
                        <v-select :items="roles" v-model="movement.cubrio_opc" v-if="switch1 == true" item-text="desc_rol" item-value="num_rol" label="Rol" prepend-icon="group"></v-select>
                    </v-form>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat class="error" @click="dialog = false" :loading="loading">Cancelar</v-btn>
                    <v-btn flat class="success" v-if="flag == 'empleado'" :disabled="!valid" @click="addEmployee" :loading="loading">Aceptar</v-btn>
                    <v-btn flat class="success" v-if="flag == 'movimiento'" :disabled="!valid" @click="addMovement" :loading="loading">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props:{
        flag:String,
    },
    data() {
        return {
            valid:true,
            switch1: false,
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            dialog:false,
            loading:false,
            employee:{num_empleado:null,nombre:null,rol_id:null,tipo_id:null,estatus_id:null, estatus:1},
            movement:{folio_mov:0,id_empleado:null,entregas:null,saldo_mov:0,fecha_mov:null, cubrio_opc:0},
            rules: [
                v => !!v || 'Is required'
            ],
        }
    },
    mounted() {
        this.$store.dispatch('getType')
        this.$store.dispatch('getRol')
        this.$store.dispatch('getStatus')
        this.$store.dispatch('getEmployees')
    },
    computed: {
        ...mapState([
            'tipos',
            'roles',
            'estatus',
            'empleados'
        ])
    },
    methods: {
        addEmployee(){
            this.$store.dispatch('addEmployee', this.employee)
            alert('Empleado registrado')
            this.dialog = false
        },
        addMovement(){
            this.movement.folio_mov = Math.floor((Math.random() * 999999999999999) + 1)
            this.$store.dispatch('addMovement', this.movement)
            alert('Movimiento guardado')
            this.dialog = false
            
        }
    }
}
</script>