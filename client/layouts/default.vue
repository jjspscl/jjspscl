<template>
  <main :class="{ overlayed: nav }">
    <Menu/>
    <TopNav/>
    <section 
      class="content">
      <nuxt />
    </section>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {
  State, namespace
} from 'vuex-class';

const main = namespace('main');
@Component
export default class Index extends Vue {
  @main.State('nav') nav !:boolean;
}
</script>
<style>
:root {
  /*font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',*/
    /*Roboto, 'Helvetica Neue', Arial, sans-serif;*/
  font-family: BwModelica;
  font-size: 16px;
  word-spacing: 1px;
  letter-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  
  --black: #27282C;
  --red: #df6e08;
  --yellow: #ffdd58;
  --blue: #5005e5;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

body {
  overflow-x: hidden;
}
#__nuxt {
  top: 0;
  left: 0;
  width: 100vw;
}

main {
  background-color: var(--black);
  color: white;
  position: static;
  overflow: auto;
}

.overlayed {
  overflow-y: hidden !important;
}

section {
  max-width: 1680px;
  margin: 0 auto;
}

section.content { 
  height: 1500px;
}

@media only screen and (min-width: 320px) {
  section {
    max-width: 90vw;
  }
}
@media only screen and (min-width: 768px) {
  section {
    max-width: calc(768px - 15vw);
  }
}
@media only screen and (min-width: 1200px) {
  section {
    max-width: calc(1200px - 15vw);
  }
}
@media only screen and (min-width: 1600px) {
  section {
    max-width: 60vw; 
  }
}

</style>

