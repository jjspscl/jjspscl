<template>
	<section class="topnav">
    <div class="title">
      <h1>JOSHUA JOHN PASCUAL</h1>
      <h3>Programmer + Liverlover</h3>
    </div>
		<div class="menu-button">
			<Burger/>
		</div>
	</section>
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
.topnav {
  padding-top: 50px;
  display: flex;
  z-index: 10;
}

.topnav .menu-button {
  z-index: 10;
  width: 40px;
  height: 40px;
  margin: 0 0 0 auto;
  cursor: pointer;
  transition: -webkit-transform .5s ease-out;
  transition: transform .5s ease-out;
  transition: transform .5s ease-out,-webkit-transform .5s ease-out;
  will-change: transform;
  right: 15px;
  pointer-events: auto;
}

@media only screen and (min-width: 320px) {
	.topnav {
		padding-top: 15px;
	}
	.title {
		max-width: 20vw;
	}
}
@media only screen and (min-width: 768px) {
	.topnav {
		padding-top: 30px;
	}
}
@media only screen and (min-width: 1200px) {
}
@media only screen and (min-width: 1600px) {
}

</style>

