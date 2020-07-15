<template>
  <div class="menu">
    <div 
      class="navbar"
      :class="{ nactive: active }">
      <h1>YES</h1>
      <h1>YEs</h1>
      <h1>YES</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  State, namespace
} from 'vuex-class';

const main = namespace('main')
@Component
export default class Menu extends Vue {
  middleware (){
    console.log('YEAH: ', this.nav)
  }
  @main.State('nav') nav:any
   
  get active() {
    return this.nav
  }
}
</script>

<style>
div.menu {
	position: absolute;
	height: 100%;
  width: 100%;
	pointer-events: none;
	will-change: transform;
}
.navbar {
  position: absolute;
  background-color: #000000;
  right: 0;
  z-index: 5;
  width: 0;
  opacity: 0;
  height: 100vh;
  transition: 0.75s ease;
}

.nactive {
  width: 40vw;
  opacity: 1;
}
@media only screen and (min-width: 320px) {
  .nactive {
    width: 100vw;
  }
}
@media only screen and (min-width: 600px) {
  .nactive {
    width: 75vw;
  }
}
@media only screen and (min-width: 768px) {
  .nactive {
    width: 45vw;
  }
}
@media only screen and (min-width: 1200px) {
  .nactive {
    width: 40vw;
  }
}

</style>
