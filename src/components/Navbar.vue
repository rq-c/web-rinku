<template>
    <nav>
        <v-navigation-drawer v-model="pDrawer.model"  :clipped="pDrawer.clipped" :mini-variant="pDrawer.mini" absolute overflow app>
            <v-layout column class="mb-4" align-center>
                <v-flex class="mt-1">
                    <v-responsive class="pt-4 text-xs-center ma-3" >
                        <v-avatar size="70" class="grey darken-2">
                            <span class="headline">R</span> 
                        </v-avatar>
                    </v-responsive>
                        <p class="headline" v-show="pDrawer.mini == false">
                            Rinku
                            <span class="font-weight-light" v-show="pDrawer.mini == false">App</span>
                        </p>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
           <v-list v-if="loggedIn">
               <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
                   <v-list-tile-action>
                       <v-icon class="grey--text">{{ link.icon }}</v-icon>
                   </v-list-tile-action>
                   <v-list-tile-content>
                       <v-list-tile-title class="grey--text">
                           {{ link.text }}
                       </v-list-tile-title>
                   </v-list-tile-content>
               </v-list-tile>
           </v-list>
        </v-navigation-drawer>
        <v-toolbar :clipped-left="pDrawer.clipped" app absolute>
            <v-toolbar-side-icon @click="pDrawer.model = !pDrawer.model" class="grey--text"></v-toolbar-side-icon>
            <v-spacer></v-spacer>
                <v-btn flat v-if="loggedIn" @click="logout">Logout</v-btn>
        </v-toolbar>
        
    </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name:'Navbar',
    data() {
        return {
            drawer:true,
            links:[
                { icon:'dashboard', text:'Dashboard', route:'/' },
                { icon:'payment', text:'Nomina', route:'/nomina' }
            ],
             pDrawer: {
                model:      null,
                clipped:    false,
                mini:       false
            }
        }
    },
    computed: {
        ...mapGetters([
            'loggedIn'
        ])
    },
    methods:{
        logout(){
            var conf = confirm("Are you sure?")
            if (conf == true) {
                this.$store.dispatch('destroyToken')
                .then(() => {
                    this.$router.push({name: 'login'})
                })
            }
            
        }
    }
}
</script>