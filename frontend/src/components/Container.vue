<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
const count = ref(0);

function increment() {
    count.value++
}

onMounted(() => {
    console.log(`The initial count is ${count.value}.`)
})
watch(count, () => {
    console.log(`WOW ${count.value}`)
})
</script>

<template>
    <button @click="increment">Count is: {{ count }}</button>
</template>

<style scoped >
button {
    font-weight: bold;
}
</style>