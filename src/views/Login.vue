<template>
    <div class="login">
        <h1 class="subheading grey--text mx-3">Login</h1>
        <v-container>
            <v-card>
                <v-card-title>
                    <span class="grey--text">Ingresa tu usuario y contraseña</span>
                </v-card-title>
                <v-container>
                    <v-form class="px-3" ref="form">
                        <v-text-field type="email" label="E-mail" v-model="result.logonId" prepend-icon="email"></v-text-field>
                        <v-text-field type="password" label="Password" v-model="result.logonPassword" prepend-icon="lock"></v-text-field>
                    </v-form>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat class="primary" @click="login">Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script>

export default {
    data() {
        return {
            result:{logonId:null, logonPassword:null, loginType:10}
        }  
    },
    methods: {
        login(){
            this.$store.dispatch('login', this.result)
            .then(() => {
                this.$router.push({name: 'dashboard'})
            }).catch(() => {
                 alert("Incorrect e-mail or password, please check them.")
            })
        }
    }
}
</script>
