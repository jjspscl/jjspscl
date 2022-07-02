<script lang="ts">
import { ref, HTMLAttributes } from "vue";

export default {
  setup() {
    const lang = ref<HTMLAttributes["lang"]>("tl");

    return { lang };
  }
};
</script>

<template>
    <html :lang="lang">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>JOSHUA PASCUAL</title>
    </head>


    <body>
        <slot />
    </body>

    </html>
</template>
<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        font-size: 100%;
        vertical-align: baseline;
        background: transparent;
    }
</style>
