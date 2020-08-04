<template>
  <v-app dark>
    <Navbar/>
    <v-content class="mx-2 mb-4 mt-4">
     <router-view></router-view>
    </v-content>
    <Footer/>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
  name: 'App',
  components:{
    Navbar
  }
}
</script>