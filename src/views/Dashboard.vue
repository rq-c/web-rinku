<template>
    <div class="dashboard">
        <h1 class="subheading grey--text mx-3">Dashboard</h1>
        <v-container>
            <Table :flag="flag" :items="empleados" :headers="headers"/>
        </v-container>
    </div>
</template>

<script>
import Table from "@/components/Table";
import { mapState } from 'vuex'

export default {
    components:{
        Table
    },
    data() {
        return {
            flag:'empleado',
            headers: [
                { text: 'Empleado (#)', value: 'num_empleado' },
                { text: 'Nombre', value: 'nombre' },
                { text: 'Rol', value: 'rol_id.desc_rol' },
                { text: 'Tipo', value: 'tipo_id.desc_tipo' },
                { text: 'Estatus', value: 'estatus_id.desc_estatus' },
                { text: 'Actions',  value: 'name', sortable: false, align: 'center' }
            ],
        }
    },
    mounted() {
        this.$store.dispatch('getEmployees')
    },
    computed: {
        ...mapState([
            'empleados'
        ])
    },
    methods:{
    }

}
</script>
