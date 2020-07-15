<template>
  <div
    :class="[{ open : nav }, 'btn']"
		@click="toggleMenu">
    {{ nav }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  State, Getter, Action, Mutation, namespace
} from 'vuex-class'

const main = namespace('main')
@Component
export default class Burger extends Vue {
  @main.State('nav') nav:any
  @main.Mutation('toggleNav') toggleNav:any 

  toggleMenu() {
    this.toggleNav()
    if (this.nav) {
      document.body.classList.add('overlayed')
    } else {
      document.body.classList.remove('overlayed')
    }
  }
  
  get active() { 
    return this.nav
  }
}
</script>

<style scoped>
.btn {
	border: 1.6px solid #000;
	border-radius: 50%;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	will-change: transform;
	transition: all .35s ease-out; 
}
.btn.open {
	border-color: #fff;
}
</style>

