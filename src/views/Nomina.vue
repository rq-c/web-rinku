<template>
    <div class="nomina">
        <h1 class="subheading grey--text mx-3">Nómina</h1>
        <v-container>
            <Table :flag="flag" :items="movimientos" :headers="headers"/>
        </v-container>
    </div>
</template>


<script>
import Table from '@/components/Table'
import { mapState } from 'vuex'

export default {
    components:{
        Table
    },
    data() {
        return {
            flag:'movimiento',
            items:[],
            headers: [
                { text: 'Nombre', value: 'nombre'},
                { text: 'Entregas (#)', value: 'entregas' },
                { text: 'Pago', value: 'sueldo_mov' },
                { text: 'Fecha', value: 'fecha_movto' }
            ],
        }
    },
    mounted() {
        this.$store.dispatch('getMovements')
    },
    computed: {
        ...mapState([
            'movimientos'
        ])
    }
}
</script>
